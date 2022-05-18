import axios from 'axios';
import { useState } from 'react';
import { HStack, VStack } from 'reaction';
import FeatureButton from 'src/components/FeatureButton';
import FugitiveProfile from 'src/components/FugitiveProfile';
import PageController from 'src/components/PageController';
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
                {feature === 'fugitives' && <AllFugitivesList />}
            </HStack>
        </VStack>
    );
}

function TenMostWantedList() {
    const [isLoading, setIsLoading] = useState(true);
    const [fugitives, setFugitives] = useState<SimpleFugitiveData[]>([]);

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
            <HStack className='fugitives-list'>
                {fugitives.map(fugitive => (
                    <FugitiveListItem {...fugitive} opensProfile={false} />
                ))}
            </HStack>
        </VStack>
    );
}

function AllFugitivesList() {
    const pageSize = 20;
    const [isLoading, setIsLoading] = useState(true);
    const [fugitives, setFugitives] = useState<SimpleFugitiveData[]>([]);
    const [page, setPage] = useState(1);

    axios.get('http://localhost:3001/api/fbi/all-fugitives').then(response => {
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
            <HStack className='fugitives-list'>
                {fugitives.slice(pageSize * (page - 1), pageSize * page).map(fugitive => (
                    <FugitiveListItem {...fugitive} opensProfile={true} />
                ))}
            </HStack>
            <PageController
                lastPage={Math.ceil(fugitives.length / pageSize)}
                currentPage={page}
                onPageChange={pgNumber => setPage(pgNumber)}
            />
        </VStack>
    );
}

function FugitiveListItem(
    props: (SimpleFugitiveData | FullFugitiveData) & { opensProfile?: boolean }
) {
    const [showingProfile, setShowingProfile] = useState(false);

    return (
        <VStack
            className='fugitive-list-item'
            style={{ backgroundImage: `url(${props.mugshot})` }}
            justify='end'>
            <VStack className='fugitive-popover' justify='start'>
                <h3 className='fugitive-name'>{props.name}</h3>
                {props.opensProfile ? (
                    <button
                        onClick={() => {
                            setShowingProfile(true);
                        }}
                        className='fugitive-poster-link'>
                        View Full Profile
                    </button>
                ) : (
                    <a href={props.posterURL} className='fugitive-poster-link'>
                        Wanted Poster
                    </a>
                )}
            </VStack>

            {showingProfile && (
                <FugitiveProfile
                    {...(props as FullFugitiveData)}
                    onClose={() => setShowingProfile(false)}
                />
            )}
        </VStack>
    );
}

export default FBIMostWanted;
