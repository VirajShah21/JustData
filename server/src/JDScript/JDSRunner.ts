import DynamicScraper from '../Scraper/DynamicScraper';
import { parseScript, validateScript } from './JDSParser';

type ExecutorFunction = (
    scraper: DynamicScraper,
    args: Record<string, ValidJDSArgumentType>,
) => Promise<void>;

export const executors: Record<JDSCommand, ExecutorFunction> = {
    field: async (scraper, args) =>
        Object.keys(args).forEach(key => scraper.updateField(key, args[key])),
    var: async (scraper, args) =>
        Object.keys(args).forEach(key => scraper.updateVar(key, args[key])),
    open: async (scraper, { origin }) => {
        if (origin && typeof origin === 'string') {
            await scraper.tabAction(origin);
        }
    },
    close: async scraper => scraper.tabAction('close'),
    select: async (scraper, { query, key }) => {
        if (typeof query === 'string' && typeof key === 'string') {
            await scraper.execSelect(query, key);
        }
    },
    attr: async (scraper, { query, prop, key }) => {
        if (typeof query === 'string' && typeof prop === 'string' && typeof key === 'string') {
            scraper.vars[key] = (await scraper.getAttributes(query, prop))[0];
        }
    },
};

export class JDSRuntimeError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'JDSRuntimeError';
    }
}

export async function executeAssembly(assembly: JDSAssembly) {
    const scraper: DynamicScraper = new DynamicScraper('');

    for (const instruction of assembly) {
        const command = instruction.command;
        const args = instruction.arguments;

        await executors[command](scraper, args);
    }
}

export function executeScript(script: string): JDSIssue[] | 0 {
    const issues = validateScript(script);

    if (issues.length > 0) {
        return issues;
    }

    const assembly = parseScript(script);

    executeAssembly(assembly);

    return 0;
}
