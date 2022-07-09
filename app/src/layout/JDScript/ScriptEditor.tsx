import { IonIcon } from '@ionic/react';
import { cloudUpload, play, trash } from 'ionicons/icons';
import { HStack, VStack } from 'reaction';
import Button from 'src/components/ui/Button';
import TextBox from 'src/components/ui/TextBox';
import { ScriptPlayground } from 'src/hooks/JDScript';
import styles from './ScriptEditor.module.css';

export interface ScriptEditorProps {
    playground: ScriptPlayground;
}

/**
 * @param props.playground - The playground subscription returned by `useScriptPlayground`
 * @returns The Script editor with the a series of buttons allowing the user to perform script
 * actions.
 */
export default function ScriptEditor({ playground }: ScriptEditorProps) {
    /**
     * @returns The button that uploads the script from the editor to the server.
     */
    function UploadButton() {
        if (!playground.uploaded) {
            return (
                <Button onClick={() => playground.upload()}>
                    <VStack>
                        <IonIcon icon={cloudUpload} size='large' color='primary' />
                        Upload
                    </VStack>
                </Button>
            );
        }

        return null;
    }

    /**
     * @returns The "Run" button that changes the playground's perspective to show the developer
     * tools, instructions UI, and screenshots.
     */
    function RunButton() {
        if (playground.uploaded) {
            return (
                <Button onClick={() => playground.run()}>
                    <VStack>
                        <IonIcon icon={play} size='large' color='success' />
                        Run
                    </VStack>
                </Button>
            );
        }

        return null;
    }

    return (
        <HStack className={styles.script_editor}>
            <TextBox
                value={playground.script}
                onChange={script => (playground.script = script)}
                className={styles.text_editor}
            />
            <VStack align='stretch'>
                <UploadButton />
                <RunButton />
                <Button onClick={() => (playground.script = '')}>
                    <VStack>
                        <IonIcon icon={trash} size='large' color='danger' />
                        Clear
                    </VStack>
                </Button>
            </VStack>
        </HStack>
    );
}
