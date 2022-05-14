import Scraper from './Scraper';
import ScraperCache from './ScraperCache';
import ScrapeUtils from './ScrapeUtils';

let tenMostWantedCache: TenMostWantedResult[] =
    ScraperCache.initializeCache('fbi-ten-most-wanted.json', () => tenMostWantedCache) ?? [];

class TenMostWantedFugitivesScraper extends Scraper<TenMostWantedResult[]> {
    constructor() {
        super('https://www.fbi.gov/wanted/topten');
    }

    async scrape(): Promise<TenMostWantedResult[] | null> {
        if (tenMostWantedCache.length > 0) return tenMostWantedCache;

        await this.openTab();
        const li = await ScrapeUtils.select(this.tab!, '.portal-type-person');
        this.closeTab();

        const profileUrls = li.map(item => item.querySelector('a')!.getAttribute('href')!);
        const posterUrls = await Promise.all(
            profileUrls.map(async url => {
                const page = await ScrapeUtils.getPage(url);
                const downloadParagraph = (await ScrapeUtils.select(page, 'p.Download'))![0];
                page.close();
                return downloadParagraph.querySelector('a')!.getAttribute('href')!;
            })
        );

        const response = li.map((item, index) => {
            const imgSrc = item.querySelector('a')!.querySelector('img')!.getAttribute('src')!;
            const fugitiveName = item.querySelector('h3.title')!.textContent;
            return {
                name: fugitiveName,
                mugshot: imgSrc,
                posterURL: posterUrls[index],
            };
        });

        tenMostWantedCache = response;

        return response;
    }

    get cache(): Record<string, TenMostWantedResult[]> {
        throw new Error('Method not implemented.');
    }
}

export { TenMostWantedFugitivesScraper };
