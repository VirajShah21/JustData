const VALID_COMMANDS: JDSCommand[] = ['field', 'var', 'open', 'close', 'select', 'attr'];

/**
 * Extracts a command name from a line of JDScript code.
 *
 * For example, `command arg1=hello arg2=world` would return `command`.
 *
 * @param line - The line to parse.
 * @returns The parsed command.
 */
export function parseCommand(line: string): string {
    const space = line.indexOf(' ');
    if (space > 0) {
        return line.substring(0, space);
    }
    return line;
}

/**
 * Extracts an argument from a line of JDScript code.
 *
 * The argparser recognizes strings using the following syntax:
 *
 * ```
 * str1=no_spaces str2="with spaces" str3='with spaces'
 * ```
 *
 * The argparser recognizes numbers using the following syntax:
 *
 * ```
 * int=21 decimal=21.21
 * ```
 *
 * The argparser recognizes booleans using the following syntax:
 *
 * ```
 * trueBool !falseBool bool1=true bool2=false
 * ```
 *
 * The argparser recognizes arrays using the following syntax:
 *
 * ```
 * arr=1 arr=2 arr !arr arr=true arr=hello arr=world arr="wow! this is amazing"
 * ```
 *
 * Which will produce the following array:
 *
 * ```
 * arr = [1, 2, true, false, true, 'hello', 'world', 'wow! this is amazing']
 * ```
 *
 * @param line - The line to parse.
 * @returns An object mapping each argument name to its value.
 */
export function parseArgs(line: string): Record<string, ValidJDSArgumentType> {
    /**
     * Assigns a value to a key. If the key already has a value assigned to it then
     * the value is converted to an array and the new value is appended to it.
     * If the value is already an array, then the new value is appended to it.
     *
     * @param key - The parameter key (the variable name).
     * @param value - The value to assign to the variable.
     */
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

    /**
     * Handles encountering a character that is part of an argument key.
     *
     * @param char - The character to handle.
     */
    function handleArgumentKeyChar(char: string) {
        if (char === ' ') {
            if (captured[0] === '!') {
                setArg(captured.substring(1), false);
            } else {
                setArg(captured, true);
            }
            inArgKey = false;
            captured = '';
        } else if (char === '=') {
            currArgKey = captured;
            inArgKey = false;
            inArgValue = true;
            captured = '';
        } else {
            captured += char;
        }
    }

    /**
     * Handles encountering a character that is part of an argument value.
     *
     * @param char - The character to handle.
     */
    function handleArgumentValueChar(char: string) {
        if (!inString && captured === '' && (char === '"' || char === "'")) {
            inString = true;
            singleQuotes = char === "'";
        } else if (inString && char === (singleQuotes ? "'" : '"')) {
            setArg(currArgKey, captured);
            inString = false;
            captured = '';
        } else if (!inString && char === ' ') {
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
            captured += char;
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
            handleArgumentKeyChar(line[i]);
        } else if (inArgValue) {
            handleArgumentValueChar(line[i]);
        } else {
            // TODO: Add parser details
            throw new Error('Parsing error');
        }
    }

    if (inArgValue) {
        setArg(currArgKey, captured);
    } else if (inArgKey && captured[0] === '!') {
        setArg(captured.substring(1), false);
    } else if (inArgKey) {
        setArg(captured, true);
    }

    return args;
}

/**
 * Validates a line of JDScript code.
 *
 * @param line - The line to validate.
 * @param lineNumber - The line number of the line.
 * @returns An array of errors and warnings for the line.
 */
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

/**
 * Validates an entire JDScript file.
 *
 * @param script - The script to validate.
 * @returns An array of errors and warnings for the script.
 */
export function validateScript(script: string): JDSIssue[] {
    const issues = [];

    const lines = script.split('\n').filter(line => line.trim().length > 0);

    for (let i = 0; i < lines.length; i++) {
        issues.push(...validateLine(lines[i], i + 1));
    }

    return issues;
}

/**
 * Parses a line of JDScript code to a `JDSCommand` object.
 *
 * @param line - The line to parse.
 * @returns A JDSInstruction object.
 */
export function parseLine(line: string): JDSInstruction {
    return {
        command: parseCommand(line) as JDSCommand,
        arguments: parseArgs(line),
    };
}

/**
 * Parses a JDScript file to an array of `JDSInstruction` objects.
 *
 * @param script - The script to parse.
 * @returns A `JDSAssembly` object containing every instruction for the runtime to evaluate.
 * The `JDSAssembly` object is the equivalent to an array of `JDSInstruction` objects.
 */
export function parseScript(script: string): JDSAssembly {
    return script
        .split('\n')
        .filter(line => line.trim().length > 0)
        .map(line => parseLine(line));
}
