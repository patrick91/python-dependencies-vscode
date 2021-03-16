import { Dependency } from "../../types";
import { splitFirst } from "../strings";


const parseDependency = (line: string, lineNumber: number) => {
    const [name, version] = splitFirst(line, "==").map((x) => x.trim());

    return {
        name,
        version: {
            toml: version,
        },
        line: lineNumber,
        rawText: line,
    };
};

export const findDependenciesFromRequirementsTxt = (text: string) => {
    const lines = text.split("\n");

    const dependencies: Dependency[] = [];

    lines.forEach((line, index) => {
        line = line.replace(/ #.*$/, "").trim();

        // remove extras like tablib[html]
        line = line.replace(/\[.*\]/, "");

        if (line === "") {
            return;
        }

        if (line.startsWith("#") || line.startsWith("-") || line.startsWith("git+")) {
            return;
        } else {
            const dependency = parseDependency(line, index);

            dependencies.push(dependency);
        }
    });

    return dependencies;
};
