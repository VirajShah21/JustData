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
    readonly vars: Record<string, ValidJDSArgumentType>;
    readonly fields: Record<string, ValidJDSArgumentType>;
    upload: () => void;
    step: () => void;
    run: () => void;
}

/**
 * Subscribes a script to a JDS playground runtime on the server.
 *
 * @returns An object that contains relevant state variables and methods to perform actions on
 * the server-side instance of the script playground.
 */
export function useScriptPlayground(): ScriptPlayground {
    const [script, setScript] = useState(exampleScripts.WordOfTheDay.join('\n'));
    const [uploaded, setUploaded] = useState(false);
    const [running, setRunning] = useState(false);
    const [assemblyCode, setAssemblyCode] = useState<JDSAssembly>([]);
    const [instanceId, setInstanceId] = useState<string>();
    const [screenshotId, setScreenshotId] = useState<string>();
    const [vars, setVars] = useState<Record<string, ValidJDSArgumentType>>({});
    const [fields, setFields] = useState<Record<string, ValidJDSArgumentType>>({});

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

        get vars() {
            return vars;
        },

        get fields() {
            return fields;
        },

        /**
         * Upload the specified script (`this.script`) to the server.
         */
        async upload() {
            const { id, assembly } = await JDScriptKit.uploadScriptToPlayground(script);
            if (id && assembly) {
                setInstanceId(id);
                setAssemblyCode(assembly);
                setUploaded(true);
            }
        },

        /**
         * Increment the instruction pointer of the script.
         */
        async step() {
            if (instanceId) {
                const { screenshot, vars, fields } = await JDScriptKit.stepScriptInPlayground(
                    instanceId,
                );
                setScreenshotId(screenshot ?? undefined);
                if (vars) {
                    setVars(vars);
                }

                if (fields) {
                    setFields(fields);
                }
            } else {
                alert('Error: Not in sync with server');
            }
        },

        /**
         * Run the script on the server.
         */
        run() {
            setRunning(true);
        },
    };
}
