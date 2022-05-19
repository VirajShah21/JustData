import { Page } from 'puppeteer';
import ScrapeUtils, { ParsedHTMLElement } from './ScrapeUtils';

interface IScraper<R> {
    get cache(): Record<string, R> | R;
    scrape(): Promise<R | null>;
}

abstract class Scraper<R> implements IScraper<R> {
    protected origin: string;
    protected tab?: Page;

    constructor(origin: string) {
        this.origin = origin;
    }

    protected async openTab() {
        if (this.tab) this.tab.close();
        this.tab = await ScrapeUtils.getPage(this.origin);
    }

    protected async closeTab() {
        if (this.tab) {
            await this.tab.close();
            this.tab = undefined;
        }
    }

    protected async select(selector: string) {
        if (this.tab) {
            return (
                await this.tab.evaluate(
                    _selector => Array.from(document.querySelectorAll(_selector), e => e.innerHTML),
                    selector
                )
            ).map(ScrapeUtils.parseHTML);
        }

        throw new Error(
            'Cannot use "[Scraper].select()" without first calling await "[Scraper].openTab()"'
        );
    }

    abstract scrape(): Promise<R | null>;

    abstract get cache(): Record<string, R> | R;
}

export default Scraper;
export type { IScraper };
