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
        /**
         * The plaintext of the JDScript file.
         */
        get script() {
            return script;
        },

        /**
         * Updates the state of the script and updates uploaded state to false.
         */
        set script(value: string) {
            setScript(value);
            setUploaded(false);
        },

        /**
         * True if the current script is uploaded to the server.
         */
        get uploaded() {
            return uploaded;
        },

        /**
         * Checks
         */
        get running() {
            return running;
        },

        /**
         * Get the ID of the current script instance from the server.
         */
        get id() {
            return instanceId ?? null;
        },

        /**
         * Retrieves the assembly code of the current script if the script has been uploaded to the
         * server.
         */
        get assembly() {
            return assemblyCode;
        },

        /**
         * Gets the URL of the current screenshot image of the web scraper.
         */
        get screenshotUrl() {
            if (instanceId && screenshotId) {
                return JDScriptKit.playgroundScreenshotUrl(instanceId, screenshotId);
            } else {
                return null;
            }
        },

        /**
         * Gets an object containing evey variable in the JDS instance.
         */
        get vars() {
            return vars;
        },

        /**
         * Gets an object containing every field in the JDS instance.
         */
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
