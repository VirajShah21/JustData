import Scraper from './Scraper';
import ScraperCache from './ScraperCache';

interface YellowPagesSearchResult {
    business: string;
    categories: string[];
    rating: {
        yellowPages?: number;
        tripAdvisor?: number;
    };
    website?: string;
    phone: string;
    address: {
        street: string;
        city: string;
        state: string;
        zip: string;
    };
    age?: number;
    openStatus: string;
}

const cache: Record<
    string,
    Record<string, YellowPagesSearchResult[]>
> = ScraperCache.initializeCache('yellow-pages-search.json') ?? {};

class YellowPagesSearchScraper extends Scraper<YellowPagesSearchResult[]> {
    private readonly query: string;
    private readonly location: string;
    private static readonly wordToNumberMap: Record<string, number | undefined> = {
        zero: 0,
        one: 1,
        two: 2,
        three: 3,
        four: 4,
        five: 5,
        undefined: undefined,
    };

    constructor(query: string, location: string) {
        super(
            `https://www.yellowpages.com/search?search_terms=${encodeURI(
                query,
            )}&geo_location_terms=${encodeURI(location)}`,
        );
        this.query = query.trim();
        this.location = location.trim();
    }

    async scrape(): Promise<YellowPagesSearchResult[] | null> {
        if (this.cache) return this.cache;

        await this.openTab();
        const listings = await this.select('.srp-listing');
        this.closeTab();

        const results = listings.map(listing => {
            const categoriesContainer = listing.querySelector('.categories');
            const ratingsContainer = listing.querySelector('.ratings');
            const websiteContainer = listing.querySelector('a.track-visit-website');
            const ageContainer = listing
                .querySelector('.years-in-business')
                ?.querySelector('.count');
            const openStatusContainer = listing.querySelector('.open-status');
            const addressContainer = listing.querySelector('.adr');

            const business =
                listing
                    .querySelector('h2.n')
                    ?.querySelector('.business-name')
                    ?.textContent.trim() ?? 'Unknown Business';
            const categories: string[] = [];
            let ypRating: number | undefined;
            let taRating: number | undefined;
            let street: string | undefined;
            let city: string | undefined;
            let state: string | undefined;
            let zip: string | undefined;

            if (categoriesContainer) {
                categoriesContainer
                    .querySelectorAll('a')
                    .forEach(a => categories.push(a.textContent.trim()));
            }

            if (ratingsContainer) {
                const ypRatingContainer = ratingsContainer.querySelector('.result-rating');
                const taRatingContainer = ratingsContainer.querySelector('.ta-rating');

                if (ypRatingContainer) {
                    const wholeRating =
                        YellowPagesSearchScraper.wordToNumberMap[
                            ypRatingContainer.classNames
                                .split(' ')
                                .find(cn =>
                                    ['zero', 'one', 'two', 'three', 'four', 'five'].includes(cn),
                                ) + ''
                        ];
                    const halfRating = ypRatingContainer.classNames.split(' ').includes('half');
                    if (wholeRating) {
                        if (halfRating) ypRating = wholeRating + 0.5;
                        else ypRating = wholeRating;
                    }
                }
                if (taRatingContainer) {
                    const ratingClass = taRatingContainer.classNames
                        .split(' ')
                        .filter(cn => cn !== 'ta-rating')
                        .find(cn => cn.startsWith('ta-'))
                        ?.split('-');
                    if (ratingClass) {
                        taRating = +`${ratingClass[1]}.${ratingClass[2]}`;
                    }
                }
            }

            if (addressContainer) {
                const streetContainer = addressContainer.querySelector('.street-address');
                const localityContainer = addressContainer.querySelector('.locality');

                if (streetContainer) street = streetContainer.textContent;

                if (localityContainer) {
                    const localityCommaSplit = localityContainer.textContent.split(',');
                    const afterCommaSplit = localityCommaSplit[1].split(' ');
                    city = localityCommaSplit[0].trim();
                    state = afterCommaSplit
                        .slice(0, afterCommaSplit.length - 1)
                        .join(' ')
                        .trim();
                    zip = afterCommaSplit[afterCommaSplit.length - 1].trim();
                }
            }

            return {
                business,
                categories,
                rating: {
                    yellowPages: ypRating,
                    tripAdvisor: taRating,
                },
                website: websiteContainer?.getAttribute('href'),
                phone: listing.querySelector('.phone')?.textContent ?? 'n/a',
                address: {
                    street: street ?? 'Unknown Street',
                    city: city ?? 'Unknown City',
                    state: state ?? 'Unknown State',
                    zip: zip ?? 'Unknown Zip',
                },
                age: ageContainer ? parseInt(ageContainer.textContent, 10) : undefined,
                openStatus: openStatusContainer?.textContent ?? 'Hours Unknown',
            };
        });

        if (!cache.hasOwnProperty(this.location)) cache[this.location] = {};
        cache[this.location][this.query] = results;

        return results;
    }

    get cache(): YellowPagesSearchResult[] | null {
        if (cache.hasOwnProperty(this.location)) {
            const locationCache = cache[this.location];
            if (locationCache.hasOwnProperty(this.query)) {
                return cache[this.location][this.query];
            }
        }
        return null;
    }
}

export default YellowPagesSearchScraper;
