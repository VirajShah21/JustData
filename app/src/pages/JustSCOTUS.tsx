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

    const [term, setTerm] = useState<number>();
    const [caseList, setCaseList] = useState<OyezCaseListItem[]>([]);

    useTitle('Just SCOTUS');

    async function pullCases() {
        try {
            const cases = await SCOTUSKit.getCaseList(term ?? new Date().getFullYear() - 1);
            const arr = [];
            // Flatten the Year-to-CaseList map into an array of cases
            for (const term in cases) if (cases.hasOwnProperty(term)) arr.push(...cases[term]);
            setCaseList(arr);
        } catch (err) {
            // TODO: Handle error
        }
    }

    return (
        <VStack justify='start'>
            <HStack>
                <DropdownMenu
                    placeholder='Select a Term'
                    options={scotusTerms}
                    onChange={term => setTerm(parseInt(term.value, 10))}
                />
                <Button onClick={pullCases}>Pull Cases</Button>
            </HStack>

            <VStack justify='start' align='start' alignSelf='start'>
                {caseList.map(CaseResult)}
            </VStack>
        </VStack>
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
