import Logger from '../utils/Logger';
import { sleep } from '../utils/TimeFunctions';
import Scraper from './Scraper';
import ScraperDatabase, { ScrapedDocument } from './ScraperDatabase';

/**
 * A record which maps a prompt to a status.
 *
 * If the value is undefined, then
 * then this server instance has not never executed the given prompt, although
 * it may have executed it in the past and stored it in the database.
 *
 * If the value is 'working', then the origin is either generating results or
 * the scraper is in process of scraping the image results.
 *
 * If the value is an object (`BanksyScraperResults`), then scraping has been
 * completed on this server instance and the results are stored in the database.
 */
const scraping: Record<string, 'working' | BanksyScraperResults> = {};

const banksyDatabase = new ScraperDatabase<BanksyScraperResults>('banksy-art');

/**
 * A scraper which scrapes Craiyon's website for AI generated images.
 */
export default class BanksyScraper extends Scraper<BanksyScraperResults> {
    /**
     * The prompt to generate an image from.
     */
    private prompt: string;

    /**
     * Constructs a scraper for the Craiyon (DALL-E mini) site.
     * @param prompt - The prompt to generate an image from.
     */
    constructor(prompt: string) {
        super('https://craiyon.com');
        this.prompt = prompt.trim().toLowerCase();
    }

    /**
     * Checks the status of the scraper with the specified prompt.
     *
     * @param prompt - The prompt to check the status for
     * @returns 'never' if this server instance never checked for results for the given prompt,
     * 'working' if the server is currently working on generating results for the given prompt,
     * or 'done' if the server has already generated results for the given prompt and they are
     * ready to be served.
     */
    static status(prompt: string): 'never' | 'working' | 'done' {
        if (scraping[prompt] === undefined) return 'never';
        if (scraping[prompt] === 'working') return 'working';
        return 'done';
    }

    /**
     * Gets the results from the local cache for the given prompt.
     *
     * @param prompt - The prompt to get the results for.
     * @returns Reutrns the results object if they are available, otherwise `null` is returned.
     */
    static getResults(prompt: string): BanksyScraperResults | null {
        if (typeof scraping[prompt] === 'object') return scraping[prompt] as BanksyScraperResults;
        return null;
    }

    /**
     * ! Warning: This method should not be directly called
     *
     * ! You should instead invoke the `BanksyScraper.start` method
     *
     * Scrapes the Craiyon website for the AI generated images.
     * Since the Crayon site is a single-page application which does not use
     * normal `<input value="" />`, the scraper simulates clicks and keyboard
     * events to enter the prompt. Then it clicks the draw button to generate
     * the images. The scraper will check the site every 5 seconds to verify
     * that the images have been generated. If they have not been generated,
     * the scraper will check again in 5 seconds.
     *
     * @returns An object that contains the `prompt` that was provided by the
     * user (trimmed and converted to lowercase), and an array named `images`
     * which contains images encoded in a Data URI scheme.
     */
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
            await sleep(5000);
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

    /**
     * Begins the Banksy Scraper. Since the scraper takes an awfully long time to
     * generate results, this method will terminate as soon as the scraper is started.
     * If a scraper with the same prompt has already been started, then the scraper
     * will not be started again, but rather wait for the other scraper to complete and
     * share the same results.
     *
     * You can use the static `BanksyScraper.status` method to check the status of the
     * scraper with the current prompt to check if it is still working or results have
     * already been found. Then you can use the static `BanksyScraper.getResults` method
     * to resolve the results.
     *
     * @param prompt - The prompt to scrape for.
     */
    static start(prompt: string) {
        if (scraping[prompt] === 'working') return;
        scraping[prompt] = 'working';
        const scraper = new BanksyScraper(prompt);
        scraper.scrape();
    }

    /**
     * Checks the site if the images have been generated. If the images have not been
     * generated or are still loading, this function will return `null`. If the images
     * have been generated and are displayed on the site, then an array of Data URI schemes
     * will be returned (representing the images) that match the user-provided prompt.
     *
     * @returns An array of the encoded images generated by the AI. If the images are
     * loading or still being generated, then `null` is returned to signal that more
     * time is required.
     */
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

    /**
     * Performs the search on the Craiyon website. Since the Craiyon site uses a non-standard
     * `<input />` element (doesn't use the `value` attribute), the scraper uses click simulation
     * and simulated keyboard events to enter the prompt and run the search.
     */
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

    /**
     * Checks if the database if the `prompt` has already been executed before. If the prompt
     * has been executed, then a matching document should be in the database (there should only
     * be one document per prompt).
     *
     * @returns A single object for the scraped results. If none exists, then `null` is returned.
     */
    async findInDatabase(): Promise<ScrapedDocument<BanksyScraperResults> | null> {
        const result = await banksyDatabase.find({ prompt: { $eq: this.prompt } });
        if (result) return result;
        return null;
    }
}
