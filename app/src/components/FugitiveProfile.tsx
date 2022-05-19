import { XIcon } from '@primer/octicons-react';
import { HStack, Spacer, VStack } from 'reaction';
import './FugitiveProfile.css';

function FugitiveProfile(props: FullFugitiveData & { onClose: () => void }) {
    const basicBio = props.bio ? (
        <>
            <BioBasicDetails label='Known Aliases' value={props.bio.alias} />
            <BioBasicDetails label='D.O.B.(s)' value={props.bio.dob} />
            <BioBasicDetails label='Birthplace' value={props.bio.birthplace} />
            <BioBasicDetails label='Occupation(s)' value={props.bio.occupation} />
        </>
    ) : undefined;

    return (
        <VStack className='fugitive-profile' justify='start'>
            <HStack justify='start' className='fugitive-profile-titlebar'>
                <button className='close-btn' onClick={() => props.onClose()}>
                    <XIcon size={25} />
                </button>
                <div className='fugitive-profile-title'>Fugitive Profile</div>
            </HStack>
            <Spacer />
            <HStack className='bio-container' justify='between'>
                <img src={props.mugshot} alt={`${props.name}'s mugshot`} />
                <VStack align='start' justify='between' className='bio-details' grow={1}>
                    <h1>{props.name}</h1>
                    {basicBio}
                    <h2>Physical Features</h2>
                    <HStack justify='between' className='physical-features-row-1'>
                        {props.bio && props.bio.hair && (
                            <span>
                                <strong>Hair: &nbsp;</strong>
                                {props.bio.hair}
                            </span>
                        )}
                        {props.bio && props.bio.eyes && (
                            <span>
                                <strong>Eyes: &nbsp;</strong>
                                {props.bio.eyes}
                            </span>
                        )}
                        {props.bio && props.bio.height && (
                            <span>
                                <strong>Height: &nbsp;</strong>
                                {props.bio.height}
                            </span>
                        )}
                        {props.bio && props.bio.weight && (
                            <span>
                                <strong>Weight: &nbsp;</strong>
                                {props.bio.weight}
                            </span>
                        )}
                    </HStack>
                    <HStack justify='between' className='physical-features-row-2'>
                        {props.bio && props.bio.build && (
                            <span>
                                <strong>Build: &nbsp;</strong>
                                {props.bio.build}
                            </span>
                        )}
                        {props.bio && props.bio.complexion && (
                            <span>
                                <strong>Complexion: &nbsp;</strong>
                                {props.bio.complexion}
                            </span>
                        )}
                        {props.bio && props.bio.sex && (
                            <span>
                                <strong>Sex: &nbsp;</strong>
                                {props.bio.sex}
                            </span>
                        )}
                        {props.bio && props.bio.race && (
                            <span>
                                <strong>Race: &nbsp;</strong>
                                {props.bio.race}
                            </span>
                        )}
                    </HStack>
                    <HStack justify='between'>
                        {props.bio && props.bio.nationality && (
                            <span>
                                <strong>Nationality: &nbsp;</strong>
                                {props.bio.nationality}
                            </span>
                        )}
                    </HStack>
                    <HStack justify='start'>
                        {props.bio && props.bio.markings && (
                            <span>
                                <strong>Scars &amp; Markings: &nbsp;</strong>
                                {props.bio.markings}
                            </span>
                        )}
                    </HStack>
                </VStack>
            </HStack>
            <HStack className='additional-details' justify='between'>
                <p>{props.remarks}</p>
                <p>{props.caution && props.caution.text}</p>
            </HStack>
            {props.caution && props.caution.warning && (
                <HStack className='fugitive-warning'>{props.caution.warning}</HStack>
            )}
            <Spacer />
        </VStack>
    );
}

function BioBasicDetails(props: { label: string; value?: string }) {
    return (
        <HStack justify='start'>
            <strong>{props.label}: &nbsp;</strong>
            {props.value ?? 'n/a'}
        </HStack>
    );
}

export default FugitiveProfile;
