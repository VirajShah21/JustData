import { useState } from 'react';
import { HStack, VStack } from 'reaction';
import FeatureButton from 'src/components/FeatureButton';

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
        <VStack width='100%'>
            <HStack>
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
        </VStack>
    );
}

export default FBIMostWanted;
