import { XIcon } from '@primer/octicons-react';
import { HStack, Spacer, VStack } from 'reaction';
import './FugitiveProfile.css';

function FugitiveProfile(props: FullFugitiveData & { onClose: () => void }) {
    let basicBio: JSX.Element | undefined;
    let row1Bio: JSX.Element | undefined;
    let row2Bio: JSX.Element | undefined;

    if (props.bio) {
        basicBio = (
            <>
                <BioBasicDetails label='Known Aliases' value={props.bio.alias} />
                <BioBasicDetails label='D.O.B.(s)' value={props.bio.dob} />
                <BioBasicDetails label='Birthplace' value={props.bio.birthplace} />
                <BioBasicDetails label='Occupation(s)' value={props.bio.occupation} />
            </>
        );

        row1Bio = (
            <HStack justify='between' className='physical-features-row-1'>
                <PhysicalFeature label='Hair' value={props.bio.hair} />
                <PhysicalFeature label='Eyes' value={props.bio.eyes} />
                <PhysicalFeature label='Height' value={props.bio.height} />
                <PhysicalFeature label='Weight' value={props.bio.weight} />
            </HStack>
        );

        row2Bio = (
            <HStack justify='between' className='physical-features-row-2'>
                <PhysicalFeature label='Build' value={props.bio.build} />
                <PhysicalFeature label='Complexion' value={props.bio.complexion} />
                <PhysicalFeature label='Sex' value={props.bio.sex} />
                <PhysicalFeature label='Race' value={props.bio.race} />
            </HStack>
        );
    }

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
                    {row1Bio}
                    {row2Bio}
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

function PhysicalFeature(props: { label: string; value?: string }) {
    return (
        <span>
            <strong>{props.label}: &nbsp;</strong>
            {props.value ?? 'n/a'}
        </span>
    );
}

export default FugitiveProfile;
