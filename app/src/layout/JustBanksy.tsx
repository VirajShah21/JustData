import { albumsOutline, imagesOutline } from 'ionicons/icons';
import { useState } from 'react';
import { HStack, VStack } from 'reaction';
import LoadingAnimation from 'src/components/LoadingAnimation';
import SearchBar from 'src/components/ui/SearchBar';
import Sidebar, { SidebarNavigationButton } from 'src/components/ui/Sidebar';
import background from 'src/assets/images/backgrounds/banksy.png';
import logo from 'src/assets/images/icons/Just Banksy.png';
import ArrayUtils from 'src/utils/ArrayUtils';
import { BanksyKit } from 'src/utils/JustSDK';
import './JustBanksy.css';

type JustBanksyFeatures = 'image-generator' | 'prepared-statements';

interface StatementGeneratorProps {
    onChange: (prompt: string) => void;
}

interface StatementGeneratorPhraseProps {
    text: string;
    onClick: (phrase: string) => void;
    active: boolean;
}

/**
 * @returns A page that displays the JustBanksy app.
 */
export default function JustBanksy() {
    const [feature, setFeature] = useState<JustBanksyFeatures>('image-generator');

    function ActiveFeature() {
        if (feature === 'image-generator') {
            return <ImageGenerator />;
        }

        if (feature === 'prepared-statements') {
            return <PreparedStatements />;
        }

        setFeature('image-generator');
        return <ImageGenerator />;
    }

    return (
        <HStack height='100%'>
            <Sidebar logo={logo}>
                <SidebarNavigationButton
                    ionicon={imagesOutline}
                    label='Image Generator'
                    onClick={() => setFeature('image-generator')}
                    active={feature === 'image-generator'}
                />
                <SidebarNavigationButton
                    ionicon={albumsOutline}
                    label='Prepared Statements'
                    onClick={() => setFeature('prepared-statements')}
                    active={feature === 'prepared-statements'}
                />
            </Sidebar>

            <ActiveFeature />
        </HStack>
    );
}

function ImageGenerator() {
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

function PreparedStatements() {
    const [prompt, setPrompt] = useState('');

    return (
        <HStack justify='around' height='100%' width='100%'>
            <div style={{ width: '20%', aspectRatio: '1', background: 'red' }}>
                This feature is not complete yet
            </div>
            {prompt}
            <StatementGenerator onChange={prompt => setPrompt(prompt)} />
        </HStack>
    );
}

function StatementGenerator({ onChange }: StatementGeneratorProps) {
    const imageTypes = ['A photo of', 'An oil painting of', 'A doodle of'];
    const subjects = [
        'fuzzy panda',
        'British Shorthair cat',
        'Persian cat',
        'Shiba Inu dog',
        'raccoon',
    ];
    const accessories = ['wearing a cowboy hat and', 'wearing sunglasses and'];
    const clothes = ['red shirt', 'black leather jacket'];
    const verbs = ['playing a guitar', 'riding a bike', 'skateboarding'];
    const locations = ['in a garden', 'on a beach', 'on top of a mountain'];

    const [imageType, setImageType] = useState(ArrayUtils.random(imageTypes));
    const [subject, setSubject] = useState(ArrayUtils.random(subjects));
    const [accessory, setAccessory] = useState(ArrayUtils.random(accessories));
    const [clothing, setClothing] = useState(ArrayUtils.random(clothes));
    const [verb, setVerb] = useState(ArrayUtils.random(verbs));
    const [location, setLocation] = useState(ArrayUtils.random(locations));

    return (
        <VStack height='auto' className='banksy-statement-generator'>
            <HStack justify='start'>
                {imageTypes.map(type => (
                    <StatementGeneratorPhrase
                        text={type}
                        active={imageType === type}
                        onClick={() => setImageType(type)}
                    />
                ))}
            </HStack>

            <HStack justify='start'>
                {subjects.map(currSubject => (
                    <StatementGeneratorPhrase
                        text={currSubject}
                        active={subject === currSubject}
                        onClick={() => setSubject(currSubject)}
                    />
                ))}
            </HStack>

            <HStack justify='start'>
                {accessories.map(currAccessory => (
                    <StatementGeneratorPhrase
                        text={currAccessory}
                        active={currAccessory === accessory}
                        onClick={() => setAccessory(currAccessory)}
                    />
                ))}
            </HStack>

            <HStack justify='start'>
                {clothes.map(currClothing => (
                    <StatementGeneratorPhrase
                        text={currClothing}
                        active={currClothing === clothing}
                        onClick={() => setClothing(currClothing)}
                    />
                ))}
            </HStack>

            <HStack justify='start'>
                {verbs.map(currVerb => (
                    <StatementGeneratorPhrase
                        text={currVerb}
                        active={currVerb === verb}
                        onClick={() => setVerb(currVerb)}
                    />
                ))}
            </HStack>

            <HStack justify='start'>
                {locations.map(currLocation => (
                    <StatementGeneratorPhrase
                        text={currLocation}
                        active={currLocation === location}
                        onClick={() => setLocation(currLocation)}
                    />
                ))}
            </HStack>
        </VStack>
    );
}

function StatementGeneratorPhrase({ text, onClick, active }: StatementGeneratorPhraseProps) {
    return (
        <div
            onClick={() => onClick(text)}
            className={active ? 'statement-generator-phrase active' : 'statement-generator-phrase'}>
            {text}
        </div>
    );
}
