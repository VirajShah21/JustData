import path from 'path';
import Scraper from './Scraper';
import { ScrapedDocument } from './ScraperDatabase';
import { ParsedHTMLElement } from './ScrapeUtils';

/**
 * A DynamicScraper object that can be used to scrape any website. This should be used by the
 * JDScript runtime environment to execute dynamic scrapers.
 */
export default class DynamicScraper extends Scraper<unknown> {
    fields: Record<string, ValidJDSArgumentType>;
    vars: Record<string, ValidJDSArgumentType | undefined>;
    selected: Record<string, ParsedHTMLElement | null>;
    selectedLists: Record<string, ParsedHTMLElement[]> = {};
    selectedTables: Record<string, Record<string, ParsedHTMLElement | null>[]>;

    /**
     * Constructs a dynamic scraper with no specified origin.
     */
    constructor() {
        super('');
        this.fields = {};
        this.vars = {};
        this.selected = {};
        this.selectedLists = {};
        this.selectedTables = {};
    }

    /**
     * Dynamically sets the origin of the scraper.
     *
     * @param origin - The origin to assign to the scraper.
     */
    setOrigin(origin: string) {
        this.origin = origin;
    }

    /**
     * Updates a field in the scraper script.
     * @param name - The name of the field to update
     * @param value - The value to set to the field.
     */
    updateField(name: string, value: ValidJDSArgumentType) {
        this.fields[name] = value;
        const replacer = `{{${name}}}`;
        const valueAsString = `${value}`;
        while (this.origin.includes(replacer)) {
            this.origin = this.origin.replace(replacer, valueAsString);
        }
    }

    /**
     * Updates a variable in the scraper script.
     * @param name - The name of the variable.
     * @param value - The value to assign to the variable.
     */
    updateVar(name: string, value: ValidJDSArgumentType) {
        this.vars[name] = value;
    }

    /**
     * Opens a tab if `origin` is provided. If no origin is provided then this function will close
     * the currently opened tab. If no tab is currently opened then an error will be thrown.
     * If currently opening a new tab and a tab is already opened, then the currently opened tab
     * will be closed.
     *
     * @param origin - The origin URL to scrape.
     */
    async tabAction(origin?: string) {
        if (origin) {
            if (this.tab) {
                await this.closeTab();
            }
            this.origin = origin;
            await this.openTab();
        } else if (this.tab) {
            await this.closeTab();
        } else {
            // TODO: Add runtime error details
            throw new Error('Cannot close a tab that hasn not been opened yet');
        }
    }

    /**
     * Executes a query selector statement on the current tab.
     * @param selector - The query selector to select an element.
     * @param varname - The variable to assign the HTML element to.
     */
    async execSelect(selector: string, varname: string) {
        const selected = await this.select(selector);

        if (selected.length > 0) {
            this.selected[varname] = selected[0];
        } else {
            this.selected[varname] = null;
        }
    }

    /**
     * Executes a query selector (all) statement on the current tab.
     * @param selector - The query selector to select all elements.
     * @param varname - The variable to assign the array of HTML elements to.
     */
    async execSelectList(selector: string, varname: string) {
        this.selectedLists[varname] = await this.select(selector);
    }

    /**
     * Captures a screenshot of the currently opened tab.
     * @param instanceId - The instance ID of the scraper to screenshot.
     * @returns A promise that resolves to the screenshot ID of the captured screenshot.
     */
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

    /**
     * Gets the value of a specified attribute of a selected element using a query selector.
     *
     * @param selector - The query selector to select an element.
     * @param attr - The name of the attribute to extract from the element.
     * @returns A promise that resolves to the value of the attribute.
     */
    async getAttributes(selector: string, attr: string): Promise<(string | undefined)[]> {
        const selected = await this.select(selector);
        return selected.map(
            s => s.getAttribute(attr) ?? (s[attr as keyof ParsedHTMLElement] as string),
        );
    }

    /**
     * @returns The currently set origin of the scraper.
     */
    getOrigin(): string {
        return this.origin;
    }

    /**
     * ! DO NOT USE THIS FUNCTION !
     * Simply throws an error since scraping cannot be performed with the `DynamicScraper.scrape`.
     * Instead, use JDScript to invoke other methods to assist with scraping.
     */
    scrape(): Promise<unknown> {
        throw new Error('Dynamic Scraping does not support scraping');
    }

    /**
     * ! DO NOT USE THIS FUNCTION !
     * Simple throws an error since scraping cannot be performed with the `DynamicScraper.scrape`.
     * Instead, use a the `ScraperDatabase` utility directly.
     */
    findInDatabase(): Promise<ScrapedDocument<unknown> | ScrapedDocument<unknown>[] | null> {
        throw new Error('Dynamic Scraping does not support database access');
    }
}

let nextScreenshotId = 9999;

function screenshotId() {
    nextScreenshotId++;
    return `${nextScreenshotId}`;
}
