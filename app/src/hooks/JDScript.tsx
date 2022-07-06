import { useState } from 'react';
import exampleScripts from 'src/assets/json/jdscript_examples.json';
import { JDScriptKit } from 'src/utils/JustSDK';

export interface ScriptPlayground {
    script: string;
    readonly uploaded: boolean;
    readonly running: boolean;
    readonly id: string | null;
    readonly assembly: JDSAssembly;
    readonly screenshotUrl: string | null;
    upload: () => void;
    step: () => void;
    run: () => void;
}

export function useScriptPlayground(): ScriptPlayground {
    const [script, setScript] = useState(exampleScripts.WordOfTheDay.join('\n'));
    const [uploaded, setUploaded] = useState(false);
    const [running, setRunning] = useState(false);
    const [assemblyCode, setAssemblyCode] = useState<JDSAssembly>([]);
    const [instanceId, setInstanceId] = useState<string>();
    const [screenshotId, setScreenshotId] = useState<string>();

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

        get id() {
            return instanceId ?? null;
        },

        get assembly() {
            return assemblyCode;
        },

        get screenshotUrl() {
            if (instanceId && screenshotId) {
                return JDScriptKit.playgroundScreenshotUrl(instanceId, screenshotId);
            } else {
                return null;
            }
        },

        async upload() {
            const { id, assembly } = await JDScriptKit.uploadScriptToPlayground(script);
            if (id && assembly) {
                setInstanceId(id);
                setAssemblyCode(assembly);
                setUploaded(true);
            }
        },

        async step() {
            if (instanceId) {
                const { screenshot } = await JDScriptKit.stepScriptInPlayground(instanceId);
                setScreenshotId(screenshot ?? undefined);
            } else {
                alert('Error: Not in sync with server');
            }
        },

        run() {
            setRunning(true);
        },
    };
}
