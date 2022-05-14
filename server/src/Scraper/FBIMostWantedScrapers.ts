import Scraper from './Scraper';
import ScraperCache from './ScraperCache';
import ScrapeUtils from './ScrapeUtils';

interface TenMostWantedResult {
    name: string;
    mugshot: string;
    posterURL: string;
}

const tenMostWantedCache: TenMostWantedResult[] =
    ScraperCache.initializeCache('fbi-ten-most-wanted.json') ?? [];

class TenMostWantedFugitivesScraper extends Scraper<TenMostWantedResult[]> {
    constructor() {
        super('https://www.fbi.gov/wanted/topten');
    }

    async scrape(): Promise<TenMostWantedResult[] | null> {
        if (tenMostWantedCache.length > 0) return tenMostWantedCache;

        await this.openTab();

        const li = await ScrapeUtils.select(this.tab!, '.portal-type-person');
        const profileUrls = li.map(item => item.querySelector('a')!.getAttribute('href')!);
        const posterUrls = await Promise.all(
            profileUrls.map(async url => {
                return (await ScrapeUtils.select(await ScrapeUtils.getPage(url), 'p.Download'))![0]
                    .querySelector('a')!
                    .getAttribute('href')!;
            })
        );

        return li.map((item, index) => {
            const imgSrc = item.querySelector('a')!.querySelector('img')!.getAttribute('src')!;
            const fugitiveName = item.querySelector('h3.title')!.textContent;
            return {
                name: fugitiveName,
                mugshot: imgSrc,
                posterURL: posterUrls[index],
            };
        });
    }

    get cache(): Record<string, TenMostWantedResult[]> {
        throw new Error('Method not implemented.');
    }
}

export { TenMostWantedFugitivesScraper };
