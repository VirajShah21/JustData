import { Page } from 'puppeteer';
import ScrapeUtils from './ScrapeUtils';

type BaseCache<R> = R | Record<string, R>;
type UniversalCache<R> = BaseCache<R> | Record<string, BaseCache<R>>;

interface IScraper<R> {
    scrape(): Promise<R | null>;
    get cache(): UniversalCache<R> | null;
}

/**
 * The Base class for all Scraper. It comes with some handy methods for
 * completing basic scraping tasks.
 */
abstract class Scraper<R> implements IScraper<R> {
    protected origin: string;
    protected tab?: Page;

    /**
     * Constructs a scraper for a specified origin page.
     *
     * @param origin - The origin URL for the webpage to be scraped.
     */
    constructor(origin: string) {
        this.origin = origin;
    }

    /**
     * Opens a new tab in the browser with the origin URL.
     * If openTab() is called multiple times, the previously opened tab
     * will be closes (asynchronously) and a new one will be loaded; the
     * previously opened tab may still be open by the time this method
     * resolves.
     */
    protected async openTab() {
        if (this.tab) this.tab.close();
        this.tab = await ScrapeUtils.getPage(this.origin);
    }

    /**
     * Closes the currently opened tab if it is opened.
     * A call to this method should not be awaited unless a specific
     * circumstance warrants awaiting the closure of the current tab.
     */
    protected async closeTab() {
        if (this.tab) {
            await this.tab.close();
            this.tab = undefined;
        }
    }

    /**
     * Asynchronously selects all elements matching a query selector from
     * the currently opened tab.
     *
     * @param selector - The CSS selector to select a group of elements from
     * the opened tab.
     * @returns An array of `ParsedHTMLElement`s which represent the elements
     * which were selected from the page.
     */
    protected async select(selector: string) {
        if (this.tab) {
            return (
                await this.tab.evaluate(
                    _selector => Array.from(document.querySelectorAll(_selector), e => e.innerHTML),
                    selector,
                )
            ).map(ScrapeUtils.parseHTML);
        }

        throw new Error(
            'Cannot use "[Scraper].select()" without first calling await "[Scraper].openTab()"',
        );
    }

    /**
     * Should perform the scrape operation and return the specified result type.
     * If the origin could not be scraped, or raises an error this method should
     * return `null`.
     */
    abstract scrape(): Promise<R | null>;

    /**
     * Should return the cache used by the defined scraper.
     */
    abstract get cache(): UniversalCache<R> | null;
}

export default Scraper;
export type { IScraper };
