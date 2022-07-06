import path from 'path';
import fs from 'fs';

export type JDSParseWarning = 'PaddedLineWarning';
export type JDSParseError = 'MissingColonError' | 'UnknownCommandError' | 'ArgumentError';
export type JDSCommand =
    | 'origin'
    | 'field'
    | 'var'
    | 'open'
    | 'close'
    | 'select'
    | 'select_all'
    | 'select_from'
    | 'select_all_from'
    | 'save_selection';
export type JDSAssembly = JDSInstruction[];

export interface JDSInstruction {
    command: JDSCommand;
    arguments: (string | number | boolean)[];
}

export interface JDSCommandDefinition {
    command: JDSCommand;
    minArgs: number;
    maxArgs: number;
    argTypes: ('string' | 'number' | 'boolean')[];
}

const commandDefinitions: JDSCommandDefinition[] = [
    {
        command: 'origin',
        minArgs: 1,
        maxArgs: 1,
        argTypes: ['string'],
    },
    {
        command: 'field',
        minArgs: 2,
        maxArgs: 2,
        argTypes: ['string', 'string'],
    },
    {
        command: 'var',
        minArgs: 2,
        maxArgs: 2,
        argTypes: ['string', 'string'],
    },
    {
        command: 'open',
        minArgs: 0,
        maxArgs: 0,
        argTypes: [],
    },
    {
        command: 'close',
        minArgs: 0,
        maxArgs: 0,
        argTypes: [],
    },
    {
        command: 'select',
        minArgs: 1,
        maxArgs: 1,
        argTypes: ['string'],
    },
    {
        command: 'select_all',
        minArgs: 1,
        maxArgs: 1,
        argTypes: ['string'],
    },
    {
        command: 'select_from',
        minArgs: 2,
        maxArgs: 2,
        argTypes: ['string', 'string'],
    },
    {
        command: 'select_all_from',
        minArgs: 2,
        maxArgs: 2,
        argTypes: ['string', 'string'],
    },
    {
        command: 'save_selection',
        minArgs: 1,
        maxArgs: 1,
        argTypes: ['string'],
    },
];

export abstract class JDSParserIssue {
    readonly name: string;
    readonly message: string;
    readonly line: number;
    readonly column: number;

    constructor(name: string, message: string, line: number, column: number) {
        this.message = message;
        this.name = name;
        this.line = line;
        this.column = column;
    }
}

export class JDSParserWarning extends JDSParserIssue {
    readonly warning: JDSParseWarning;

    constructor(warning: JDSParseWarning, message: string, line: number, column: number) {
        super('JDSParserWarning', message, line, column);
        this.warning = warning;
    }
}

export class JDSParserError extends JDSParserIssue {
    readonly error: JDSParseError;

    constructor(error: JDSParseError, message: string, line: number, column: number) {
        super('JDSParserError', message, line, column);
        this.error = error;
    }
}

export function parseCommand(line: string): string {
    const endCommand = line.indexOf(': ');

    if (endCommand >= 0) {
        return line.substring(0, endCommand);
    }

    return line;
}

export function parseArgs(line: string): (string | number | boolean)[] {
    const argsStart = line.indexOf(': ') + 1;
    const argsString = line.substring(argsStart);

    let currString = '';
    let inString = false;
    let inArg = false;
    let quotation = '';

    let args = [];

    for (let i = 0; i < argsString.length; i++) {
        const char = argsString[i];
        if (!inArg) {
            if ((!inString && char === '"') || char === "'") {
                quotation = char;
                inString = true;
                inArg = true;
            } else if (char !== ' ') {
                currString = char;
                inArg = true;
            }
        } else {
            if (inString && char === quotation) {
                quotation = '';
                inArg = false;
                inString = false;
                args.push(currString);
                currString = '';
            } else if (inString) {
                currString += char;
            } else if (char === ' ') {
                inArg = false;
            } else {
                currString += char;
            }
        }
    }

    if (currString.length > 0) {
        args.push(currString);
    }

    return args.map(arg => {
        if (arg === 'true' || arg === 'false') {
            return arg === 'true';
        }

        const asNum = +arg;
        if (!isNaN(asNum)) {
            return asNum;
        }

        return arg;
    });
}

export function validateLine(line: string, lineNumber = 0): (JDSParserError | JDSParserWarning)[] {
    const issues = [];

    const indexOfFirstSpace = line.indexOf(' ');
    const indexOfFirstColon = line.indexOf(':');

    const command = parseCommand(line);
    const commandDefinition = commandDefinitions.find(def => def.command === command);
    const args = parseArgs(line);

    // Check if the line begins with a space
    if (line[0] === ' ') {
        issues.push(
            new JDSParserWarning(
                'PaddedLineWarning',
                'Line should not start with space',
                lineNumber,
                1,
            ),
        );
    }

    // Check if the line ends with a space
    if (line[line.length - 1] === ' ') {
        issues.push(
            new JDSParserWarning(
                'PaddedLineWarning',
                'Line should not end with space',
                lineNumber,
                line.length,
            ),
        );
    }

    // Checks if the command ends with a colon
    if (indexOfFirstSpace > 0 && indexOfFirstColon !== indexOfFirstSpace - 1) {
        issues.push(
            new JDSParserError(
                'MissingColonError',
                'Missing colon directly after command and before arguments list',
                lineNumber,
                indexOfFirstSpace + 1,
            ),
        );
    }

    // Check if the command exists
    if (!commandDefinition) {
        issues.push(
            new JDSParserError(
                'UnknownCommandError',
                `Command doesn't exist: ${command}`,
                lineNumber,
                1,
            ),
        );
    }

    // Check if the arguments list
    if (commandDefinition) {
        // Check if the minimum number of arguments is met
        if (args.length < commandDefinition.minArgs) {
            issues.push(
                new JDSParserError(
                    'ArgumentError',
                    `Expected at least ${commandDefinition.minArgs} arguments but found only ${args.length} arguments.`,
                    lineNumber,
                    line.length,
                ),
            );
        }

        // Check if the arguments list excedes the maxiumum allowed
        if (args.length > commandDefinition.maxArgs) {
            issues.push(
                new JDSParserError(
                    'ArgumentError',
                    `Expected at most ${commandDefinition.maxArgs} arguments but found ${args.length} arguments`,
                    lineNumber,
                    indexOfFirstColon + 1,
                ),
            );
        }

        // Ensure the arguments are of the correct type
        args.forEach((arg, i) => {
            const expected = commandDefinition.argTypes[i];
            const actual = typeof arg;

            if (expected !== actual) {
                issues.push(
                    new JDSParserError(
                        'ArgumentError',
                        `Expected argument #${
                            i + 1
                        } for ${command} to be of type ${expected} but found ${actual} instead.`,
                        lineNumber,
                        line.indexOf(new String(arg) as string) + 1,
                    ),
                );
            }
        });
    }

    return issues;
}

export function validateScript(script: string): (JDSParserError | JDSParserWarning)[] {
    const issues = [];

    const lines = script.split('\n').filter(line => line.trim().length > 0);

    for (let i = 0; i < lines.length; i++) {
        issues.push(...validateLine(lines[i], i + 1));
    }

    return issues;
}

export function parseLine(line: string, lineNumber = 0): JDSInstruction {
    return {
        command: parseCommand(line) as JDSCommand,
        arguments: parseArgs(line),
    };
}

export function parseScript(script: string): JDSAssembly {
    return script
        .split('\n')
        .filter(line => line.trim().length > 0)
        .map((line, i) => parseLine(line, i + 1));
}
