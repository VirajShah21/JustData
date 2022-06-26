import Scraper from './Scraper';
import ScraperDatabase, { ScrapedDocument } from './ScraperDatabase';

const tickerSERPDatabase = new ScraperDatabase<StockTickerScraperResponse>(
    'securities-ticker-serp',
);

/**
 * A scraper which scrapes Yahoo Finance for a list of securities results
 * when searching for a ticker symbol.
 */
class StockTickerScraper extends Scraper<StockTickerScraperResponse> {
    private readonly query: string;

    /**
     * Constructs the scraper.
     *
     * @param query - The query which the user is searching for.
     */
    constructor(query: string) {
        super(`https://finance.yahoo.com/lookup?s=${encodeURI(query)}`);
        this.query = query;
    }

    /**
     * @returns An object which contains the scraped query and a list of
     * securities which match the query.
     */
    override async scrape(): Promise<StockTickerScraperResponse | null> {
        const inDatabase = await this.findInDatabase();
        if (inDatabase) {
            return inDatabase.data;
        }

        await this.openTab();

        const table = await this.select('.lookup-table');
        if (table.length === 0) {
            return null;
        }

        this.closeTab();

        const tbody = table[0].querySelector('tbody');
        if (!tbody) {
            return null;
        }

        const rows = tbody.querySelectorAll('tr');
        if (rows.length === 0) {
            return null;
        }

        const response = {
            query: this.query,
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

        this.saveToDatabase(tickerSERPDatabase, {
            url: this.origin,
            data: response,
            expiration: {
                months: 3,
            },
        });

        return response;
    }

    async findInDatabase(): Promise<ScrapedDocument<StockTickerScraperResponse> | null> {
        return tickerSERPDatabase.find({
            query: {
                $eq: this.query,
            },
        });
    }
}

export default StockTickerScraper;
