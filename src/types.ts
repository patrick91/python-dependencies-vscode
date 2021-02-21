export type Dependency = {
    name: string;
    version: {
        toml: string;
        installed?: string;
        latest?: string;
    };
    summary?: string;
    line: number;
    rawText: string;
};
