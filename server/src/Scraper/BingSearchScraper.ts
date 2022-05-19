import Scraper from './Scraper';

interface BingSearchResult {
    title: string;
    url: string;
    description: string;
}

class BingSearchScraper extends Scraper<BingSearchResult[]> {
    constructor(query: string) {
        super(`https://www.bing.com/search?q=${encodeURI(query)}`);
    }

    async scrape(): Promise<BingSearchResult[] | null> {
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

    get cache():
        | (
              | (BingSearchResult[] | Record<string, BingSearchResult[]>)
              | Record<string, BingSearchResult[] | Record<string, BingSearchResult[]>>
          )
        | null {
        throw new Error('Method not implemented.');
    }
}

export default BingSearchScraper;
