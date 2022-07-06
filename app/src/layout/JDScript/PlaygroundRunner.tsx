import { IonIcon } from '@ionic/react';
import { handRight, playSkipForward, returnDownForward } from 'ionicons/icons';
import { HStack, VStack } from 'reaction';
import Button from 'src/components/ui/Button';
import { ScriptPlayground } from 'src/hooks/JDScript';
import { JDScriptKit } from 'src/utils/JustSDK';
import './PlaygroundRunner.css';

export interface PlaygroundRunnerProps {
    playground: ScriptPlayground;
}

export default function PlaygroundRunner({ playground }: PlaygroundRunnerProps) {
    return (
        <VStack justify='around' className='playground-runner'>
            {playground.screenshotUrl && (
                <img src={playground.screenshotUrl} alt='Screenshot of browser' />
            )}

            <HStack>
                <Button onClick={playground.step}>
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
            <VStack height='auto' scroll='both' className='assembly-decoder'>
                {playground.assembly.map(instruction => (
                    <HStack justify='start'>
                        <code className='assembly-code assembly-command'>
                            {instruction.command}
                        </code>
                        {instruction.arguments.map(argument => (
                            <code className={`assembly-code assembly-arg`}>{argument}</code>
                        ))}
                    </HStack>
                ))}
            </VStack>
        </VStack>
    );
}
