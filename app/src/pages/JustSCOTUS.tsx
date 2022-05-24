import { PlusIcon, XIcon } from '@primer/octicons-react';
import { useState } from 'react';
import { HStack, VStack } from 'reaction';
import Button from 'src/components/Button';
import DropdownMenu, { ValueLabelPair } from 'src/components/DropdownMenu';
import SearchResult from 'src/components/SearchResult';
import { useTitle } from 'src/HTMLHead';
import { SCOTUSKit } from 'src/utils/JustSDK';
import './JustSCOTUS.css';

function JustSCOTUS() {
    const scotusTerms: ValueLabelPair[] = [];
    for (let i = 1789; i < new Date().getFullYear(); i++) {
        scotusTerms.push({ value: i.toString(), label: `${i} - ${i + 1}` });
    }
    scotusTerms.reverse();

    const [selectedTerm, setSelectedTerm] = useState<number>();
    const [terms, setTerms] = useState<number[]>([]);
    const [caseList, setCaseList] = useState<OyezCaseListItem[]>([]);

    useTitle('Just SCOTUS');

    async function pullCases() {
        try {
            setCaseList(await SCOTUSKit.getCaseList(...terms));
        } catch (err) {
            // TODO: Handle error
        }
    }

    return (
        <VStack justify='start' id='just-scotus'>
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
                                [selectedTerm, ...terms].filter(t => t !== undefined) as number[],
                            )
                        }>
                        <PlusIcon />
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
                {caseList.map(CaseResult)}
            </VStack>
        </VStack>
    );
}

function CaseTermBadge(props: { term: number; onRemove: () => void }) {
    return (
        <HStack className='case-term-badge' width='auto'>
            <Button className='case-term-remove-btn' onClick={props.onRemove}>
                <XIcon />
            </Button>
            <span className='case-term'>
                {props.term} - {props.term + 1}
            </span>
        </HStack>
    );
}

function CaseResult(props: OyezCaseListItem) {
    return (
        <SearchResult>
            <h3 className='text-gradient-primary'>{props.name}</h3>
        </SearchResult>
    );
}

export default JustSCOTUS;
