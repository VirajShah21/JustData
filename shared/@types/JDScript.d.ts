interface JDSIssue {
    readonly name: 'JDSWarning' | 'JDSError';
    readonly message: string;
    readonly line: number;
    readonly column: number;
    readonly error?: JDSCompilerError;
    readonly warning?: JDSCompilerWarning;
}

interface JDSWarning extends JDSIssue {
    readonly name: 'JDSWarning';
    readonly warning: JDSCompilerWarning;
}

interface JDSError extends JDSIssue {
    readonly name: 'JDSError';
    readonly error: JDSCompilerError;
}

interface PlaygroundScriptUploadResponse {
    success: boolean;
    id: string | null;
    issues: unknown[];
    assembly: JDSAssembly | null;
}

interface PlaygroundStepResponse {
    success: boolean;
    id: string;
    error?: Error;
    screenshot?: string | null;
    origin?: string | null;
    fields?: Record<string, ValidJDSArgumentType> | null;
    vars?: Record<string, ValidJDSArgumentType> | null;
}

type JDSCompilerWarning = 'WhitespaceWarning';

type JDSCompilerError = 'MissingColonError' | 'UnknownCommandError' | 'ArgumentError';

type JDSCommand = 'field' | 'var' | 'open' | 'close' | 'select' | 'attr';

type JDSAssembly = JDSInstruction[];

type JDSPrimitiveType = string | number | boolean;

type ValidJDSArgumentType = JDSPrimitiveType | JDSPrimitiveType[];

interface JDSInstruction {
    command: JDSCommand;
    arguments: Record<string, ValidJDSArgumentType>;
}
