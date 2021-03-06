interface SERPItem {
    title: string;
    url: string;
    description: string;
}

interface BingSearchResults {
    query: string;
    url: string;
    results: SERPItem[];
}

interface YellowPagesSERP {
    query: string;
    location: string;
    url: string;
    results: YellowPagesSearchResult[];
}

interface YellowPagesSearchResult {
    business: string;
    categories: string[];
    rating: YellowPagesListingRating;
    website?: string;
    phone: string;
    address: YellowPagesAddress;
    age?: number;
    openStatus: string;
}

interface YellowPagesListingRating {
    yellowPages?: number;
    tripAdvisor?: number;
}

interface YellowPagesAddress {
    street: string;
    city: string;
    state: string;
    zip: string;
}
