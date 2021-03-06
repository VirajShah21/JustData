import Scraper from './Scraper';
import ScraperDatabase, { ScrapedDocument } from './ScraperDatabase';

const FUGITIVE_LI_CLASSNAME = '.portal-type-person';
// ! Keep this, as it will be useful later
const WANTED_POSTER_QUERY = 'p.Download';
const LOAD_MORE_BUTTON_QUERY = 'button.load-more';
const NO_PERSON = 'Unidentified fugitive';

const tenMostWantedDatabase = new ScraperDatabase<SimpleFugitiveData>('fbi-ten-most-wanted');
const allFugitivesDatabase = new ScraperDatabase<SimpleFugitiveData>('all-fugitives');

/**
 * Scrapes the FBI's most wanted site for the ten most wanted fugitives
 * by the FBI.
 */
class TenMostWantedFugitivesScraper extends Scraper<SimpleFugitiveData> {
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
        const inDatabase = await this.findInDatabase();

        if (inDatabase) {
            return inDatabase.map(doc => doc.data);
        }

        tenMostWantedDatabase.clear();

        await this.openTab();
        const li = await this.select(FUGITIVE_LI_CLASSNAME);
        this.closeTab();

        const profileUrls = li
            .map(item => item.querySelector('a')?.getAttribute('href'))
            .filter(url => url !== undefined) as string[];

        const response = li.map((item, index) => {
            const imgSrc = item.querySelector('a')?.querySelector('img')?.getAttribute('src') ?? '';
            const fugitiveName = item.querySelector('h3.title')?.textContent ?? NO_PERSON;
            return {
                name: fugitiveName,
                mugshot: imgSrc,
                profileURL: profileUrls[index],
            };
        });

        this.saveToDatabase(tenMostWantedDatabase, ...response);

        return response;
    }

    async findInDatabase(): Promise<ScrapedDocument<SimpleFugitiveData>[] | null> {
        const exactResultSize = 10;

        const results = await tenMostWantedDatabase.findAll({});
        const now = Date.now();

        if (results.length !== exactResultSize) {
            return null;
        }

        if (results.every(result => result.expires >= now)) {
            return results;
        }

        return null;
    }
}

/**
 * Scrapes the FBI's most wanted site for every single fugitive wanted by the FBI.
 * This is a very slow scraper since it opens many URLs to scrape each fugitive's
 * full profile.
 */
class AllFugitivesScraper extends Scraper<SimpleFugitiveData> {
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
    override async scrape(): Promise<SimpleFugitiveData[] | null> {
        const inDatabase = await this.findInDatabase();

        if (inDatabase) {
            return inDatabase.map(doc => doc.data);
        }

        await this.openTab();

        while (
            await this.tab?.evaluate(
                query => (document.querySelector(query) ? true : false),
                LOAD_MORE_BUTTON_QUERY,
            )
        ) {
            await this.tab?.evaluate(query => {
                const btn = document.querySelector(query) as HTMLButtonElement;
                if (btn) {
                    btn.click();
                    return true;
                }
                return false;
            }, LOAD_MORE_BUTTON_QUERY);
        }

        const listItems = await this.select(FUGITIVE_LI_CLASSNAME);

        this.closeTab();

        const response: SimpleFugitiveData[] = listItems.map(li => {
            return {
                name: li.querySelector('p.name')?.textContent ?? NO_PERSON,
                mugshot: li.querySelector('img')?.getAttribute('src') ?? '',
                profileURL: li.querySelector('a')?.getAttribute('href') ?? '',
            };
        });

        await allFugitivesDatabase.clear();
        this.saveToDatabase(allFugitivesDatabase, ...response);

        return response;
    }

    override async findInDatabase() {
        const results = await allFugitivesDatabase.findAll({});

        if (results.length === 0) {
            return null;
        }

        return results;
    }
}

/**
 * A scraper for an individuals profile page from the FBI's most wanted
 * site.
 */
// class FugitiveProfileScraper extends Scraper<FullFugitiveData> {
//     private readonly category: string;

//     /**
//      * Constructs a new scraper.
//      *
//      * @param url - The URL for the fugitive's profile page.
//      * @param category - The criminal category the fugitive belongs to.
//      */
//     constructor(url: string, category: string) {
//         super(url);
//         this.category = category;
//     }

//     /**
//      * Scrapes the page for the fugitive's profile.
//      *
//      * @returns The fugitive's full profile data.
//      */
//     override async scrape(): Promise<FullFugitiveData | null> {
//         await this.openTab();
//         const profileBody = (await this.select('body'))[0];
//         this.closeTab();

//         const mugshot =
//             profileBody
//                 .querySelector('.wanted-person-mug')
//                 ?.querySelector('img')
//                 ?.getAttribute('src') ?? '';

//         const pictures =
//             profileBody
//                 .querySelector('.wanted-person-images')
//                 ?.querySelectorAll('li')
//                 .map(li => li.querySelector('img'))
//                 .map(img => ({
//                     src: img?.getAttribute('src') ?? '',
//                     caption: img?.getAttribute('alt') ?? '',
//                 })) ?? [];

//         const bioTable = profileBody.querySelector('table.wanted-person-description');
//         const bioTableJson: Record<string, string> = {};

//         if (bioTable) {
//             bioTable
//                 .querySelector('tbody')
//                 ?.querySelectorAll('tr')
//                 .forEach(tr => {
//                     const [key, value] = tr.querySelectorAll('td');
//                     bioTableJson[key.textContent] = value.textContent;
//                 });
//         }

//         const aliasContainer = profileBody.querySelector('p.wanted-person-aliases');
//         let aliases: string | undefined;
//         if (aliasContainer) aliases = aliasContainer.textContent;

//         let remarksContainer = profileBody.querySelector('.wanted-person-remarks');
//         let remarks: string | undefined;
//         if (remarksContainer) remarksContainer = remarksContainer.querySelector('p');
//         if (remarksContainer) remarks = remarksContainer.textContent;

//         let cautionContainer = profileBody.querySelector('.wanted-person-caution');
//         let caution: string | undefined;
//         if (cautionContainer) cautionContainer = cautionContainer.querySelector('p');
//         if (cautionContainer) caution = cautionContainer.textContent;

//         const warningContainer = profileBody.querySelector('h3.wanted-person-warning');
//         let warning: string | undefined;
//         if (warningContainer) warning = warningContainer.textContent;

//         return {
//             name: profileBody.querySelector('h1.documentFirstHeading')?.textContent ?? '',
//             posterURL:
//                 profileBody
//                     .querySelector(WANTED_POSTER_QUERY)
//                     ?.querySelector('a')
//                     ?.getAttribute('href') ?? '',
//             category: this.category,
//             charges:
//                 profileBody
//                     .querySelector('p.summary')
//                     ?.textContent.split(';')
//                     ?.map(s => s.trim()) ?? [],
//             bio: bioTable
//                 ? {
//                       alias: aliases,
//                       dob: bioTableJson['Date(s) of Birth Used'],
//                       birthplace: bioTableJson['Place of Birth'],
//                       hair: bioTableJson['Hair'],
//                       eyes: bioTableJson['Eyes'],
//                       height: bioTableJson['Height'],
//                       weight: bioTableJson['Weight'],
//                       build: bioTableJson['Build'],
//                       complexion: bioTableJson['Complexion'],
//                       sex: bioTableJson['Sex'],
//                       race: bioTableJson['Race'],
//                       occupation: bioTableJson['Occupation'],
//                       nationality: bioTableJson['Nationality'],
//                       markings: bioTableJson['Scars and Marks'],
//                   }
//                 : undefined,
//             caution: {
//                 text: caution,
//                 warning,
//             },
//             remarks,
//             mugshot,
//             pictures,
//         };
//     }

//     /**
//      * The cached results of the scraper.
//      */
//     get cache(): FullFugitiveData {
//         throw new Error('Not implemented yet');
//     }
// }

export { TenMostWantedFugitivesScraper, AllFugitivesScraper };
