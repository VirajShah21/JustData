import React, { useEffect, useState } from 'react';
import { HStack, Spacer, VStack } from 'reaction';
import logo from 'src/assets/images/icons/logo.png';
import { ProductResult, ProductSectionTitle } from 'src/components/LandingPage/ProductComponents';
import SearchBar from 'src/components/ui/SearchBar';
import './LandingPage.css';
import { OptionsBar } from './OptionsBar';
import { allProducts, CATEGORY_REF_MAPPING } from './ProductManager';

/**
 * @returns The landing page for Just Data.
 */
function LandingPage() {
    return (
        <HStack height='100%' className='landing-page'>
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

export default LandingPage;