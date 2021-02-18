export type Dependency = {
    name: string;
    version: {
        toml: string;
        installed?: string;
        latest?: string;
    };
    line: number;
    rawText: string;
};
