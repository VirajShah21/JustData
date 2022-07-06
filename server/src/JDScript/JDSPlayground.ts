import DynamicScraper from '../Scraper/DynamicScraper';
import Logger from '../utils/Logger';
import { JDSAssembly, parseScript } from './JDSParser';
import { executors } from './JDSRunner';

export interface PlaygroundInstance {
    id: string;
    script: string;
    assembly: JDSAssembly;
    scraper: DynamicScraper;
    instruction: number;
}

export const playgroundInstances: Record<string, PlaygroundInstance> = {};

export function newInstance(script: string): PlaygroundInstance {
    const id = instanceId();
    const instance = {
        id,
        script: script,
        assembly: parseScript(script),
        scraper: new DynamicScraper(''),
        instruction: 0,
    };
    playgroundInstances[id] = instance;
    Logger.debug(`Created new playground. Instance ID: ${id}`);
    return instance;
}

export async function stepPlaygroundScript(id: string): Promise<PlaygroundInstance> {
    Logger.debug(`Executing next instruction in playground instance #${id}`);

    const instance = playgroundInstances[id];

    await executors[instance.assembly[instance.instruction].command](
        instance.scraper,
        instance.assembly[instance.instruction].arguments,
    );

    Logger.debug(`Executed instruction (id=${id}). Instruction: ${instance.instruction}`);

    instance.instruction++;

    return instance;
}

let nextId = 9999;

function instanceId(): string {
    nextId++;
    return `${nextId}`;
}
