import { VStack } from 'reaction';
import styles from './FugitiveListItem.module.css';

/**
 * @param props - The data associated with the fugitive. This can be either the simple
 * data (`SimpleFugitiveData`) or the full data (`FullFugitiveData`). An additional
 * prop should also be assigned, `opensProfile` to determine whether or not to pull up
 * the fugitives profile once the button is clicked.
 *
 * If a `SimpleFugitiveData` object is passed as props, then `opensProfile` must be false
 * or undefined. Otherwise `opensProfile` can either be true or false or undefined.
 *
 * If `SimpleFugitiveData` is set to `true`, then a button will appear to display
 * the fugitives entire profile on-site. Otherwise, a button will appear which links
 * to the PDF containing the wanted poster from the FBI site.
 * @returns A single fugitive to be displayed in a fugitives list.
 */
export default function FugitiveListItem(props: SimpleFugitiveData & { opensProfile?: boolean }) {
    // const [showingProfile, setShowingProfile] = useState(false);

    return (
        <VStack
            className={styles.fugitive_list_item}
            style={{ backgroundImage: `url(${props.mugshot})` }}
            justify='end'>
            <VStack className={styles.popover} justify='start'>
                <h3 className={styles.name}>{props.name}</h3>
                {props.opensProfile ? (
                    <button
                        // onClick={() => setShowingProfile(true)}
                        className={styles.poster_link}>
                        View Full Profile
                    </button>
                ) : (
                    <a href={props.profileURL} className={styles.poster_link}>
                        Wanted Poster
                    </a>
                )}
            </VStack>

            {/* {showingProfile && (
                <FugitiveProfile
                    {...(props as FullFugitiveData)}
                    onClose={() => setShowingProfile(false)}
                />
            )} */}
        </VStack>
    );
}
