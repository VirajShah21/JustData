import { sleep } from '../utils/TimeFunctions';
import Scraper from './Scraper';
import ScraperCache from './ScraperCache';
import ScrapeUtils from './ScrapeUtils';

interface OyezCaseListItem {
    name: string;
    description: string;
    granted: string;
    argued: string;
    decided: string;
    citation: string;
}

type OyezCaseListResults = Record<string, OyezCaseListItem[]>;

const listCache: Record<string, OyezCaseListItem[]> =
    ScraperCache.initializeCache('oyez-case-list.json') ?? {};

/**
 * A Scraper to scrape the list of all cases from the Oyez website.
 * This scraper requires the term start dates (year) to be provided.
 */
class OyezCaseListScraper extends Scraper<OyezCaseListResults> {
    private readonly termStarts: number[];

    /**
     * Constructs the scraper to scrape the defined term starts.
     *
     * @param termStarts - The term starting years to scrape.
     */
    constructor(termStarts: number[]) {
        if (termStarts.length === 0)
            throw new Error('At least one value for termStart must be provided');
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
    async scrape(): Promise<OyezCaseListResults> {
        const results: OyezCaseListResults = {};

        await Promise.all(
            this.termStarts.map(async ts => {
                const scraper = new OyezTermCaseListScraper(ts);
                results[ts.toString()] = await scraper.scrape();
            }),
        );

        return results;
    }

    /**
     * Gets the cached data
     */
    get cache(): Record<string, OyezCaseListItem[]> {
        return listCache;
    }
}

/**
 * A scraper to scrape the list of all cases from the Oyez website
 * for a specified term.
 */
class OyezTermCaseListScraper extends Scraper<OyezCaseListItem[]> {
    private static readonly loadDelay = 500;

    private termStart: number;

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
            })
            .filter(result => result !== undefined) as OyezCaseListItem[];

        listCache[this.termStart] = results;

        return results;
    }

    /**
     * Gets the cached data for the specified term.
     */
    get cache() {
        return listCache[this.termStart];
    }
}

export default OyezCaseListScraper;
