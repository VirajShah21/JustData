import express from 'express';
import {
    AllFugitivesScraper,
    TenMostWantedFugitivesScraper,
} from './Scraper/FBIMostWantedScrapers';
import OyezCaseListScraper from './Scraper/OyezCaseListScraper';
import ScrapeUtils from './Scraper/ScrapeUtils';
import StockTickerScraper from './Scraper/StockTickerScraper';

// DEV_PORT is 3001 because react-scripts takes 3000
const DEV_PORT = 3001;
// If a PORT is provided as an environment variable (usually on a production server)
// then that port will be used
const PORT = process.env.PORT ?? DEV_PORT;

const app = express();

ScrapeUtils.init();

// Middleware which allows any origin to access this API.
app.use((_, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

app.get('/api/stocks/ticker-search', async (req, res) => {
    const { q } = req.query;

    // Guards to ensure the query provided is a valid string.
    if (typeof q === 'string') {
        const scraper = new StockTickerScraper(q);
        res.send(await scraper.scrape());
    } else {
        res.send(`The provided query is not a string`);
    }
});

app.get('/api/fbi/ten-most-wanted', async (_, res) => {
    const scraper = new TenMostWantedFugitivesScraper();
    res.send(await scraper.scrape());
});

app.get('/api/fbi/all-fugitives', async (_, res) => {
    const scraper = new AllFugitivesScraper();
    res.send(await scraper.scrape());
});

app.get('/api/supreme-court/cases', async (req, res) => {
    let terms;

    if (req.query.terms) {
        // If the query includes an array of terms, it must be parsed
        // using the builtin JSON parser
        terms = (JSON.parse(req.query.terms as string) as string[]).map(term => +term);
    } else if (req.query.term) {
        // If terms is not provided but term is, then it should be added
        // to an array which only contains a single item
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
