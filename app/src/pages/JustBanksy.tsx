import { VStack } from 'reaction';
import SearchBar from 'src/components/SearchBar';
import TitleBar from 'src/components/TitleBar';

export default function JustBanksy() {
    return (
        <VStack>
            <TitleBar>
                <SearchBar />
            </TitleBar>
        </VStack>
    );
}
