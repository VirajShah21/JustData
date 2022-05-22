import axios from 'axios';
import { useState } from 'react';
import { HStack, VStack } from 'reaction';
import Button from 'src/components/Button';
import DropdownMenu, { ValueLabelPair } from 'src/components/DropdownMenu';
import SearchResult from 'src/components/SearchResult';
import { useTitle } from 'src/HTMLHead';
import './JustSCOTUS.css';

const scotusTerms: ValueLabelPair[] = [];

for (let i = 1789; i <= new Date().getFullYear(); i++) {
    scotusTerms.push({ value: i.toString(), label: `${i} - ${i + 1}` });
}

scotusTerms.reverse();

function JustSCOTUS() {
    const [term, setTerm] = useState<number>();
    const [caseList, setCaseList] = useState<OyezCaseListItem[]>([]);

    useTitle('Just SCOTUS');

    return (
        <VStack justify='start'>
            <HStack>
                <DropdownMenu
                    placeholder='Select a Term'
                    options={scotusTerms}
                    onChange={term => setTerm(parseInt(term.value))}
                />
                <Button
                    onClick={() => {
                        axios
                            .get(`http://localhost:3001/api/supreme-court/cases?term=${term}`)
                            .then(response => {
                                console.log(response);
                                if (response.status === 200) {
                                    const arr = [];
                                    for (const term in response.data) {
                                        arr.push(...response.data[term]);
                                    }
                                    console.log(arr);
                                    setCaseList(arr);
                                }
                            });
                    }}>
                    Pull Cases
                </Button>
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
