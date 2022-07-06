import { IonIcon } from '@ionic/react';
import { handRight, playSkipForward, returnDownForward } from 'ionicons/icons';
import { HStack, VStack } from 'reaction';
import Button from 'src/components/ui/Button';
import { ScriptPlayground } from 'src/hooks/JDScript';
import { JDScriptKit } from 'src/utils/JustSDK';

export interface PlaygroundRunnerProps {
    playground: ScriptPlayground;
}

export default function PlaygroundRunner({ playground }: PlaygroundRunnerProps) {
    return (
        <VStack>
            <HStack>
                <Button
                    onClick={() => {
                        if (playground.id) {
                            JDScriptKit.stepScriptInPlayground(playground.id);
                        } else {
                            alert('Error: Not in sync with server');
                        }
                    }}>
                    <VStack>
                        <IonIcon icon={returnDownForward} size='large' color='primary' />
                        Step
                    </VStack>
                </Button>
                <Button>
                    <VStack>
                        <IonIcon icon={playSkipForward} size='large' color='secondary' />
                        Continue
                    </VStack>
                </Button>
                <Button>
                    <VStack>
                        <IonIcon icon={handRight} size='large' color='danger' />
                        Stop
                    </VStack>
                </Button>
            </HStack>
            <VStack>
                {playground.script.split('\n').map(line => (
                    <code>{line}</code>
                ))}
            </VStack>
        </VStack>
    );
}
