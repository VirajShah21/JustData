import { ArchiveIcon, GraphIcon, LawIcon, SearchIcon } from '@primer/octicons-react';
import React, { useState } from 'react';
import { HStack, Spacer, VStack } from 'reaction';
import { ProductResult, ProductSectionTitle } from '../components/ProductComponents';
import SearchBar from '../components/SearchBar';
import justFugitivesLogo from '../resources/images/icons/Just Fugitives.png';
import justPlacesLogo from '../resources/images/icons/Just Places.png';
import justSCOTUSLogo from '../resources/images/icons/Just SCOTUS.png';
import justSecuritiesLogo from '../resources/images/icons/Just Securities.png';
import logo from '../resources/images/icons/logo.png';
import searchLogo from '../resources/images/icons/search.png';
import './LandingPage.css';

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

enum ProductCategoryRef {
    FinancialMarkets,
    USIntelligence,
    CrimeAndJustice,
    WebSearch,
}

const CATEGORY_REF_MAPPING = {
    [ProductCategoryRef.FinancialMarkets]: 'Financial Markets',
    [ProductCategoryRef.USIntelligence]: 'United States Intelligence',
    [ProductCategoryRef.CrimeAndJustice]: 'Crime and Justice',
    [ProductCategoryRef.WebSearch]: 'Web Search',
};

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

/**
 * A React component which displays the right side of the landing page.
 * This includes the search bar and a list of products, sorted by category.
 *
 * @returns The right side of the landing page.
 */
function LandingRight() {
    const allProducts: ProductCategory[] = [
        {
            category: ProductCategoryRef.FinancialMarkets,
            icon: <GraphIcon />,
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
            icon: <ArchiveIcon />,
            products: [
                /* CIA World Factbook */
            ],
        },
        {
            category: ProductCategoryRef.CrimeAndJustice,
            icon: <LawIcon />,
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
            icon: <SearchIcon />,
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
    ].sort((a, b) => a.category - b.category);

    const [products, setProducts] = useState(allProducts);
    const [search, setSearch] = useState('');

    return (
        <VStack className='landing-right' justify='start'>
            <SearchBar
                value={search}
                placeholder='Search Our Products'
                onChange={e => {
                    const value = e.target.value;
                    setSearch(value);

                    setProducts(
                        allProducts
                            .map(category => {
                                if (
                                    CATEGORY_REF_MAPPING[category.category]
                                        .toLowerCase()
                                        .includes(value.trim().toLowerCase())
                                ) {
                                    return category;
                                }
                                return {
                                    ...category,
                                    products: category.products.filter(product => {
                                        return product.product
                                            .toLowerCase()
                                            .includes(value.trim().toLowerCase());
                                    }),
                                };
                            })
                            .filter(category => category.products.length > 0),
                    );
                }}
                searchDisabled
            />

            <div style={{ height: '2rem' }} />

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
    );
}

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

export default LandingPage;
