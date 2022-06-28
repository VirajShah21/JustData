import puppeteer, { Browser, Page } from 'puppeteer';
import { parse, HTMLElement as ParsedHTMLElement } from 'node-html-parser';
import Logger from '../utils/Logger';

/**
 * A utility class for scraping websites using the Puppeteer library.
 */
class ScrapeUtils {
    private static browser: Browser;

    /**
     * Initializes the scraper utility class.
     *
     * Launches the Google Chrome browser instance.
     */
    public static async init(): Promise<void> {
        await ScrapeUtils.launchBrowser();
    }

    /**
     * Launches the Google Chrome browser instance using the Puppeteer library.
     */
    private static async launchBrowser() {
        Logger.info('Launching a virtual Chrome instance...');
        puppeteer
            .launch({
                args: ['--no-sandbox'],
                // * To debug a scraper, set headless to false:
                headless: false,
            })
            .then(chrome => {
                Logger.info('Successfully launched a virtual Chrome instance');
                ScrapeUtils.browser = chrome;
            })
            .catch(err => {
                Logger.info('Failed to launch a virtual Chrome instance');
                throw err;
            });
    }

    /**
     * Gets a page from the browser instance.
     *
     * @param url - The URL to open in the browser.
     * @returns A promise which resolves with the Puppeteer Page when Chrome
     * has loaded the website at the specified URL.
     */
    static async getPage(url: string): Promise<Page> {
        return new Promise(resolve => {
            ScrapeUtils.browser
                .newPage()
                .then(page => {
                    page.goto(url);
                    page.on('load', () => {
                        resolve(page);
                    });
                })
                .catch(err => {
                    Logger.error(err);
                });
        });
    }

    /**
     * Parses a string of HTML to a DOM tree. The tree can act as a mock
     * DOM tree for use in NodeJS, but some features are not supported.
     *
     * @param html - The HTML string to parse.
     * @returns A ParsedHTMLElement which simulates many features provided
     * by browser DOM elements.
     */
    static parseHTML(html: string): ParsedHTMLElement {
        return parse(html);
    }

    /**
     * The browser instance used by the scraper utility class.
     */
    static get chrome(): Browser {
        return ScrapeUtils.browser;
    }
}

export default ScrapeUtils;
export { ParsedHTMLElement };
