import { XIcon } from '@primer/octicons-react';
import { HStack, Spacer, VStack } from 'reaction';
import './FugitiveProfile.css';

/**
 * A react component to display the entire profile for a fugitive.
 *
 * @param props - The `FullFugitiveData` object for the fugitive who's profile should be displayed.
 * An additional `onClose()` function is passed to this component to handle behavior once the red
 * close button is clicked (since this is handled by the parent).
 * @returns A fugitive profile which overlays the entire window with the specified fugitive's info.
 */
function FugitiveProfile(props: FullFugitiveData & { onClose: () => void }) {
    let basicBio: JSX.Element | undefined;
    let row1Bio: JSX.Element | undefined;
    let row2Bio: JSX.Element | undefined;

    // Sometimes there may be no bio table, so none of the bio should be displayed.
    if (props.bio) {
        // Basic biography details
        basicBio = (
            <>
                <BioBasicDetails label='Known Aliases' value={props.bio.alias} />
                <BioBasicDetails label='D.O.B.(s)' value={props.bio.dob} />
                <BioBasicDetails label='Birthplace' value={props.bio.birthplace} />
                <BioBasicDetails label='Occupation(s)' value={props.bio.occupation} />
            </>
        );

        // Row 1 of the physical features
        row1Bio = (
            <HStack justify='between' className='physical-features-row-1'>
                <PhysicalFeature label='Hair' value={props.bio.hair} />
                <PhysicalFeature label='Eyes' value={props.bio.eyes} />
                <PhysicalFeature label='Height' value={props.bio.height} />
                <PhysicalFeature label='Weight' value={props.bio.weight} />
            </HStack>
        );

        // Row 2 of the physical features
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

/**
 * A simple React component to display a label and value for a fugitive.
 *
 * Props:
 *
 * - `label`: The label to display. This must be provided.
 * - `value`: The value to display. If this is not provided, then 'n/a' is used.
 *
 * @param props - Refer to the description.
 * @returns A simple component to display a bio attribute for the fugitive.
 */
function BioBasicDetails(props: { label: string; value?: string }) {
    return (
        <HStack justify='start'>
            <strong>{props.label}: &nbsp;</strong>
            {props.value ?? 'n/a'}
        </HStack>
    );
}

/**
 * A simple React component to display a label and value for a fugitive's physical traits.
 *
 * Props:
 *
 * - `label`: The label to display. This must be provided.
 * - `value`: The value to display. If this is not provided, then 'n/a' is used.
 *
 * @param props - Refer to the description.
 * @returns A simple component to display a physical traits for a fugitive.
 */
function PhysicalFeature(props: { label: string; value?: string }) {
    return (
        <span>
            <strong>{props.label}: &nbsp;</strong>
            {props.value ?? 'n/a'}
        </span>
    );
}

export default FugitiveProfile;
