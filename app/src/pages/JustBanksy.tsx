import { useState } from 'react';
import { HStack, VStack } from 'reaction';
import SearchBar from 'src/components/SearchBar';
import Sidebar from 'src/components/Sidebar';
import TitleBar from 'src/components/TitleBar';
import { BanksyKit } from 'src/utils/JustSDK';
import './JustBanksy.css';
import logo from 'src/resources/images/icons/Just Banksy.png';

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
        if (results)
            return (
                <>
                    {results.images.map(src => (
                        <img src={src} />
                    ))}
                </>
            );
        return null;
    }

    return (
        <HStack height='100%'>
            <Sidebar logo={logo} />
            <VStack justify='start' className='just-banksy' width='100%'>
                <SearchBar
                    placeholder='Enter an Image Prompt'
                    onChange={e => setPrompt(e.target.value)}
                    onSearch={() => {
                        runSearch();
                    }}
                />

                <VStack grow={1} justify='center'>
                    {isSearching && <div>Searching for "{prompt}"</div>}
                    <HStack className='results'>{renderResults()}</HStack>
                </VStack>
            </VStack>
        </HStack>
    );
}
