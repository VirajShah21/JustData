interface StockSearchResult {
    symbol: string;
    name: string;
    lastPrice: number;
    industry: string;
    type: string;
    exchange: string;
}

interface StockTickerScraperResponse {
    query: string;
    results: StockSearchResult[];
}
