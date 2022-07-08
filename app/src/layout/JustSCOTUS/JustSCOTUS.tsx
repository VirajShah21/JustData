import { IonIcon } from '@ionic/react';
import { addOutline, closeOutline } from 'ionicons/icons';
import { useState } from 'react';
import { HStack, VStack } from 'reaction';
import logo from 'src/assets/images/icons/Just SCOTUS.png';
import LoadingAnimation from 'src/components/LoadingAnimation';
import SearchResult from 'src/components/ui/SearchResult';
import Button from 'src/components/ui/Button';
import DropdownMenu, { ValueLabelPair } from 'src/components/ui/DropdownMenu';
import Sidebar from 'src/components/ui/Sidebar';
import { useTitle } from 'src/hooks/meta';
import { SCOTUSKit } from 'src/utils/JustSDK';
import './JustSCOTUS.css';

/**
 * The application container for the Just SCOTUS application.
 *
 * @returns The Just SCOTUS page.
 */
export default function JustSCOTUS() {
    // Generates the options for the term selection dropdown menu
    // This uses values from the first SCOTUS case till the current term
    const scotusTerms: ValueLabelPair[] = [];
    for (let i = 1789; i < new Date().getFullYear(); i++) {
        scotusTerms.push({ value: i.toString(), label: `${i} - ${i + 1}` });
    }
    scotusTerms.reverse();

    const [selectedTerm, setSelectedTerm] = useState<number>();
    const [terms, setTerms] = useState<number[]>([]);
    const [caseList, setCaseList] = useState<OyezCaseListItem[]>([]);
    const [loading, setLoading] = useState(false);

    useTitle('Just SCOTUS');

    /**
     * Pulls the cases for the selected terms.
     */
    async function pullCases() {
        setLoading(true);
        try {
            setCaseList(await SCOTUSKit.getCaseList(...terms));
        } catch (err) {
            // TODO: Handle error
        }
        setLoading(false);
    }

    return (
        <HStack justify='start' id='just-scotus' height='100%'>
            <Sidebar logo={logo} />

            <VStack width='100%'>
                <HStack className='term-selection-bar'>
                    <HStack justify='start'>
                        <DropdownMenu
                            placeholder='Select a Term'
                            options={scotusTerms}
                            onChange={term => setSelectedTerm(parseInt(term.value, 10))}
                        />
                        <Button
                            onClick={() =>
                                setTerms(
                                    [selectedTerm, ...terms].filter(
                                        t => t !== undefined,
                                    ) as number[],
                                )
                            }>
                            <IonIcon icon={addOutline} />
                            Add Term
                        </Button>
                        <Button onClick={pullCases}>Pull Cases</Button>
                    </HStack>
                    <HStack justify='end'>
                        {terms.map(t => (
                            <CaseTermBadge
                                term={t}
                                onRemove={() => {
                                    setTerms(terms.filter(currTerm => currTerm !== t));
                                }}
                            />
                        ))}
                    </HStack>
                </HStack>

                <VStack justify='start' align='start' alignSelf='start'>
                    {loading && <LoadingAnimation />}
                    {caseList.map(CaseResult)}
                </VStack>
            </VStack>
        </HStack>
    );
}

/**
 * A case term badge component. It is used when adding or removing terms from/to the terms
 * list. It comes paired with a remove button (denoted by an X) which removes the term from
 * the term list.
 *
 * @param props - The term start year and the action to perform when the remove button
 * is clicked.
 * @returns A badge for the SCOTUS term.
 */
function CaseTermBadge(props: { term: number; onRemove: () => void }) {
    return (
        <HStack className='case-term-badge' width='auto'>
            <Button className='case-term-remove-btn' onClick={props.onRemove}>
                <IonIcon icon={closeOutline} />
            </Button>
            <span className='case-term'>
                {props.term} - {props.term + 1}
            </span>
        </HStack>
    );
}

/**
 * A search result component for displaying an Oyez Supreme court case result.
 *
 * @param props - The case to display. This should use the spread operator with the
 * the `OyezCaseListItem` object rather than assigning each property individually:
 *
 * ```
 * <CaseResult {...case} />
 * ```
 * @returns The case search result.
 */
function CaseResult(props: OyezCaseListItem) {
    return (
        <SearchResult>
            <h3 className='text-gradient-primary'>{props.name}</h3>
        </SearchResult>
    );
}
