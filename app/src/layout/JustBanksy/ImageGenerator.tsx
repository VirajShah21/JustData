import { useState } from 'react';
import { HStack, VStack } from 'reaction';
import background from 'src/assets/images/backgrounds/banksy.png';
import LoadingAnimation from 'src/components/LoadingAnimation';
import SearchBar from 'src/components/ui/SearchBar';
import { BanksyKit } from 'src/utils/JustSDK';

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
                    {results.images.map(src => (
                        <img src={src} />
                    ))}
                </>
            );
        }

        return null;
    }

    return (
        <VStack justify='start' width='100%' className='just-banksy' scroll='vertical'>
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
                    <img src={background} alt='Banksy Background' className='background' />
                )}
                <HStack className='results'>{renderResults()}</HStack>
            </VStack>
        </VStack>
    );
}
