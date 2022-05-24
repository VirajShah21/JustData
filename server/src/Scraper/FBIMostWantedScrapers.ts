import Scraper from './Scraper';
import ScraperCache from './ScraperCache';
import ScraperDatabase, { ScrapedDocument, ScrapedDocumentExpiration } from './ScraperDatabase';
import ScrapeUtils, { ParsedHTMLElement } from './ScrapeUtils';

const fugitiveLIClassName = '.portal-type-person';
const wantedPosterQuery = 'p.Download';
const loadMoreButtonQuery = 'button.load-more';

let tenMostWantedCache: SimpleFugitiveData[] =
    ScraperCache.initializeCache('fbi-ten-most-wanted.json', () => tenMostWantedCache) ?? [];
let allFugitivesCache: FullFugitiveData[] =
    ScraperCache.initializeCache('all-fugitives.json', () => allFugitivesCache) ?? [];

const database = new ScraperDatabase<SimpleFugitiveData>('fbi-ten-most-wanted');

/**
 * Scrapes the FBI's most wanted site for the ten most wanted fugitives
 * by the FBI.
 */
class TenMostWantedFugitivesScraper extends Scraper<SimpleFugitiveData[]> {
    /**
     * Constructs a new scraper.
     */
    constructor() {
        super('https://www.fbi.gov/wanted/topten');
    }

    /**
     * Scrapes the FBI site for the ten most wanted fugitives.
     *
     * @returns An array of the ten most wanted fugitives.
     */
    override async scrape(): Promise<SimpleFugitiveData[] | null> {
        console.log('Beginning to scrape');
        const inDatabase = await this.findInDatabase();
        if (inDatabase) return inDatabase.map(doc => doc.data);
        console.log('Done checking database');
        database.clear();

        await this.openTab();
        const li = await this.select(fugitiveLIClassName);
        this.closeTab();

        console.log('Tab closed');

        const profileUrls = li
            .map(item => item.querySelector('a')?.getAttribute('href'))
            .filter(url => url !== undefined) as string[];

        const posterUrls = (
            await Promise.all(
                profileUrls.map(async url => {
                    const page = await ScrapeUtils.getPage(url);
                    const downloadParagraphHTML = await page.evaluate(
                        query => document.querySelector(query)?.outerHTML,
                        wantedPosterQuery,
                    );
                    page.close();

                    if (downloadParagraphHTML === undefined) return null;
                    const downloadParagraph = ScrapeUtils.parseHTML(downloadParagraphHTML);

                    return downloadParagraph.querySelector('a')?.getAttribute('href') ?? null;
                }),
            )
        ).filter(url => url !== undefined && url === null) as string[];

        console.log('Compiled list of poster urls');

        const response = li.map((item, index) => {
            const imgSrc = item.querySelector('a')?.querySelector('img')?.getAttribute('src') ?? '';
            const fugitiveName =
                item.querySelector('h3.title')?.textContent ?? 'Unidentified Person';
            return {
                name: fugitiveName,
                mugshot: imgSrc,
                posterURL: posterUrls[index],
            };
        });

        response.map(data => {
            this.insertToDatabase(this.origin, response, { minutes: 30 });
        });

        return response;
    }

    /**
     * The cached results of the scraper.
     */
    override get cache(): SimpleFugitiveData[] {
        return tenMostWantedCache;
    }

    async findInDatabase(): Promise<ScrapedDocument<SimpleFugitiveData>[] | null> {
        console.log('Finding in database');
        const results = await database.findAll({});
        console.log('Found results', results);
        const now = Date.now();

        if (results.length != 10) return null;

        for (let i = 0; i < results.length; i++) {
            if (results[i].expires < now) {
                return null;
            }
        }
        console.log('Compiled fugitive data');
        return results;
    }

    async insertToDatabase(
        url: string,
        data: SimpleFugitiveData[],
        expiration: ScrapedDocumentExpiration,
    ): Promise<void> {
        const [timestamp, expires] = ScraperDatabase.lifespan(expiration);
        await database.insert({
            timestamp,
            url,
            data,
            expires,
        });
    }
}

/**
 * Scrapes the FBI's most wanted site for every single fugitive wanted by the FBI.
 * This is a very slow scraper since it opens many URLs to scrape each fugitive's
 * full profile.
 */
class AllFugitivesScraper extends Scraper<FullFugitiveData[]> {
    private static readonly batchSize = 10;

    /**
     * Constructs a new scraper.
     */
    constructor() {
        super('https://www.fbi.gov/wanted/fugitives');
    }

    /**
     * Scrapes the FBI site for every single fugitive wanted by the FBI.
     *
     * @returns An array of every single fugitive wanted by the FBI
     * and their full profile.
     */
    override async scrape(): Promise<FullFugitiveData[] | null> {
        if (allFugitivesCache.length > 0) return allFugitivesCache;

        await this.openTab();

        while (
            await this.tab?.evaluate(() =>
                document.querySelector(loadMoreButtonQuery) ? true : false,
            )
        ) {
            await this.tab?.evaluate(() => {
                const btn = document.querySelector(loadMoreButtonQuery) as HTMLButtonElement;
                if (btn) {
                    btn.click();
                    return true;
                }
                return false;
            });
        }

        const listItems = await this.select(fugitiveLIClassName);

        this.closeTab();

        const batches: ParsedHTMLElement[][] = [];
        listItems.forEach((item, index) => {
            if (index % AllFugitivesScraper.batchSize === 0) batches.push([]);
            batches[batches.length - 1].push(item);
        });

        const categories = listItems.map(
            item => item.querySelector('h3.title')?.textContent ?? 'Uncategorized',
        );

        const batchResponses = [];
        for (const batch of batches) {
            batchResponses.push(
                await Promise.all(
                    batch.map(async (item, index) => {
                        const profileUrl =
                            item
                                .querySelector('p.name')
                                ?.querySelector('a')
                                ?.getAttribute('href') ?? '';
                        const scraper = new FugitiveProfileScraper(profileUrl, categories[index]);
                        return scraper.scrape();
                    }),
                ),
            );
        }

        const response: FullFugitiveData[] = [];
        batchResponses.forEach(batch =>
            batch.forEach(result => {
                if (result) response.push(result);
            }),
        );

        allFugitivesCache = response;

        return response;
    }

    /**
     * The cached results of the scraper.
     */
    get cache() {
        return allFugitivesCache;
    }
}

/**
 * A scraper for an individuals profile page from the FBI's most wanted
 * site.
 */
class FugitiveProfileScraper extends Scraper<FullFugitiveData> {
    private readonly category: string;

    /**
     * Constructs a new scraper.
     *
     * @param url - The URL for the fugitive's profile page.
     * @param category - The criminal category the fugitive belongs to.
     */
    constructor(url: string, category: string) {
        super(url);
        this.category = category;
    }

    /**
     * Scrapes the page for the fugitive's profile.
     *
     * @returns The fugitive's full profile data.
     */
    override async scrape(): Promise<FullFugitiveData | null> {
        await this.openTab();
        const profileBody = (await this.select('body'))[0];
        this.closeTab();

        const mugshot =
            profileBody
                .querySelector('.wanted-person-mug')
                ?.querySelector('img')
                ?.getAttribute('src') ?? '';

        const pictures =
            profileBody
                .querySelector('.wanted-person-images')
                ?.querySelectorAll('li')
                .map(li => li.querySelector('img'))
                .map(img => ({
                    src: img?.getAttribute('src') ?? '',
                    caption: img?.getAttribute('alt') ?? '',
                })) ?? [];

        const bioTable = profileBody.querySelector('table.wanted-person-description');
        const bioTableJson: Record<string, string> = {};

        if (bioTable) {
            bioTable
                .querySelector('tbody')
                ?.querySelectorAll('tr')
                .forEach(tr => {
                    const [key, value] = tr.querySelectorAll('td');
                    bioTableJson[key.textContent] = value.textContent;
                });
        }

        const aliasContainer = profileBody.querySelector('p.wanted-person-aliases');
        let aliases: string | undefined;
        if (aliasContainer) aliases = aliasContainer.textContent;

        let remarksContainer = profileBody.querySelector('.wanted-person-remarks');
        let remarks: string | undefined;
        if (remarksContainer) remarksContainer = remarksContainer.querySelector('p');
        if (remarksContainer) remarks = remarksContainer.textContent;

        let cautionContainer = profileBody.querySelector('.wanted-person-caution');
        let caution: string | undefined;
        if (cautionContainer) cautionContainer = cautionContainer.querySelector('p');
        if (cautionContainer) caution = cautionContainer.textContent;

        const warningContainer = profileBody.querySelector('h3.wanted-person-warning');
        let warning: string | undefined;
        if (warningContainer) warning = warningContainer.textContent;

        return {
            name: profileBody.querySelector('h1.documentFirstHeading')?.textContent ?? '',
            posterURL:
                profileBody
                    .querySelector(wantedPosterQuery)
                    ?.querySelector('a')
                    ?.getAttribute('href') ?? '',
            category: this.category,
            charges:
                profileBody
                    .querySelector('p.summary')
                    ?.textContent.split(';')
                    ?.map(s => s.trim()) ?? [],
            bio: bioTable
                ? {
                      alias: aliases,
                      dob: bioTableJson['Date(s) of Birth Used'],
                      birthplace: bioTableJson['Place of Birth'],
                      hair: bioTableJson['Hair'],
                      eyes: bioTableJson['Eyes'],
                      height: bioTableJson['Height'],
                      weight: bioTableJson['Weight'],
                      build: bioTableJson['Build'],
                      complexion: bioTableJson['Complexion'],
                      sex: bioTableJson['Sex'],
                      race: bioTableJson['Race'],
                      occupation: bioTableJson['Occupation'],
                      nationality: bioTableJson['Nationality'],
                      markings: bioTableJson['Scars and Marks'],
                  }
                : undefined,
            caution: {
                text: caution,
                warning,
            },
            remarks,
            mugshot,
            pictures,
        };
    }

    /**
     * The cached results of the scraper.
     */
    get cache(): FullFugitiveData {
        throw new Error('Not implemented yet');
    }
}

export { TenMostWantedFugitivesScraper, AllFugitivesScraper };
