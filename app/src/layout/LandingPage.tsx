import { IonIcon } from '@ionic/react';
import {
    briefcase,
    bugOutline,
    closeOutline,
    cogOutline,
    helpOutline,
    information,
    logoGithub,
    logoIonitron,
    search as searchIcon,
    trendingUp,
} from 'ionicons/icons';
import React, { useEffect, useState } from 'react';
import { HStack, Spacer, VStack } from 'reaction';
import Button from 'src/components/Button';
import DropdownMenu from 'src/components/DropdownMenu';
import AppPreferences, { AppTheme } from 'src/utils/AppPreferences';
import { ProductResult, ProductSectionTitle } from '../components/ProductComponents';
import SearchBar from '../components/SearchBar';
import justBanksyLogo from '../resources/images/icons/Just Banksy.png';
import justFugitivesLogo from '../resources/images/icons/Just Fugitives.png';
import justPlacesLogo from '../resources/images/icons/Just Places.png';
import justSCOTUSLogo from '../resources/images/icons/Just SCOTUS.png';
import justSecuritiesLogo from '../resources/images/icons/Just Securities.png';
import logo from '../resources/images/icons/logo.png';
import searchLogo from '../resources/images/icons/search.png';
import './LandingPage.css';

enum ProductCategoryRef {
    WebSearch,
    ArtificialIntelligence,
    FinancialMarkets,
    USIntelligence,
    CrimeAndJustice,
}

interface ProductCategory {
    category: ProductCategoryRef;
    icon: React.ReactElement;
    products: Product[];
}

interface Product {
    product: string;
    icon: string;
    url: string;
}

interface PreferencesPopupProps {
    onClose: () => void;
    open: boolean;
}

const CATEGORY_REF_MAPPING = {
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
const allProducts: ProductCategory[] = [
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

/**
 * @returns The landing page for Just Data.
 */
function LandingPage() {
    return (
        <HStack height='100%'>
            <LandingLeft />
            <VStack className='landing-divider'>&nbsp;</VStack>
            <LandingRight />
        </HStack>
    );
}

/**
 * @returns The left side of the landing page. This incldues a logo and a
 * sleek background.
 */
function LandingLeft() {
    return (
        <VStack className='landing-left'>
            <VStack className='landing-left-overlay'>
                <Spacer />
                <img src={logo} alt='Just Data' className='landing-brand' />
                <Spacer />
                <span className='bg-attribution' style={{ alignSelf: 'start' }}>
                    Photo by Maximalfocus on Unsplash
                </span>
            </VStack>
        </VStack>
    );
}

/**
 * A React component which displays the right side of the landing page.
 * This includes the search bar and a list of products, sorted by category.
 *
 * @returns The right side of the landing page.
 */
function LandingRight() {
    /**
     * Performs a filter on all of the products to find which products
     * match the search query. Then the `products` state is updated with
     * the list of filtered categories and products.
     */
    function runProductSearch() {
        setProducts(
            allProducts
                .map(category => {
                    if (
                        CATEGORY_REF_MAPPING[category.category]
                            .toLowerCase()
                            .includes(search.trim().toLowerCase())
                    ) {
                        return category;
                    }

                    return {
                        ...category,
                        products: category.products.filter(product => {
                            return product.product
                                .toLowerCase()
                                .includes(search.trim().toLowerCase());
                        }),
                    };
                })
                .filter(category => category.products.length > 0),
        );
    }

    const [products, setProducts] = useState(allProducts);
    const [search, setSearch] = useState('');

    // Whenever search is updated, it will run a product search
    useEffect(runProductSearch, [search]);

    return (
        <VStack className='landing-right' justify='start'>
            <SearchBar
                value={search}
                placeholder='Search Our Products'
                onChange={e => setSearch(e.target.value)}
                searchDisabled
            />

            <VStack className='products-gallery' justify='start'>
                {products.map(category => (
                    <ProductSection
                        key={category.category}
                        title={CATEGORY_REF_MAPPING[category.category]}
                        icon={category.icon}>
                        {category.products.map(product => (
                            <ProductResult
                                key={product.product}
                                icon={product.icon}
                                label={product.product}
                                url={product.url}
                            />
                        ))}
                    </ProductSection>
                ))}
            </VStack>

            <OptionsBar />
        </VStack>
    );
}

/**
 * A simple transparent bar that is displayed at the bottom of the landing page.
 * It includes a button for: preferences, help, issue reporting, and view on
 * GitHub.
 *
 * @returns The options bar at the bottom of the landing page.
 */
function OptionsBar() {
    const [prefsOpen, setPrefsOpen] = useState(false);

    return (
        <HStack justify='start' className='options-bar'>
            <PreferencesPopup open={prefsOpen} onClose={() => setPrefsOpen(false)} />

            <Button onClick={() => setPrefsOpen(true)}>
                <IonIcon icon={cogOutline} />
                &nbsp; Preferences
            </Button>

            <Button>
                <IonIcon icon={helpOutline} />
                &nbsp; Help
            </Button>

            <Button onClick={openGitHubRepo}>
                <IonIcon icon={bugOutline} />
                &nbsp; Report an Issue
            </Button>

            <Button onClick={openGitHubIssues}>
                <IonIcon icon={logoGithub} />
                &nbsp; View on GitHub
            </Button>
        </HStack>
    );
}

/**
 * A react fragment which displays a category of products along with the products
 * belonging in that category.
 *
 * @param props - The icon and title for the section. The `ProductSection` components
 * should be passed as children.
 * @returns A react fragment which displays a product section.
 */
function ProductSection(props: {
    icon: React.ReactElement;
    title: string;
    children?: React.ReactNode;
}) {
    return (
        <>
            <ProductSectionTitle icon={props.icon} label={props.title} />
            <HStack justify='start'>{props.children}</HStack>
        </>
    );
}

/**
 * @param onClose - A function to call when the preferences popup is closed.
 * @param open - Whether the preferences popup is open or not. If true, the popup
 * will be displayed; if false, the popup will be hidden.
 * @returns The preferences popup window.
 */
function PreferencesPopup({ onClose, open }: PreferencesPopupProps) {
    return (
        <VStack
            className='preferences-popup-overlay'
            style={{ display: open ? undefined : 'none' }}>
            <VStack className='preferences-popup' align='start'>
                <HStack className='titlebar' justify='start'>
                    <Button className='close-button' onClick={() => onClose()}>
                        <IonIcon icon={closeOutline} />
                    </Button>
                    <h2 className='title'>Preferences</h2>
                </HStack>
                <VStack className='inner' justify='start'>
                    <LightDarkModePreferences />
                </VStack>
            </VStack>
        </VStack>
    );
}

/**
 * A component which allows the user to toggle between light and dark mode.
 *
 * @returns A fragment of the preferences popup.
 */
function LightDarkModePreferences() {
    const [selected, setSelected] = useState<AppTheme>(AppPreferences.theme);
    const options = [
        { value: 'light', label: 'Light' },
        { value: 'dark', label: 'Dark' },
    ];

    useEffect(() => {
        AppPreferences.theme = selected;
    }, [selected]);

    return (
        <HStack justify='start'>
            <span>Light/Dark Mode</span>
            &nbsp;
            <DropdownMenu
                options={options}
                placeholder={options.find(o => o.value === selected)?.label}
                onChange={opt => setSelected(opt.value as AppTheme)}
            />
        </HStack>
    );
}

/**
 * Opens the JustData Github page.
 */
function openGitHubRepo() {
    window.open('https://github.com/VirajShah21/JustData', '_blank');
}

/**
 * Opens the JustData issues tab on Github.
 */
function openGitHubIssues() {
    window.open('https://github.com/VirajShah21/JustData/issues/new', '_blank');
}

export default LandingPage;
