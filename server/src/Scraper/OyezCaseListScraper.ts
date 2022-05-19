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

class OyezCaseListScraper extends Scraper<OyezCaseListResults> {
    private readonly termStarts: number[];

    constructor(termStarts: number[]) {
        if (termStarts.length === 0)
            throw new Error('At least one value for termStart must be provided');
        super('');
        this.termStarts = termStarts;
    }

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

    get cache(): Record<string, OyezCaseListItem[]> {
        return listCache;
    }
}

class OyezTermCaseListScraper extends Scraper<OyezCaseListItem[]> {
    private termStart: number;

    constructor(termStart: number) {
        super(`https://www.oyez.org/cases/${termStart}`);
        this.termStart = termStart;
    }

    async scrape(): Promise<OyezCaseListItem[]> {
        await this.openTab();

        let selectedLists = await this.select('.index');

        while (selectedLists.length === 0) {
            await sleep(500); // To avoid rapid iterations
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

    get cache() {
        return listCache[this.termStart];
    }
}

export default OyezCaseListScraper;
