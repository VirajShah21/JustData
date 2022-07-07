import { IonIcon } from '@ionic/react';
import { handRight, playSkipForward, returnDownForward } from 'ionicons/icons';
import { HStack, VStack } from 'reaction';
import Button from 'src/components/ui/Button';
import { ScriptPlayground } from 'src/hooks/JDScript';
import './PlaygroundRunner.css';

export interface PlaygroundRunnerProps {
    playground: ScriptPlayground;
}

export default function PlaygroundRunner({ playground }: PlaygroundRunnerProps) {
    return (
        <HStack width='100%' justify='around' className='playground-runner'>
            <VStack className='playground-controls'>
                {playground.screenshotUrl && (
                    <img
                        src={playground.screenshotUrl}
                        alt='Screenshot of browser'
                        className='playground-screenshot'
                    />
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
            </VStack>

            <VStack className='assembly-decoder' scroll='both' width='35%'>
                {playground.assembly.map(instruction => (
                    <HStack justify='start'>
                        <code className='assembly-code assembly-command'>
                            {instruction.command}
                        </code>
                        {Object.keys(instruction.arguments).map(name => (
                            <code className={`assembly-code assembly-arg`} data-argname={name}>
                                {instruction.arguments[name]}
                            </code>
                        ))}
                    </HStack>
                ))}
            </VStack>
        </HStack>
    );
}
