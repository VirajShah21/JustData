import { JDSAssembly, JDSParserIssue, parseScript } from './JDSParser';

export function executeAssembly(assembly: JDSAssembly) {}

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
