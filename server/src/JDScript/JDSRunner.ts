import DynamicScraper from '../Scraper/DynamicScraper';
import { JDSAssembly, JDSCommand, JDSParserIssue, parseScript } from './JDSParser';

type ExecutorFunction = (
    scraper: DynamicScraper,
    args: (string | number | boolean)[],
) => Promise<void>;

const executors: Record<JDSCommand, ExecutorFunction> = {
    origin: async (scraper, [origin]) => scraper.setOrigin(origin as string),
    field: async (scraper, [name, value]) => scraper.updateField(name as string, value as string),
    var: async (scraper, [name, value]) => scraper.updateVar(name as string, value),
    open: async scraper => await scraper.tabAction('open'),
    close: async scraper => await scraper.tabAction('close'),
    select: async (scraper, [query]) => await scraper.execSelect(query as string),
    select_all: async (scraper, [query]) => await scraper.execSelectAll(query as string),
    select_from: async (scraper, [selection, query]) =>
        await scraper.selectFrom(selection as string, query as string),
    select_all_from: async (scraper, [selection, query]) =>
        await scraper.selectFrom(selection as string, query as string),
    save_selection: async (scraper, [name]) => await scraper.saveSelection(name as string),
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

export function executeScript(script: string) {
    let assembly: JDSAssembly;

    try {
        assembly = parseScript(script);
    } catch (e) {
        (e as JDSParserIssue[]).forEach(issue => {
            if (issue.name === 'JDSParserWarning') {
                console.warn(issue.toString());
            } else {
                console.error(issue.toString());
            }
        });
        return;
    }

    executeAssembly(assembly);
}
