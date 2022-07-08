const VALID_COMMANDS: JDSCommand[] = ['field', 'var', 'open', 'close', 'select', 'attr'];

export function parseCommand(line: string): string {
    const space = line.indexOf(' ');
    if (space > 0) {
        return line.substring(0, space);
    }
    return line;
}

export function parseArgs(line: string): Record<string, ValidJDSArgumentType> {
    function setArg(key: string, value: JDSPrimitiveType) {
        if (args[key] !== undefined) {
            if (Array.isArray(args[key])) {
                (args[key] as unknown[]).push(value);
            } else {
                args[key] = [args[key] as JDSPrimitiveType, value];
            }
        } else {
            args[key] = value;
        }
    }

    const command = parseCommand(line);

    if (command === line) {
        return {};
    }

    const args: Record<string, ValidJDSArgumentType> = {};

    let inArgKey = false;
    let inArgValue = false;
    let inString = false;
    let singleQuotes = false;
    let captured = '';
    let currArgKey = '';

    for (let i = command.length + 1; i < line.length; i++) {
        if (!inArgKey && !inArgValue) {
            if (line[i] !== ' ') {
                inArgKey = true;
                captured += line[i];
            }
        } else if (inArgKey) {
            if (line[i] === ' ') {
                if (captured[0] === '!') {
                    setArg(captured.substring(1), false);
                } else {
                    setArg(captured, true);
                }
                inArgKey = false;
                captured = '';
            } else if (line[i] === '=') {
                currArgKey = captured;
                inArgKey = false;
                inArgValue = true;
                captured = '';
            } else {
                captured += line[i];
            }
        } else if (inArgValue) {
            if (!inString && captured === '' && (line[i] === '"' || line[i] === "'")) {
                inString = true;
                singleQuotes = line[i] === "'";
            } else if (inString && line[i] === (singleQuotes ? "'" : '"')) {
                setArg(currArgKey, captured);
                inString = false;
                captured = '';
            } else if (!inString && line[i] === ' ') {
                if (captured === 'true' || captured === 'false') {
                    setArg(currArgKey, captured === 'true');
                } else if (!isNaN(+captured)) {
                    setArg(currArgKey, +captured);
                } else {
                    setArg(currArgKey, captured);
                }
                captured = '';
                inArgValue = false;
            } else {
                captured += line[i];
            }
        } else {
            // TODO: Add parser details
            throw new Error('Parsing error');
        }
    }

    if (inArgValue) {
        setArg(currArgKey, captured);
    }

    if (inArgKey) {
        if (captured[0] === '!') {
            setArg(captured.substring(1), false);
        } else {
            setArg(captured, true);
        }
    }

    return args;
}

export function validateLine(line: string, lineNumber = 0): JDSIssue[] {
    const issues: JDSIssue[] = [];

    const command = parseCommand(line);

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

    // Check if the command exists
    // Safe type-conversion to check if `string` is actually a `JDSCommand`
    if (!VALID_COMMANDS.includes(command as JDSCommand)) {
        issues.push({
            name: 'JDSError',
            error: 'UnknownCommandError',
            message: `Command doesn't exist: ${command}`,
            line: lineNumber,
            column: 1,
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

export function parseLine(line: string): JDSInstruction {
    return {
        command: parseCommand(line) as JDSCommand,
        arguments: parseArgs(line),
    };
}

export function parseScript(script: string): JDSAssembly {
    return script
        .split('\n')
        .filter(line => line.trim().length > 0)
        .map(line => parseLine(line));
}
