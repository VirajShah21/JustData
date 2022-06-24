import Logger from '../utils/Logger';
import { sleep } from '../utils/TimeFunctions';
import Scraper from './Scraper';
import { ScrapedDocument } from './ScraperDatabase';

const scraping: Record<string, 'working' | BanksyScraperResults> = {};

export default class BanksyScraper extends Scraper<BanksyScraperResults> {
    private prompt: string;

    constructor(prompt: string) {
        super('https://craiyon.com');
        this.prompt = prompt;
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
        await this.openTab();

        await this.runSearch();

        let images = await this.findImages();

        if (images !== null) {
            Logger.debug(`Found ${images.length} images`);
        } else {
            Logger.debug('Initial check found no images');
        }

        while (images === null) {
            Logger.debug('Waiting for images to load');
            await sleep(10000);
            Logger.debug('Waking up thread');
            images = await this.findImages();
            if (images !== null) {
                Logger.debug(`Found ${images.length} images`);
            } else {
                Logger.debug('Found no images');
            }
        }

        this.closeTab();

        const result = {
            prompt: this.prompt,
            images,
        };

        scraping[this.prompt] = result;

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

    findInDatabase(): Promise<
        ScrapedDocument<BanksyScraperResults> | ScrapedDocument<BanksyScraperResults>[] | null
    > {
        throw new Error('Method not implemented.');
    }
}
