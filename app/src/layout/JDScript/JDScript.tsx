import { flask, flaskOutline } from 'ionicons/icons';
import { HStack } from 'reaction';
import Sidebar, { SidebarNavigationButton } from 'src/components/ui/Sidebar';
import { useScriptPlayground } from 'src/hooks/JDScriptSubscriptions';
import PlaygroundRunner from './PlaygroundRunner';
import ScriptEditor from './ScriptEditor';

/**
 * @returns The JDScript application
 */
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

            <JDScriptPlayground />
        </HStack>
    );
}

/**
 * @returns The JDScript playground component
 */
export function JDScriptPlayground() {
    const playground = useScriptPlayground();

    if (!playground.lifecycle) {
        return <ScriptEditor playground={playground} />;
    }

    return <PlaygroundRunner playground={playground} />;
}
