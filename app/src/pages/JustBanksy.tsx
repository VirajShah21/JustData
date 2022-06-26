import { useState } from 'react';
import { HStack, VStack } from 'reaction';
import SearchBar from 'src/components/SearchBar';
import Sidebar from 'src/components/Sidebar';
import logo from 'src/resources/images/icons/Just Banksy.png';
import { BanksyKit } from 'src/utils/JustSDK';
import './JustBanksy.css';
import background from 'src/resources/images/backgrounds/banksy.png';
import LoadingAnimation from 'src/components/LoadingAnimation';

export default function JustBanksy() {
    const [prompt, setPrompt] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [results, setResults] = useState<BanksyScraperResults | null>(null);

    function runSearch() {
        setIsSearching(true);
        BanksyKit.getBanksy(prompt)
            .then(results => {
                setIsSearching(false);
                setResults(results);
            })
            .catch(err => {
                console.error(err);
            });
    }

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
        <HStack height='100%'>
            <Sidebar logo={logo} />
            <VStack justify='start' className='just-banksy' width='100%' scroll='vertical'>
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
        </HStack>
    );
}
