import puppeteer, { Browser, Page } from 'puppeteer';
import { parse, HTMLElement as ParsedHTMLElement } from 'node-html-parser';

class ScrapeUtils {
    private static browser: Browser;

    public static async init(): Promise<void> {
        await ScrapeUtils.launchBrowser();
    }

    private static async launchBrowser() {
        console.log('Launching a virtual Chrome instance...');
        puppeteer
            .launch({ args: ['--no-sandbox'] })
            .then(chrome => {
                console.log('Successfully launched a virtual Chrome instance');
                ScrapeUtils.browser = chrome;
            })
            .catch(err => {
                console.log('Failed to launch a virtual Chrome instance');
                throw err;
            });
    }

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
                    console.error(err);
                });
        });
    }

    static parseHTML(html: string): ParsedHTMLElement {
        return parse(html);
    }

    static async select(
        page: Page | ParsedHTMLElement | string,
        selector: string
    ): Promise<ParsedHTMLElement[]> {
        if (page instanceof ParsedHTMLElement) {
            return page.querySelectorAll(selector);
        } else if (typeof page === 'string') {
            return parse(page).querySelectorAll(selector);
        }
        return (
            await page.evaluate(
                _selector => Array.from(document.querySelectorAll(_selector), e => e.innerHTML),
                selector
            )
        ).map(ScrapeUtils.parseHTML);
    }

    static get chrome(): Browser {
        return ScrapeUtils.browser;
    }
}

export default ScrapeUtils;
export { ParsedHTMLElement };
