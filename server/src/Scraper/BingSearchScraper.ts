import Logger from '../utils/Logger';
import Scraper from './Scraper';

/**
 * Scraper for the Bing SERP
 */
class BingSearchScraper extends Scraper<SERPItem[]> {
    /**
     * Constructs a scraper for the Bing Search Engine Results Page.
     *
     * @param query - The query to search for.
     */
    constructor(query: string) {
        super(`https://www.bing.com/search?q=${encodeURI(query)}`);
    }

    /**
     * Performs a Bing search and scrapes the results page.
     *
     * @returns An array of all the Bing search results for the query.
     */
    async scrape(): Promise<SERPItem[] | null> {
        await this.openTab();
        const resultsContainers = await this.select('#b_results');
        this.closeTab();

        if (resultsContainers.length === 0) return null;

        const resultsContainer = resultsContainers[0];

        const results = resultsContainer.querySelectorAll('li.b_algo').map(li => {
            const titleAnchor = li
                .querySelector('.b_title')
                ?.querySelector('h2')
                ?.querySelector('a');
            const descriptionP = li.querySelector('.b_caption')?.querySelector('p');

            let title: string;
            let url: string;
            let description: string;

            if (titleAnchor) {
                title = titleAnchor.textContent;
                url = titleAnchor.getAttribute('href') ?? '#';
            } else {
                title = 'No Page Title Found';
                url = '#';
            }

            if (descriptionP) description = descriptionP.innerHTML;
            else description = 'No Description Found';

            return {
                title,
                url,
                description,
            };
        });

        return results;
    }

    /**
     * Cached data for the Bing search.
     *
     * TODO: This is incomplete. Fill out this method to enable caching.
     */
    get cache():
        | (
              | (SERPItem[] | Record<string, SERPItem[]>)
              | Record<string, SERPItem[] | Record<string, SERPItem[]>>
          )
        | null {
        throw new Error('Method not implemented.');
    }
}

export default BingSearchScraper;
