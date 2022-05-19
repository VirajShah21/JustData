import Scraper from './Scraper';
import ScraperCache from './ScraperCache';
import ScrapeUtils, { ParsedHTMLElement } from './ScrapeUtils';

let tenMostWantedCache: SimpleFugitiveData[] =
    ScraperCache.initializeCache('fbi-ten-most-wanted.json', () => tenMostWantedCache) ?? [];
let allFugitivesCache: FullFugitiveData[] =
    ScraperCache.initializeCache('all-fugitives.json', () => allFugitivesCache) ?? [];

class TenMostWantedFugitivesScraper extends Scraper<SimpleFugitiveData[]> {
    constructor() {
        super('https://www.fbi.gov/wanted/topten');
    }

    override async scrape(): Promise<SimpleFugitiveData[] | null> {
        if (tenMostWantedCache.length > 0) return tenMostWantedCache;

        await this.openTab();
        const li = await this.select('.portal-type-person');
        this.closeTab();

        const profileUrls = li.map(item => item.querySelector('a')!.getAttribute('href')!);
        const posterUrls = await Promise.all(
            profileUrls.map(async url => {
                const page = await ScrapeUtils.getPage(url);

                const downloadParagraph = ScrapeUtils.parseHTML(
                    await page.evaluate(() => document.querySelector('p.Download')!.outerHTML)
                );

                page.close();
                return downloadParagraph.querySelector('a')!.getAttribute('href')!;
            })
        );

        const response = li.map((item, index) => {
            const imgSrc = item.querySelector('a')!.querySelector('img')!.getAttribute('src')!;
            const fugitiveName = item.querySelector('h3.title')!.textContent;
            return {
                name: fugitiveName,
                mugshot: imgSrc,
                posterURL: posterUrls[index],
            };
        });

        tenMostWantedCache = response;

        return response;
    }

    override get cache(): SimpleFugitiveData[] {
        return tenMostWantedCache;
    }
}

class AllFugitivesScraper extends Scraper<FullFugitiveData[]> {
    constructor() {
        super('https://www.fbi.gov/wanted/fugitives');
    }

    override async scrape(): Promise<FullFugitiveData[] | null> {
        if (allFugitivesCache.length > 0) return allFugitivesCache;

        await this.openTab();

        while (
            await this.tab!.evaluate(() =>
                document.querySelector('button.load-more') ? true : false
            )
        ) {
            await this.tab!.evaluate(() => {
                const btn = document.querySelector('button.load-more') as HTMLButtonElement;
                if (btn) {
                    btn.click();
                    return true;
                }
                return false;
            });
        }

        const listItems = await this.select('.portal-type-person');

        this.closeTab();

        const batches: ParsedHTMLElement[][] = [];
        listItems.forEach((item, index) => {
            if (index % 10 === 0) batches.push([]);
            batches[batches.length - 1].push(item);
        });

        const categories = listItems.map(item => item.querySelector('h3.title')!.textContent);

        const batchResponses = [];
        for (const batch of batches) {
            batchResponses.push(
                await Promise.all(
                    batch.map(async (item, index) => {
                        const profileUrl = item
                            .querySelector('p.name')!
                            .querySelector('a')!
                            .getAttribute('href')!;
                        const scraper = new FugitiveProfileScraper(profileUrl, categories[index]);
                        return (await scraper.scrape())!;
                    })
                )
            );
        }

        const response: FullFugitiveData[] = [];
        batchResponses.forEach(batch => batch.forEach(result => response.push(result)));

        allFugitivesCache = response;

        return response;
    }

    get cache() {
        return allFugitivesCache;
    }
}

class FugitiveProfileScraper extends Scraper<FullFugitiveData> {
    private readonly category: string;

    constructor(url: string, category: string) {
        super(url);
        this.category = category;
    }

    override async scrape(): Promise<FullFugitiveData | null> {
        await this.openTab();
        const profileBody = (await this.select('body'))[0];
        this.tab!.close();

        const mugshot = profileBody
            .querySelector('.wanted-person-mug')!
            .querySelector('img')!
            .getAttribute('src')!;
        const pictures = profileBody
            .querySelector('.wanted-person-images')!
            .querySelectorAll('li')!
            .map(li => li.querySelector('img'))
            .map(img => ({
                src: img!.getAttribute('src')!,
                caption: img!.getAttribute('alt')!,
            }));
        const bioTable = profileBody.querySelector('table.wanted-person-description')!;
        let bioTableJson: Record<string, string> | undefined = {};
        if (bioTable) {
            bioTable
                .querySelector('tbody')!
                .querySelectorAll('tr')!
                .forEach(tr => {
                    const [key, value] = tr.querySelectorAll('td');
                    bioTableJson![key.textContent] = value.textContent;
                });
        } else bioTableJson = undefined;

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
        try {
            return {
                name: profileBody.querySelector('h1.documentFirstHeading')!.textContent,
                mugshot,
                posterURL: profileBody
                    .querySelector('p.Download')!
                    .querySelector('a')!
                    .getAttribute('href')!,
                category: this.category,
                charges: profileBody
                    .querySelector('p.summary')!
                    .textContent.split(';')
                    .map(s => s.trim()),
                pictures,
                bio: bioTableJson
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
                remarks,
                caution: {
                    text: caution,
                    warning,
                },
            };
        } catch (e) {
            throw e;
        }
    }

    get cache(): FullFugitiveData {
        throw new Error('Not implemented yet');
    }
}

export { TenMostWantedFugitivesScraper, AllFugitivesScraper };
