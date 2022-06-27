import Logger from '../utils/Logger';
import { sleep } from '../utils/TimeFunctions';
import Scraper from './Scraper';
import ScraperDatabase, { ScrapedDocument } from './ScraperDatabase';

const caseListDatabase = new ScraperDatabase<OyezCaseListItem>('oyez-case-serp');

/**
 * A Scraper to scrape the list of all cases from the Oyez website.
 * This scraper requires the term start dates (year) to be provided.
 */
class OyezCaseListScraper extends Scraper<OyezCaseListItem> {
    private readonly termStarts: number[];

    /**
     * Constructs the scraper to scrape the defined term starts.
     *
     * @param termStarts - The term starting years to scrape.
     */
    constructor(termStarts: number[]) {
        Logger.debug('Initializing scraper with terms: ' + termStarts);

        if (termStarts.length === 0) {
            throw new Error('At least one value for termStart must be provided');
        }

        super('');
        this.termStarts = termStarts;
    }

    /**
     * Scrapes the required number of Oyez pages for all cases during the
     * specified terms.
     *
     * @returns An object which maps the term start year to the list of cases
     * belonging to that term.
     */
    async scrape(): Promise<OyezCaseListItem[]> {
        const results: OyezCaseListItem[] = [];

        await Promise.all(
            this.termStarts.map(async ts => {
                const scraper = new OyezTermCaseListScraper(ts);
                results.push(...(await scraper.scrape()));
            }),
        );

        Logger.debug('Found all results ' + results.length);

        return results;
    }

    async findInDatabase(): Promise<ScrapedDocument<OyezCaseListItem> | null> {
        throw new Error(
            'findInDatabase cannot be called on OyezCaseListScraper, it should instead be called on OyezTermCaseListScraper for a specific term',
        );
    }
}

/**
 * A scraper to scrape the list of all cases from the Oyez website
 * for a specified term.
 */
class OyezTermCaseListScraper extends Scraper<OyezCaseListItem> {
    private static readonly loadDelay = 500;

    private readonly termStart: number;

    /**
     * Constructs a scraper for the specified term start.
     *
     * @param termStart - The term start year to scrape.
     */
    constructor(termStart: number) {
        super(`https://www.oyez.org/cases/${termStart}`);
        this.termStart = termStart;
    }

    /**
     * Scrapes the Oyez page for the specified term.
     *
     * @returns The list of cases for the specified term.
     */
    async scrape(): Promise<OyezCaseListItem[]> {
        const inDatabase = await this.findInDatabase();
        if (inDatabase) {
            return inDatabase.map(doc => ({
                term: doc.data.term,
                name: doc.data.name,
                description: doc.data.description,
                granted: doc.data.granted,
                argued: doc.data.argued,
                decided: doc.data.decided,
                citation: doc.data.citation,
            }));
        }

        await this.openTab();

        let selectedLists = await this.select('.index');

        while (selectedLists.length === 0) {
            await sleep(OyezTermCaseListScraper.loadDelay); // To avoid rapid iterations
            selectedLists = await this.select('.index');
        }

        const list = selectedLists[0];

        this.closeTab();

        const listItems = list.querySelectorAll('li');
        const results = listItems
            .map(li => {
                const name = li.querySelector('h2')?.textContent.trim();

                if (name) {
                    return {
                        name,
                        description: li.querySelector('.description')?.textContent?.trim() ?? '',
                        granted:
                            li
                                .querySelector('.cell.granted')
                                ?.querySelector('.ng-scope')
                                ?.textContent.trim() ?? 'n/a',
                        argued:
                            li
                                .querySelector('.cell.argued')
                                ?.querySelector('.ng-scope')
                                ?.textContent.trim() ?? 'Pending',
                        decided:
                            li
                                .querySelector('.cell.decided')
                                ?.querySelector('.ng-scope')
                                ?.textContent.trim() ?? 'Pending',
                        citation:
                            li
                                .querySelector('.cell.citation')
                                ?.querySelector('.ng-scope')
                                ?.textContent.trim() ?? 'Pending',
                    };
                }
                return undefined;
            })
            .filter(result => result !== undefined) as OyezCaseListItem[];

        this.saveToDatabase(
            caseListDatabase,
            ...results.map(result => ({
                url: this.origin,
                data: result,
                expiration: {
                    months: 30,
                },
            })),
        );

        return results;
    }

    async findInDatabase() {
        const results = await caseListDatabase.findAll({ term: this.termStart });
        return results.length > 0 ? results : null;
    }
}

export default OyezCaseListScraper;
