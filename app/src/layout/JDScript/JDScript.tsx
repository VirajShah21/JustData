import { flask, flaskOutline } from 'ionicons/icons';
import { HStack, VStack } from 'reaction';
import Sidebar, { SidebarNavigationButton } from 'src/components/ui/Sidebar';
import { useScriptPlayground } from 'src/hooks/JDScript';
import PlaygroundRunner from './PlaygroundRunner';
import ScriptEditor from './ScriptEditor';

export default function JDScript() {
    return (
        <HStack height='100vh'>
            <Sidebar logo=''>
                <SidebarNavigationButton
                    ionicon={{ default: flaskOutline, active: flask }}
                    label={'JDScript Playground'}
                    onClick={() => undefined}
                />
            </Sidebar>

            <VStack grow={1}>
                <JDScriptPlayground />
            </VStack>
        </HStack>
    );
}

export function JDScriptPlayground() {
    const playground = useScriptPlayground();

    if (!playground.running) {
        return <ScriptEditor playground={playground} />;
    }

    return <PlaygroundRunner playground={playground} />;
}
