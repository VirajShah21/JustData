import DynamicScraper from '../Scraper/DynamicScraper';
import { parseScript, validateScript } from './JDSParser';

type ExecutorFunction = (
    scraper: DynamicScraper,
    args: (string | number | boolean)[],
) => Promise<void>;

export const executors: Record<JDSCommand, ExecutorFunction> = {
    origin: async (scraper, [origin]) => scraper.setOrigin(origin as string),
    field: async (scraper, [name, value]) => scraper.updateField(name as string, value as string),
    var: async (scraper, [name, value]) => scraper.updateVar(name as string, value),
    open: async scraper => await scraper.tabAction('open'),
    close: async scraper => await scraper.tabAction('close'),
    select: async (scraper, [query, varname]) =>
        await scraper.execSelect(query as string, varname as string),
    select_list: async (scraper, [query, varname]) =>
        await scraper.execSelectList(query as string, varname as string),
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
