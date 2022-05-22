interface SERPItem {
    title: string;
    url: string;
    description: string;
}

interface YellowPagesSearchResult {
    business: string;
    categories: string[];
    rating: YellowPagesListingRating;
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

interface YellowPagesListingRating {
    yellowPages?: number;
    tripAdvisor?: number;
}
