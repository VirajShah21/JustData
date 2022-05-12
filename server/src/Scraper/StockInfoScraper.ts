// TODO: Do this

// import Scraper from './Scraper';

// interface StockInformation {
//     price: {
//         open: string;
//         close: string;
//         current: string;
//     };
//     bid: string;
//     ask: string;
//     ranges: {
//         daily: string;
//         annual: string;
//     };
//     volume: {
//         total: string;
//         average: string;
//     };
//     marketCap: string;
//     pe: string;
//     eps: string;
//     earningsDate: string;
//     dividend: {
//         yield: string;
//         exDate: string;
//     };
//     estimate52week: string;
// }

// class StockInfoScraper extends Scraper<StockInformation> {
//     constructor(ticker: string) {
//         super(`https://finance.yahoo.com/quote/${ticker}/`);
//     }

//     async scrape() {
//         await this.openTab();
//     }
// }

// export default StockInfoScraper;
