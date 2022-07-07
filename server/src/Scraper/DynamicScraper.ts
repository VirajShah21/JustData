import path from 'path';
import Scraper from './Scraper';
import { ScrapedDocument } from './ScraperDatabase';
import { ParsedHTMLElement } from './ScrapeUtils';

export default class DynamicScraper extends Scraper<unknown> {
    fields: Record<string, string>;
    vars: Record<string, string | number | boolean>;
    selected: Record<string, ParsedHTMLElement | null>;
    selectedLists: Record<string, ParsedHTMLElement[]> = {};
    selectedTables: Record<string, Record<string, ParsedHTMLElement | null>[]>;

    constructor(origin: string) {
        super(origin);
        this.fields = {};
        this.vars = {};
        this.selected = {};
        this.selectedLists = {};
        this.selectedTables = {};
    }

    setOrigin(origin: string) {
        this.origin = origin;
    }

    updateField(name: string, value: string) {
        this.fields[name] = value;
        const replacer = `{{${name}}}`;
        while (this.origin.includes(replacer)) {
            this.origin = this.origin.replace(replacer, value);
        }
    }

    updateVar(name: string, value: string | number | boolean) {
        this.vars[name] = value;
    }

    async tabAction(action: 'open' | 'close') {
        if (action === 'open') {
            if (this.tab) {
                await this.closeTab();
            }
            await this.openTab();
        } else {
            if (this.tab) {
                await this.closeTab();
            }
        }
    }

    async execSelect(selector: string, varname: string) {
        const selected = await this.select(selector);

        if (selected.length > 0) {
            this.selected[varname] = selected[0];
        } else {
            this.selected[varname] = null;
        }
    }

    async execSelectList(selector: string, varname: string) {
        this.selectedLists[varname] = await this.select(selector);
    }

    async generatePlaygroundScreenshot(instanceId: string): Promise<string | null> {
        if (this.tab) {
            const id = screenshotId();
            await this.tab.screenshot({
                path: path.resolve(`./caches/jds-playground-${instanceId}-${id}.png`),
            });
            return id;
        }
        return null;
    }

    getOrigin(): string {
        return this.origin;
    }

    scrape(): Promise<unknown> {
        throw new Error('Dynamic Scraping does not support scraping');
    }

    findInDatabase(): Promise<ScrapedDocument<unknown> | ScrapedDocument<unknown>[] | null> {
        throw new Error('Dynamic Scraping does not support database access');
    }
}

let nextScreenshotId = 9999;

function screenshotId() {
    nextScreenshotId++;
    return `${nextScreenshotId}`;
}
