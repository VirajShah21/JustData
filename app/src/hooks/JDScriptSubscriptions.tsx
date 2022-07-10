import { useState } from 'react';
import exampleScripts from 'src/assets/json/jdscript_examples.json';
import { JDScriptKit } from 'src/utils/JustSDK';

export enum JDSPlaygroundState {
    IDLE, // not subscribed yet
    MODIFIED, // uploaded, but modified on client-side
    UPLOADED, // uploaded and matches server version
    RUNNING, // playground is executing
    EXECUTING, // executing an instruction on the server
}

export interface ScriptPlayground {
    script: string;
    readonly id: string | null;
    readonly assembly: JDSAssembly;
    readonly screenshotUrl: string | null;
    readonly vars: Record<string, ValidJDSArgumentType>;
    readonly fields: Record<string, ValidJDSArgumentType>;
    readonly lifecycle: JDSPlaygroundState;
    readonly instructionPointer: number;
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
    const [lifecycleState, setLifecycleState] = useState(JDSPlaygroundState.IDLE);
    const [assemblyCode, setAssemblyCode] = useState<JDSAssembly>([]);
    const [instanceId, setInstanceId] = useState<string>();
    const [screenshotId, setScreenshotId] = useState<string>();
    const [vars, setVars] = useState<Record<string, ValidJDSArgumentType>>({});
    const [fields, setFields] = useState<Record<string, ValidJDSArgumentType>>({});
    const [instructionPointer, setInstructionPointer] = useState(0);

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
            setLifecycleState(JDSPlaygroundState.MODIFIED);
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
         * A pointer to the index of the currently executing instruction or next instruction if
         * none is running.
         */
        get instructionPointer() {
            return instructionPointer;
        },

        /**
         * Upload the specified script (`this.script`) to the server.
         */
        async upload() {
            const { id, assembly } = await JDScriptKit.uploadScriptToPlayground(script);
            if (id && assembly) {
                setInstanceId(id);
                setAssemblyCode(assembly);
                setLifecycleState(JDSPlaygroundState.UPLOADED);
            }
        },

        /**
         * Increment the instruction pointer of the script.
         */
        async step() {
            if (instanceId) {
                setLifecycleState(JDSPlaygroundState.EXECUTING);
                const { screenshot, vars, fields } = await JDScriptKit.stepScriptInPlayground(
                    instanceId,
                );

                if (screenshot) {
                    setScreenshotId(screenshot);
                }

                if (vars) {
                    setVars(vars);
                }

                if (fields) {
                    setFields(fields);
                }

                setInstructionPointer(instructionPointer + 1);
                setLifecycleState(JDSPlaygroundState.RUNNING);
            } else {
                alert('Error: Not in sync with server');
            }
        },

        /**
         * The current state of the lifecycle
         */
        get lifecycle() {
            return lifecycleState;
        },

        /**
         * Run the script on the server.
         */
        run() {
            setLifecycleState(JDSPlaygroundState.RUNNING);
        },
    };
}
