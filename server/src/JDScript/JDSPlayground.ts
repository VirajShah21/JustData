import DynamicScraper from '../Scraper/DynamicScraper';
import Logger from '../utils/Logger';
import { parseScript } from './JDSParser';
import { executors } from './JDSRunner';

export interface PlaygroundInstance {
    id: string;
    script: string;
    assembly: JDSAssembly;
    scraper: DynamicScraper;
    instruction: number;
}

// Using a map object because we access values using user-controlled input
// that opens the door to vulnerabilities.
export const playgroundInstances: Map<string, PlaygroundInstance> = new Map();

/**
 * Creates a new instance of a JDScript playground. This will be automatically added to the
 * `playgroundInstances` map.
 *
 * @param script - The script file (a string of JDScript code).
 * @returns A `PlaygroundInstance` object that can be used to interact with the script while
 * it is running.
 */
export function newInstance(script: string): PlaygroundInstance {
    const id = instanceId();
    const instance = {
        id,
        script,
        assembly: parseScript(script),
        scraper: new DynamicScraper(),
        instruction: 0,
    };
    playgroundInstances.set(id, instance);
    Logger.debug(`Created new playground. Instance ID: ${id}`);
    return instance;
}

/**
 * Performs a step of the JDScript script. This will execute the next instruction then pause
 * execution.
 *
 * @param id - The ID of the playground instance to get.
 * @returns A promise that resolves to the instance with the given ID.
 */
export async function stepPlaygroundScript(id: string): Promise<PlaygroundInstance> {
    Logger.debug(`Executing next instruction in playground instance #${id}`);

    const instance = playgroundInstances.get(id);

    if (instance) {
        await executors[instance.assembly[instance.instruction].command](
            instance.scraper,
            instance.assembly[instance.instruction].arguments,
        );

        Logger.debug(`Executed instruction (id=${id}). Instruction: ${instance.instruction}`);

        instance.instruction++;

        return instance;
    }

    throw new Error(`No instance found with given id ${id}`);
}

let nextId = 9999;

/**
 * Generates a new and unique ID for the playground instance.
 *
 * @returns A unique ID for a playground instance.
 */
function instanceId(): string {
    nextId++;
    return `${nextId}`;
}
