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

/**
 * A runtime error encountered during execution of JDScript code.
 */
export class JDSRuntimeError extends Error {
    /**
     * Constructs an instance of a JDSRuntimeError
     *
     * @param message - The error message.
     */
    constructor(message: string) {
        super(message);
        this.name = 'JDSRuntimeError';
    }
}

/**
 * Executes compiled JDScript code.
 *
 * @param assembly - The JDScript assembly object to execute.
 */
export async function executeAssembly(assembly: JDSAssembly) {
    const scraper: DynamicScraper = new DynamicScraper();

    for (const instruction of assembly) {
        const command = instruction.command;
        const args = instruction.arguments;

        await executors[command](scraper, args);
    }
}

/**
 * Executes a JDScript.
 *
 * @param script - The JDScript script to run.
 * @returns If the script has compiled successfully, the script is executed and returns 0. If the
 * script cannot be compiled, then an array of errors/warnings will be returned instead.
 */
export function executeScript(script: string): JDSIssue[] | 0 {
    const issues = validateScript(script);

    if (issues.length > 0) {
        return issues;
    }

    const assembly = parseScript(script);

    executeAssembly(assembly);

    return 0;
}
