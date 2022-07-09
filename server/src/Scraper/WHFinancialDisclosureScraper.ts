import Scraper from './Scraper';

type WHFinancialDisclosures = {
    president: Record<number, string>;
    vp: Record<number, string>;
    employees: {
        id: string;
        name: string;
    }[];
};

/**
 * A scraper for financial disclosures of White House employees.
 * ! Warning: This scraper does not work properly just yet.
 * ! This needs to be debugged
 * ! Improvements should be made to allow scraping of all WhiteHouse employees
 */
class WHFinancialDisclosureScraper extends Scraper<WHFinancialDisclosures> {
    /**
     * Constructs an instance of the scraper.
     */
    constructor() {
        super('https://www.whitehouse.gov/disclosures/financial-disclosures/');
    }

    /**
     * Scrapes financial disclosures for the president and vice president.
     *
     * @returns The scraped data.
     */
    async scrape(): Promise<WHFinancialDisclosures> {
        await this.openTab();
        const links = (await this.select('body'))[0].querySelectorAll('a').filter(a => {
            const text = a.textContent.trim();
            return (
                (text.includes('President') || text.includes("Vice President's")) &&
                text.includes('Financial Disclosure Report')
            );
        });
        const employeesList = (await this.select('select[name=disclosureId]'))[0]
            .querySelectorAll('option')
            .filter(option => {
                const value = option.getAttribute('value');
                return value && value.length > 0;
            })
            .map(option => {
                return {
                    id: option.getAttribute('value') ?? 'No ID',
                    name: option.textContent.trim(),
                };
            });
        this.closeTab();

        const presidentsReports: Record<number, string> = {};
        const vpReports: Record<number, string> = {};

        links.forEach(link => {
            const presidentLinkTextYearIndex = 1;
            const vpLinkTextYearIndex = 2;

            const text = link.textContent.trim();

            // The presidents link
            if (text.indexOf('President') === 0) {
                const year = parseInt(text.split(' ')[presidentLinkTextYearIndex], 10);
                const url = link.getAttribute('href') ?? '#';
                presidentsReports[year] = url;
            }

            // The VP link
            if (text.indexOf('Vice President') === 0) {
                const year = parseInt(text.split(' ')[vpLinkTextYearIndex], 10);
                const url = link.getAttribute('href') ?? '#';
                vpReports[year] = url;
            }
        });

        // TODO: Add caching

        return {
            president: presidentsReports,
            vp: vpReports,
            employees: employeesList,
        };
    }

    // TODO: Implement caching
    get cache(): WHFinancialDisclosures {
        throw new Error('Not implemented yet');
    }

    // TODO: Fix this entire class
    async findInDatabase(): Promise<null> {
        throw new Error('This entire class requires reworking');
    }
}

export default WHFinancialDisclosureScraper;
