import { IonIcon } from '@ionic/react';
import {
    trendingUp,
    information,
    briefcase,
    logoIonitron,
    search as searchIcon,
} from 'ionicons/icons';
import justBanksyLogo from 'src/assets/images/icons/Just Banksy.png';
import justFugitivesLogo from 'src/assets/images/icons/Just Fugitives.png';
import justPlacesLogo from 'src/assets/images/icons/Just Places.png';
import justSCOTUSLogo from 'src/assets/images/icons/Just SCOTUS.png';
import justSecuritiesLogo from 'src/assets/images/icons/Just Securities.png';
import searchLogo from 'src/assets/images/icons/search.png';

interface Product {
    product: string;
    icon: string;
    url: string;
}

interface ProductCategory {
    category: ProductCategoryRef;
    icon: React.ReactElement;
    products: Product[];
}

export enum ProductCategoryRef {
    WebSearch,
    ArtificialIntelligence,
    FinancialMarkets,
    USIntelligence,
    CrimeAndJustice,
}

export const CATEGORY_REF_MAPPING = {
    [ProductCategoryRef.FinancialMarkets]: 'Financial Markets',
    [ProductCategoryRef.USIntelligence]: 'United States Intelligence',
    [ProductCategoryRef.CrimeAndJustice]: 'Crime and Justice',
    [ProductCategoryRef.WebSearch]: 'Web Search',
    [ProductCategoryRef.ArtificialIntelligence]: 'Artificial Intelligence',
};

/**
 * An array of `ProductCategory` objects.
 *
 * A product category defines a category (`enum ProductCategoryRef`), an icon
 * associated with the product, and an array of the products which belong to
 * the category (`interface Product`).
 */
export const allProducts: ProductCategory[] = [
    {
        category: ProductCategoryRef.FinancialMarkets,
        icon: <IonIcon icon={trendingUp} />,
        products: [
            {
                product: 'Just Securities',
                icon: justSecuritiesLogo,
                url: 'stocks',
            },
        ],
    },
    {
        category: ProductCategoryRef.USIntelligence,
        icon: <IonIcon icon={information} />,
        products: [
            /* CIA World Factbook */
        ],
    },
    {
        category: ProductCategoryRef.CrimeAndJustice,
        icon: <IonIcon icon={briefcase} />,
        products: [
            {
                product: 'Just Fugitives',
                icon: justFugitivesLogo,
                url: 'most-wanted',
            },
            {
                product: 'Just SCOTUS',
                icon: justSCOTUSLogo,
                url: 'scotus',
            },
        ],
    },
    {
        category: ProductCategoryRef.WebSearch,
        icon: <IonIcon icon={searchIcon} />,
        products: [
            {
                product: 'Just Search',
                icon: searchLogo,
                url: 'search',
            },
            {
                product: 'Just Places',
                icon: justPlacesLogo,
                url: 'places',
            },
        ],
    },
    {
        category: ProductCategoryRef.ArtificialIntelligence,
        icon: <IonIcon icon={logoIonitron} />,
        products: [
            {
                product: 'Just Banksy',
                icon: justBanksyLogo,
                url: 'banksy',
            },
        ],
    },
].sort((a, b) => a.category - b.category);
