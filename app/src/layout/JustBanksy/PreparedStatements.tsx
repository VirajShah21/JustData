import { useState } from 'react';
import { HStack, VStack } from 'reaction';
import ArrayUtils from 'src/utils/ArrayUtils';
import './PreparedStatements.css';

interface StatementGeneratorProps {
    onChange: (prompt: string) => void;
}

interface StatementGeneratorPhraseProps {
    text: string;
    onClick: (phrase: string) => void;
    active: boolean;
}

/**
 * This is an advanced component that has two sections. An image container that displays and image
 * defined by the prompt. The second section is a list of phrases that can be used to generate the
 * prompt. When the user selects a phrase, the prompt is changed, thus updating the image to match
 * the new prompt.
 *
 * @returns A component that displays a generated image and a combination of phrases that
 * allows the user to select which phrases to use.
 */
export default function PreparedStatements() {
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

/**
 * @param props.onChange - A function that is called when the prompt is changed.
 * @returns A sequence of phrases that can be clicked to generate a new prompt.
 */
function StatementGenerator({ onChange }: StatementGeneratorProps) {
    /**
     * Concatenates each selected state variable into a single prompt.
     *
     * @returns The full prompt.
     */
    function synthesizePrompt() {
        return `${imageType} ${subject} ${accessory} ${clothing} ${verb} ${location}`;
    }

    // * Possible phrases that can be selected for part of the prompt
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

    // * State variables for each part of the prompt
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
                        onClick={() => {
                            setImageType(type);
                            onChange(synthesizePrompt());
                        }}
                    />
                ))}
            </HStack>

            <HStack justify='start'>
                {subjects.map(currSubject => (
                    <StatementGeneratorPhrase
                        text={currSubject}
                        active={subject === currSubject}
                        onClick={() => {
                            setSubject(currSubject);
                            onChange(synthesizePrompt());
                        }}
                    />
                ))}
            </HStack>

            <HStack justify='start'>
                {accessories.map(currAccessory => (
                    <StatementGeneratorPhrase
                        text={currAccessory}
                        active={currAccessory === accessory}
                        onClick={() => {
                            setAccessory(currAccessory);
                            onChange(synthesizePrompt());
                        }}
                    />
                ))}
            </HStack>

            <HStack justify='start'>
                {clothes.map(currClothing => (
                    <StatementGeneratorPhrase
                        text={currClothing}
                        active={currClothing === clothing}
                        onClick={() => {
                            setClothing(currClothing);
                            onChange(synthesizePrompt());
                        }}
                    />
                ))}
            </HStack>

            <HStack justify='start'>
                {verbs.map(currVerb => (
                    <StatementGeneratorPhrase
                        text={currVerb}
                        active={currVerb === verb}
                        onClick={() => {
                            setVerb(currVerb);
                            onChange(synthesizePrompt());
                        }}
                    />
                ))}
            </HStack>

            <HStack justify='start'>
                {locations.map(currLocation => (
                    <StatementGeneratorPhrase
                        text={currLocation}
                        active={currLocation === location}
                        onClick={() => {
                            setLocation(currLocation);
                            onChange(synthesizePrompt());
                        }}
                    />
                ))}
            </HStack>
        </VStack>
    );
}

/**
 * @param props.text - The text to display as the "phrase".
 * @param props.onClick - A callback that should be invoked when the phrase is clicked.
 * @param props.active - Whether or not the phrase is currently selected.
 * @returns A phrase that can be clicked.
 */
function StatementGeneratorPhrase({ text, onClick, active }: StatementGeneratorPhraseProps) {
    return (
        <div
            onClick={() => onClick(text)}
            className={active ? 'statement-generator-phrase active' : 'statement-generator-phrase'}>
            {text}
        </div>
    );
}
