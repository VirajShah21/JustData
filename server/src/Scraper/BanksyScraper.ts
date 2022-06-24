import Logger from '../utils/Logger';
import { sleep } from '../utils/TimeFunctions';
import Scraper from './Scraper';
import ScraperDatabase, { ScrapedDocument } from './ScraperDatabase';

const scraping: Record<string, 'working' | BanksyScraperResults> = {};

const banksyDatabase = new ScraperDatabase<BanksyScraperResults>('banksy-art');

export default class BanksyScraper extends Scraper<BanksyScraperResults> {
    private prompt: string;

    constructor(prompt: string) {
        super('https://craiyon.com');
        this.prompt = prompt.trim().toLowerCase();
    }

    static status(prompt: string): 'never' | 'working' | 'done' {
        if (scraping[prompt] === undefined) return 'never';
        if (scraping[prompt] === 'working') return 'working';
        return 'done';
    }

    static getResults(prompt: string): BanksyScraperResults | null {
        if (typeof scraping[prompt] === 'object') return scraping[prompt] as BanksyScraperResults;
        return null;
    }

    async scrape(): Promise<BanksyScraperResults | null> {
        Logger.debug('Scraping on Banksy');

        const dbResult = await this.findInDatabase();
        if (dbResult && dbResult.data.images.length >= 9) {
            scraping[this.prompt] = dbResult.data;
            return dbResult.data;
        }

        await this.openTab();
        await this.runSearch();

        let images = await this.findImages();

        while (images === null) {
            await sleep(10000);
            images = await this.findImages();
        }

        this.closeTab();

        const result = {
            prompt: this.prompt,
            images,
        };

        scraping[this.prompt] = result;
        this.saveToDatabase(banksyDatabase, {
            url: this.origin,
            data: result,
            expiration: {
                years: 1,
            },
        });

        return result;
    }

    static start(prompt: string) {
        if (scraping[prompt] === 'working') return;
        scraping[prompt] = 'working';
        const scraper = new BanksyScraper(prompt);
        scraper.scrape();
    }

    async findImages(): Promise<string[] | null> {
        if (this.tab === null) return null;
        return await this.tab!.evaluate(() => {
            let isLoading = document.body.textContent?.includes('This should not take long');
            if (isLoading) return null;
            return Array.from(document.getElementsByClassName('hover:ring-orange-400')).map(img =>
                img.getAttribute('src'),
            ) as string[];
        });
    }

    async runSearch(): Promise<void> {
        await this.tab!.evaluate(() => {
            const promptInput = document.getElementById('prompt') as HTMLInputElement;
            console.log('Found input', promptInput);
            promptInput.focus();
        });
        await this.tab!.keyboard.type(this.prompt);
        await this.tab!.evaluate(() => {
            const submitButton = Array.from(document.querySelectorAll('button')).find(
                btn => btn.textContent?.trim().toLowerCase() === 'draw',
            ) as HTMLButtonElement;
            submitButton.click();
        });
    }

    async findInDatabase(): Promise<ScrapedDocument<BanksyScraperResults> | null> {
        const result = await banksyDatabase.find({ prompt: { $eq: this.prompt } });
        if (result) return result;
        return null;
    }
}
