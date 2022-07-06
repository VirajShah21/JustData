import { IonIcon } from '@ionic/react';
import { handRight, playSkipForward, returnDownForward } from 'ionicons/icons';
import { HStack, VStack } from 'reaction';
import Button from 'src/components/ui/Button';
import { ScriptPlayground } from 'src/hooks/JDScript';

export interface PlaygroundRunnerProps {
    playground: ScriptPlayground;
}

export default function PlaygroundRunner({ playground }: PlaygroundRunnerProps) {
    return (
        <VStack>
            <HStack>
                <Button>
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
            <pre>
                {playground.script.split('\n').map(line => (
                    <code>
                        {line}
                        <br />
                    </code>
                ))}
            </pre>
        </VStack>
    );
}
