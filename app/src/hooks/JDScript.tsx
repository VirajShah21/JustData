import { useState } from 'react';
import exampleScripts from 'src/assets/json/jdscript_examples.json';

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

        upload() {
            setUploaded(true);
        },

        run() {
            setUploaded(true);
            setRunning(true);
        },
    };
}
