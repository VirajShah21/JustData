interface PlaygroundScriptUploadResponse {
    success: boolean;
    id?: string;
    issues?: Error[];
}

interface PlaygroundStepResponse {
    success: boolean;
    id: string;
    error?: Error;
    screenshot?: string;
    origin?: string;
    fields?: Record<string, string | number | boolean>;
    vars?: Record<string, string | number | boolean>;
}
