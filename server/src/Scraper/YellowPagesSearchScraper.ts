import Scraper from './Scraper';
import ScraperDatabase, { ScrapedDocument } from './ScraperDatabase';
import { ParsedHTMLElement } from './ScrapeUtils';

const database = new ScraperDatabase<YellowPagesSERP>('yellow-pages-serp');

/**
 * Scraper for Yellow Pages Search results.
 */
class YellowPagesSearchScraper extends Scraper<YellowPagesSERP> {
    private readonly query: string;
    private readonly location: string;
    private static readonly wordToNumberMap: Record<string, number | undefined> = {
        zero: 0,
        one: 1,
        two: 2,
        three: 3,
        four: 4,
        five: 5,
        undefined,
    };

    /**
     * Constructs a scraper for a Yellow Pages search.
     *
     * @param query - The search query to input into Yellow Pages.
     * @param location - The geographical location to search for businesses.
     */
    constructor(query: string, location: string) {
        super(
            `https://www.yellowpages.com/search?search_terms=${encodeURI(
                query,
            )}&geo_location_terms=${encodeURI(location)}`,
        );
        this.query = query.trim();
        this.location = location.trim();
    }

    /**
     * Scrapes the Yellow Pages SERP.
     *
     * @returns An array of all the Yellow Pages search results.
     */
    async scrape(): Promise<YellowPagesSERP | null> {
        const inDatabase = await this.findInDatabase();
        if (inDatabase) return inDatabase.data;

        await this.openTab();
        const listings = await this.select('.srp-listing');
        this.closeTab();

        const results = listings.map(YellowPagesSearchScraper.extractListingData);

        return {
            query: this.query,
            location: this.location,
            url: this.origin,
            results,
        };
    }

    /**
     * Extracts all listing data from a single Yellow Pages search result.
     *
     * @param listing - The element for which a single rating is contained within.
     * @returns All of the details for the specified Yellow Pages listing.
     */
    private static extractListingData(listing: ParsedHTMLElement): YellowPagesSearchResult {
        const categoriesContainer = listing.querySelector('.categories');
        const ratingsContainer = listing.querySelector('.ratings');
        const websiteContainer = listing.querySelector('a.track-visit-website');
        const ageContainer = listing.querySelector('.years-in-business')?.querySelector('.count');
        const openStatusContainer = listing.querySelector('.open-status');

        const business =
            listing.querySelector('h2.n')?.querySelector('.business-name')?.textContent.trim() ??
            'Unknown Business';
        const categories: string[] = [];
        let ypRating: number | undefined;
        let taRating: number | undefined;

        if (categoriesContainer) {
            categoriesContainer
                .querySelectorAll('a')
                .forEach(a => categories.push(a.textContent.trim()));
        }

        if (ratingsContainer) {
            const ratings = YellowPagesSearchScraper.extractListingRating(ratingsContainer);
            ypRating = ratings.yellowPages;
            taRating = ratings.tripAdvisor;
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
            address: YellowPagesSearchScraper.extractListingAddress(listing),
            age: ageContainer ? parseInt(ageContainer.textContent, 10) : undefined,
            openStatus: openStatusContainer?.textContent ?? 'Hours Unknown',
        };
    }

    private static extractListingAddress(listing: ParsedHTMLElement): YellowPagesAddress {
        const addressContainer = listing.querySelector('.adr');
        const address: YellowPagesAddress = {
            street: '',
            city: '',
            state: '',
            zip: '',
        };

        if (addressContainer) {
            const streetContainer = addressContainer.querySelector('.street-address');
            const localityContainer = addressContainer.querySelector('.locality');

            if (streetContainer) {
                address.street = streetContainer.textContent;
            }

            if (localityContainer) {
                const localityCommaSplit = localityContainer.textContent.split(',');
                const afterCommaSplit = localityCommaSplit[1].split(' ');
                address.city = localityCommaSplit[0].trim();
                address.state = afterCommaSplit
                    .slice(0, afterCommaSplit.length - 1)
                    .join(' ')
                    .trim();
                address.zip = afterCommaSplit[afterCommaSplit.length - 1].trim();
            }
        }

        return address;
    }

    /**
     * Extracts the Yellow Pages and Trip Advisor ratings from the ratings container.
     *
     * @param ratingsContainer - The `ParsedHTMLElement` container for the ratings.
     * @returns The YellowPages and TripAdvisor ratings if they are available.
     */
    private static extractListingRating(
        ratingsContainer: ParsedHTMLElement,
    ): YellowPagesListingRating {
        const ypRatingContainer = ratingsContainer.querySelector('.result-rating');
        const taRatingContainer = ratingsContainer.querySelector('.ta-rating');
        const PARTIAL_RATING = 0.5;
        const TA_WHOLE_RATING_INDEX = 1;
        const TA_PARTIAL_RATING_INDEX = 2;

        let yellowPages: number | undefined;
        let tripAdvisor: number | undefined;

        if (ypRatingContainer) {
            const wholeRating =
                YellowPagesSearchScraper.wordToNumberMap[
                    ypRatingContainer.classNames
                        .split(' ')
                        .find(cn => ['zero', 'one', 'two', 'three', 'four', 'five'].includes(cn)) +
                        ''
                ];

            const halfRating = ypRatingContainer.classNames.split(' ').includes('half');

            if (wholeRating) {
                if (halfRating) {
                    yellowPages = wholeRating + PARTIAL_RATING;
                } else {
                    yellowPages = wholeRating;
                }
            }
        }
        if (taRatingContainer) {
            const ratingClass = taRatingContainer.classNames
                .split(' ')
                .filter(cn => cn !== 'ta-rating')
                .find(cn => cn.startsWith('ta-'))
                ?.split('-');
            if (ratingClass) {
                tripAdvisor =
                    +`${ratingClass[TA_WHOLE_RATING_INDEX]}.${ratingClass[TA_PARTIAL_RATING_INDEX]}`;
            }
        }

        return { yellowPages, tripAdvisor };
    }

    async findInDatabase(): Promise<ScrapedDocument<YellowPagesSERP> | null> {
        return database.find({
            query: {
                $eq: this.query,
            },
            location: {
                $eq: this.location,
            },
        });
    }
}

export default YellowPagesSearchScraper;
