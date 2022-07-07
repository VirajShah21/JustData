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
    close: async scraper => await scraper.tabAction('close'),
    select: async (scraper, { format = 'Node', $, alias }) => {
        if (typeof $ === 'string' && typeof alias === 'string') {
            await scraper.execSelect($, alias);
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
    let scraper: DynamicScraper = new DynamicScraper('');

    for (let i = 0; i < assembly.length; i++) {
        const instruction = assembly[i];
        const command = instruction.command;
        const args = instruction.arguments;

        await executors[command](scraper, args);
    }
}

export function executeScript(script: string): JDSIssue[] | 0 {
    let issues = validateScript(script);

    if (issues.length > 0) {
        return issues;
    }

    let assembly = parseScript(script);

    executeAssembly(assembly);

    return 0;
}
