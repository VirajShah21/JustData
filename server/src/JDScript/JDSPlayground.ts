import DynamicScraper from '../Scraper/DynamicScraper';
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
    return instance;
}

export async function stepPlaygroundScript(id: string): Promise<PlaygroundInstance> {
    const instance = playgroundInstances[id];

    await executors[instance.assembly[instance.instruction].command](
        instance.scraper,
        instance.assembly[instance.instruction].arguments,
    );

    instance.instruction++;

    return instance;
}

let nextId = 9999;

function instanceId(): string {
    nextId++;
    return `${nextId}`;
}
