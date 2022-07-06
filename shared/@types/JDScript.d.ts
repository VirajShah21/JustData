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
    fields?: Record<string, string | number | boolean> | null;
    vars?: Record<string, string | number | boolean> | null;
}

type JDSParseWarning = 'PaddedLineWarning';
type JDSParseError = 'MissingColonError' | 'UnknownCommandError' | 'ArgumentError';
type JDSCommand =
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
type JDSAssembly = JDSInstruction[];

interface JDSInstruction {
    command: JDSCommand;
    arguments: (string | number | boolean)[];
}

interface JDSCommandDefinition {
    command: JDSCommand;
    minArgs: number;
    maxArgs: number;
    argTypes: ('string' | 'number' | 'boolean')[];
}
