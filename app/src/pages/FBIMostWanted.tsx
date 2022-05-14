import axios from 'axios';
import { useState } from 'react';
import { HStack, VStack } from 'reaction';
import FeatureButton from 'src/components/FeatureButton';
import './FBIMostWanted.css';

type FBIMostWantedFeature =
    | 'ten-most-wanted'
    | 'fugitives'
    | 'capitol-violence'
    | 'terrorism'
    | 'missing-persons'
    | 'parental-kidnappings';

function FBIMostWanted() {
    const [feature, setFeature] = useState<FBIMostWantedFeature>('ten-most-wanted');

    return (
        <VStack width='100%' justify='start' className='fbi-most-wanted-page'>
            <HStack className='features-bar'>
                <FeatureButton
                    label='Ten Most Wanted Fugitives'
                    onClick={() => setFeature('ten-most-wanted')}
                    active={feature === 'ten-most-wanted'}
                />
                <FeatureButton
                    label='Fugitives'
                    onClick={() => setFeature('fugitives')}
                    active={feature === 'fugitives'}
                />
                <FeatureButton
                    label='Capitol Violence'
                    onClick={() => setFeature('capitol-violence')}
                    active={feature === 'capitol-violence'}
                />
            </HStack>
            <HStack className='feature-container'>
                {feature === 'ten-most-wanted' && <TenMostWantedList />}
            </HStack>
        </VStack>
    );
}

function TenMostWantedList() {
    const [isLoading, setIsLoading] = useState(true);
    const [fugitives, setFugitives] = useState<TenMostWantedResult[]>([]);

    axios.get('http://localhost:3001/api/fbi/ten-most-wanted').then(response => {
        if (response.status === 200) {
            setFugitives(response.data);
            setIsLoading(false);
        } else {
            alert('Error recieving list of ten most wanted fugitives');
        }
    });

    return (
        <VStack>
            {isLoading && 'Loading...'}
            <HStack className='ten-most-wanted-list'>
                {fugitives.map(fugitive => {
                    return (
                        <VStack
                            className='fugitive-list-item'
                            style={{ backgroundImage: `url(${fugitive.mugshot})` }}
                            justify='end'>
                            <VStack className='fugitive-popover' justify='start'>
                                <h3 className='fugitive-name'>{fugitive.name}</h3>
                                <a href={fugitive.posterURL} className='fugitive-poster-link'>
                                    Wanted Poster
                                </a>
                            </VStack>
                        </VStack>
                    );
                })}
            </HStack>
        </VStack>
    );
}

export default FBIMostWanted;
