import Scraper from './Scraper';
import ScrapeUtils, { ParsedHTMLElement } from './ScrapeUtils';

const cache: Record<string, StockTickerScraperResponse> = {};

class StockTickerScraper extends Scraper<StockTickerScraperResponse> {
    private query: string;

    constructor(query: string) {
        super(`https://finance.yahoo.com/lookup?s=${encodeURI(query)}`);
        this.query = query;
    }

    async scrape(): Promise<StockTickerScraperResponse | null> {
        if (cache[this.query]) return cache[this.query];

        await this.openTab();

        const table = await ScrapeUtils.select(this.tab!, '.lookup-table');
        if (table.length === 0) return null;

        this.closeTab();

        const tbody = table[0].querySelector('tbody');
        if (!tbody) return null;

        const rows = tbody.querySelectorAll('tr');
        if (rows.length === 0) return null;

        const response = {
            q: this.query,
            results: rows.map(row => {
                const [symbol, name, lastPriceString, industry, type, exchange] = row
                    .querySelectorAll('td')
                    .map(td => td.textContent);
                let lastPrice: number;
                try {
                    lastPrice = parseFloat(lastPriceString);
                } catch (e) {
                    lastPrice = 0;
                }
                return { symbol, name, lastPrice, industry, type, exchange };
            }),
        };

        cache[this.query] = response;

        return response;
    }

    get cache() {
        return cache;
    }
}

export default StockTickerScraper;
