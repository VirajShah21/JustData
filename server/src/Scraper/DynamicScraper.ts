import path from 'path';
import Scraper from './Scraper';
import { ScrapedDocument } from './ScraperDatabase';
import { ParsedHTMLElement } from './ScrapeUtils';

export default class DynamicScraper extends Scraper<unknown> {
    private fields: Record<string, string>;
    private vars: Record<string, string | number | boolean>;
    private lastSelected: ParsedHTMLElement | ParsedHTMLElement[] | null;
    private selections: Record<string, ParsedHTMLElement | ParsedHTMLElement[] | null>;

    constructor(origin: string) {
        super(origin);
        this.fields = {};
        this.vars = {};
        this.lastSelected = null;
        this.selections = {};
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

    async execSelect(selector: string) {
        const all = await this.select(selector);
        this.lastSelected = all.length > 0 ? all[0] : null;
    }

    async execSelectAll(selector: string) {
        this.lastSelected = await this.select(selector);
    }

    async selectFrom(selection: string, querySelector: string) {
        const root = this.selections[selection];
        if (root) {
            if (Array.isArray(root)) {
                this.lastSelected = root
                    .map(parent => parent.querySelector(querySelector))
                    .filter(node => node !== null) as ParsedHTMLElement[];
            } else {
                this.lastSelected = root.querySelector(querySelector);
            }
        } else {
            this.lastSelected = null;
        }
    }

    async selectAllFrom(selection: string, querySelector: string) {
        const root = this.selections[selection];
        if (root) {
            if (Array.isArray(root)) {
                this.lastSelected = root
                    .map(parent => parent.querySelectorAll(querySelector))
                    .flat()
                    .filter(node => node !== null);
            } else {
                this.lastSelected = root.querySelectorAll(querySelector);
            }
        } else {
            this.lastSelected = null;
        }
    }

    saveSelection(name: string) {
        this.selections[name] = this.lastSelected;
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

    getFields(): Record<string, string> {
        return this.fields;
    }

    getVars(): Record<string, string | number | boolean> {
        return this.vars;
    }

    getSelections(): Record<string, ParsedHTMLElement | ParsedHTMLElement[] | null> {
        return this.selections;
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
