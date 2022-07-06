import path from 'path';
import fs from 'fs';

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

export function validateLine(line: string, lineNumber = 0): JDSIssue[] {
    const issues: JDSIssue[] = [];

    const indexOfFirstSpace = line.indexOf(' ');
    const indexOfFirstColon = line.indexOf(':');

    const command = parseCommand(line);
    const commandDefinition = commandDefinitions.find(def => def.command === command);
    const args = parseArgs(line);

    // Check if the line begins with a space
    if (line[0] === ' ') {
        issues.push({
            name: 'JDSWarning',
            warning: 'WhitespaceWarning',
            message: 'Line should not start with space',
            line: lineNumber,
            column: 1,
        });
    }

    // Check if the line ends with a space
    if (line[line.length - 1] === ' ') {
        issues.push({
            name: 'JDSWarning',
            warning: 'WhitespaceWarning',
            message: 'Line should not end with space',
            line: lineNumber,
            column: line.length,
        });
    }

    // Checks if the command ends with a colon
    if (indexOfFirstSpace > 0 && indexOfFirstColon !== indexOfFirstSpace - 1) {
        issues.push({
            name: 'JDSError',
            error: 'MissingColonError',
            message: 'Missing colon directly after command and before arguments list',
            line: lineNumber,
            column: indexOfFirstSpace + 1,
        });
    }

    // Check if the command exists
    if (!commandDefinition) {
        issues.push({
            name: 'JDSError',
            error: 'UnknownCommandError',
            message: `Command doesn't exist: ${command}`,
            line: lineNumber,
            column: 1,
        });
    }

    // Check if the arguments list
    if (commandDefinition) {
        // Check if the minimum number of arguments is met
        if (args.length < commandDefinition.minArgs) {
            issues.push({
                name: 'JDSError',
                error: 'ArgumentError',
                message: `Expected at least ${commandDefinition.minArgs} arguments but found only ${args.length} arguments.`,
                line: lineNumber,
                column: line.length,
            });
        }

        // Check if the arguments list excedes the maxiumum allowed
        if (args.length > commandDefinition.maxArgs) {
            issues.push({
                name: 'JDSError',
                error: 'ArgumentError',
                message: `Expected at most ${commandDefinition.maxArgs} arguments but found ${args.length} arguments`,
                line: lineNumber,
                column: indexOfFirstColon + 1,
            });
        }

        // Ensure the arguments are of the correct type
        args.forEach((arg, i) => {
            const expected = commandDefinition.argTypes[i];
            const actual = typeof arg;

            if (expected !== actual) {
                issues.push({
                    name: 'JDSError',
                    error: 'ArgumentError',
                    message: `Expected argument #${
                        i + 1
                    } for ${command} to be of type ${expected} but found ${actual} instead.`,
                    line: lineNumber,
                    column: line.indexOf(new String(arg) as string) + 1,
                });
            }
        });
    }

    return issues;
}

export function validateScript(script: string): JDSIssue[] {
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
