import { useState } from 'react';
import exampleScripts from 'src/assets/json/jdscript_examples.json';
import { JDScriptKit } from 'src/utils/JustSDK';

export interface ScriptPlayground {
    script: string;
    readonly uploaded: boolean;
    readonly running: boolean;
    upload: () => void;
    run: () => void;
}

export function useScriptPlayground(): ScriptPlayground {
    const [script, setScript] = useState(exampleScripts.WordOfTheDay.join('\n'));
    const [uploaded, setUploaded] = useState(false);
    const [running, setRunning] = useState(false);
    const [instanceId, setInstanceId] = useState<string>();

    return {
        get script() {
            return script;
        },

        set script(value: string) {
            setScript(value);
            setUploaded(false);
        },

        get uploaded() {
            return uploaded;
        },

        get running() {
            return running;
        },

        async upload() {
            const { id } = await JDScriptKit.uploadScriptToPlayground(script);
            setInstanceId(id);
            setUploaded(true);
        },

        run() {
            setRunning(true);
        },
    };
}
