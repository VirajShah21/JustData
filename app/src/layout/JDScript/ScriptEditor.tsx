import { IonIcon } from '@ionic/react';
import { cloudUpload, play, trash } from 'ionicons/icons';
import { HStack, VStack } from 'reaction';
import Button from 'src/components/ui/Button';
import TextBox from 'src/components/ui/TextBox';
import { ScriptPlayground } from 'src/hooks/JDScript';
import './ScriptEditor.css';

export interface ScriptEditorProps {
    playground: ScriptPlayground;
}

export default function ScriptEditor({ playground }: ScriptEditorProps) {
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
        <HStack className='script-editor'>
            <TextBox
                value={playground.script}
                onChange={script => (playground.script = script)}
                className='text-editor'
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
