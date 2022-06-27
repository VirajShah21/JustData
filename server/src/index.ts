import express from 'express';
import https from 'https';
import path from 'path';
import BanksyScraper from './Scraper/BanksyScraper';
import BingSearchScraper from './Scraper/BingSearchScraper';
import {
    AllFugitivesScraper,
    TenMostWantedFugitivesScraper,
} from './Scraper/FBIMostWantedScrapers';
import OyezCaseListScraper from './Scraper/OyezCaseListScraper';
import ScrapeUtils from './Scraper/ScrapeUtils';
import StockTickerScraper from './Scraper/StockTickerScraper';
import WHFinancialDisclosureScraper from './Scraper/WHFinancialDisclosureScraper';
import YellowPagesSearchScraper from './Scraper/YellowPagesSearchScraper';
import Logger from './utils/Logger';

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

app.use(express.static(path.resolve(__dirname, '../../app/build')));

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
    let terms: number[];

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

    Logger.debug('Terms ' + terms);

    const scraper = new OyezCaseListScraper(terms);
    res.send(await scraper.scrape());
});

app.get('/api/business/search', async (req, res) => {
    const { q, location } = req.query;

    if (typeof q === 'string' && typeof location === 'string') {
        const scraper = new YellowPagesSearchScraper(q, location);
        res.send(await scraper.scrape());
    } else {
        res.send('Error: URL parameters q and location must be strings.');
    }
});

app.get('/api/serp', async (req, res) => {
    // const engine = (req.query.engine as string).toLowerCase().trim();
    const { q } = req.query;

    // The correct SERP scraper will be assigned to this
    const scraper: BingSearchScraper = new BingSearchScraper(q as string);

    // Based on the engine, a correct scraper should be assigned
    // to `let scraper`
    // ! Since there is only a SERP scraper for Bing, that will also be the default scraper
    // TODO: Add Google and other search engines.

    res.send(await scraper.scrape());
});

app.get('/api/white-house/financial-disclosures', async (_, res) => {
    const scraper = new WHFinancialDisclosureScraper();
    res.send(await scraper.scrape());
});

app.get('/api/banksy', async (req, res) => {
    const { prompt } = req.query as { prompt: string };

    Logger.debug('Prompt: ' + prompt);
    Logger.debug('Status: ' + BanksyScraper.status(prompt));
    if (BanksyScraper.status(prompt) === 'working') {
        res.send(null);
    } else if (BanksyScraper.status(prompt) === 'never') {
        BanksyScraper.start(prompt);
        res.send(null);
    } else {
        res.send(BanksyScraper.getResults(prompt));
    }
});

app.get('/*', (_, res) => {
    res.sendFile(path.resolve(__dirname, '../../app/build/index.html'));
});

if (PORT === DEV_PORT) {
    // On dev port, we are using HTTP
    app.listen(PORT, () => {
        Logger.info(`Server started at http://localhost:${PORT}`);
    });
} else {
    https.createServer(app).listen(PORT, () => {
        Logger.info(`Server started at https://just-data.onrender.com`);
    });
}
