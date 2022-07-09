import { useState } from 'react';
import { HStack, VStack } from 'reaction';
import background from 'src/assets/images/backgrounds/banksy.png';
import LoadingAnimation from 'src/components/LoadingAnimation';
import SearchBar from 'src/components/ui/SearchBar';
import { BanksyKit } from 'src/utils/JustSDK';
import styles from './ImageGenerator.module.css';

/**
 * @returns The image generator for the JustBanksy product.
 */
export default function ImageGenerator() {
    const [prompt, setPrompt] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [results, setResults] = useState<BanksyScraperResults | null>(null);

    /**
     * Performs the search on the JustBanksy API.
     */
    function runSearch() {
        setIsSearching(true);
        BanksyKit.getBanksy(prompt)
            .then(response => {
                setIsSearching(false);
                setResults(response);
            })
            .catch(() => {
                // TODO: Handle error
            });
    }

    /**
     * @returns The images to display in the results section.
     */
    function renderResults() {
        if (results) {
            return (
                <>
                    {results.images.map((src, i) => (
                        <img src={src} alt={`Result #${i}`} />
                    ))}
                </>
            );
        }

        return null;
    }

    return (
        <VStack justify='start' width='100%' scroll='vertical'>
            <SearchBar
                placeholder='Enter an Image Prompt'
                onChange={e => setPrompt(e.target.value)}
                onSearch={runSearch}
            />

            <VStack grow={1} justify='start'>
                {isSearching && (
                    <VStack>
                        <LoadingAnimation />
                        <div>Creating original images of "{prompt}"</div>
                    </VStack>
                )}
                {!isSearching && results === null && (
                    <img src={background} alt='Banksy Background' className={styles.background} />
                )}
                <HStack className={styles.results}>{renderResults()}</HStack>
            </VStack>
        </VStack>
    );
}
