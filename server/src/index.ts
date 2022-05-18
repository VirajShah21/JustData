import express from 'express';
import axios from 'axios';
import StockTickerScraper from './Scraper/StockTickerScraper';
import ScrapeUtils from './Scraper/ScrapeUtils';
import {
    AllFugitivesScraper,
    TenMostWantedFugitivesScraper,
} from './Scraper/FBIMostWantedScrapers';
import OyezCaseListScraper from './Scraper/OyezCaseScraper';

const app = express();
const PORT = process.env.PORT || 3001;

ScrapeUtils.init();

app.use((_, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

app.get('/api/stocks/ticker-search', async (req, res) => {
    const { q } = req.query;

    if (typeof q === 'string') {
        const scraper = new StockTickerScraper(q);
        res.send(await scraper.scrape());
    } else {
        console.error(`The query ${q} is not a string`);
    }
});

app.get('/api/fbi/ten-most-wanted', async (req, res) => {
    const scraper = new TenMostWantedFugitivesScraper();
    res.send(await scraper.scrape());
});

app.get('/api/fbi/all-fugitives', async (req, res) => {
    const scraper = new AllFugitivesScraper();
    res.send(await scraper.scrape());
});

app.get('/api/supreme-court/cases', async (req, res) => {
    let terms;

    if (req.query.terms) {
        terms = (JSON.parse(req.query.terms as string) as string[]).map(term => +term);
    } else if (req.query.term) {
        terms = [+req.query.term];
    } else {
        res.send('Error: You must specify a term or terms');
        return;
    }

    const scraper = new OyezCaseListScraper(terms);
    res.send(await scraper.scrape());
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
