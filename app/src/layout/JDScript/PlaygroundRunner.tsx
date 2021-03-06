import { IonIcon } from '@ionic/react';
import { copy, handRight, image, layers, playSkipForward, returnDownForward } from 'ionicons/icons';
import { useState } from 'react';
import { HStack, VStack } from 'reaction';
import Button from 'src/components/ui/Button';
import { JDSPlaygroundState, ScriptPlayground } from 'src/hooks/JDScriptSubscriptions';
import styles from './PlaygroundRunner.module.css';
import keyframes from 'src/styles/keyframes.module.css';

export enum JDSDevTool {
    SCREENSHOT,
    DATA_INSPECTOR,
    SELECTIONS,
}

export interface PlaygroundRunnerProps {
    playground: ScriptPlayground;
}

/**
 * @param props.playground - The playground subscription returned by `useScriptPlayground`
 * @returns The playground runner and dev tools for JDScript
 */
export default function PlaygroundRunner({ playground }: PlaygroundRunnerProps) {
    const [devTool, setDevTool] = useState<JDSDevTool>(JDSDevTool.SCREENSHOT);

    return (
        <HStack width='100%' justify='around' className={styles.playground_runner}>
            <VStack>
                <HStack justify='start'>
                    <Button onClick={() => setDevTool(JDSDevTool.SCREENSHOT)}>
                        <HStack>
                            <IonIcon icon={image} />
                            Screenshot
                        </HStack>
                    </Button>
                    <Button onClick={() => setDevTool(JDSDevTool.DATA_INSPECTOR)}>
                        <HStack>
                            <IonIcon icon={layers} />
                            Data Inspector
                        </HStack>
                    </Button>
                    <Button onClick={() => setDevTool(JDSDevTool.SELECTIONS)}>
                        <HStack>
                            <IonIcon icon={copy} />
                            Selections
                        </HStack>
                    </Button>
                </HStack>

                {devTool === JDSDevTool.SCREENSHOT && playground.screenshotUrl && (
                    <img
                        src={playground.screenshotUrl}
                        alt='Screenshot of browser'
                        className={styles.screenshot}
                    />
                )}

                {devTool === JDSDevTool.DATA_INSPECTOR && (
                    <VStack>
                        <table>
                            <thead>
                                <th>Variable</th>
                                <th>Value</th>
                            </thead>
                            <tbody>
                                {Object.keys(playground.vars).map(variable => (
                                    <tr>
                                        <td>{variable}</td>
                                        <td>{playground.vars[variable]}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <table>
                            <thead>
                                <th>Field</th>
                                <th>Value</th>
                            </thead>
                            <tbody>
                                {Object.keys(playground.fields).map(field => (
                                    <tr>
                                        <td>{field}</td>
                                        <td>{playground.fields[field]}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </VStack>
                )}

                {devTool === JDSDevTool.SELECTIONS && <VStack></VStack>}

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
                    <Button>
                        <VStack>
                            <IonIcon icon={layers} size='large' color='warning' />
                            Data
                        </VStack>
                    </Button>
                </HStack>
            </VStack>

            <VStack className={styles.assembly_decoder} scroll='both' width='35%'>
                {playground.assembly.map((instruction, instPointer) => (
                    <HStack justify='start'>
                        <code
                            key={instPointer}
                            className={`${styles.assembly_code} ${styles.assembly_command} ${
                                playground.lifecycle === JDSPlaygroundState.EXECUTING &&
                                instPointer === playground.instructionPointer
                                    ? `${styles.executing} ${keyframes.rotate} ${keyframes.fast} ${keyframes.forever} ${keyframes.ease}`
                                    : ''
                            } ${
                                (playground.lifecycle === JDSPlaygroundState.RUNNING ||
                                    playground.lifecycle === JDSPlaygroundState.UPLOADED) &&
                                instPointer === playground.instructionPointer
                                    ? styles.next_instruction
                                    : ''
                            }`.trim()}>
                            {instruction.command}
                        </code>
                        {Object.keys(instruction.arguments).map(name => (
                            <code
                                className={`${styles.assembly_code} ${styles.assembly_arg}`}
                                data-argname={name}>
                                {instruction.arguments[name]}
                            </code>
                        ))}
                    </HStack>
                ))}
            </VStack>
        </HStack>
    );
}
