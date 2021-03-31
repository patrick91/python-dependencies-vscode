import { normalize } from "../../core/normalize";
import { Dependency } from "../../types";
import { splitFirst } from "../strings";

const parseInfo = (str: string) => {
    // TODO: this is a naive way of parsing this string, but for now it works, probably
    const pieces = str.replace(/^\{/, "").replace(/\}$/, "").split(", ");

    const info = { version: "unknown" };

    for (const piece of pieces) {
        const [key, value] = splitFirst(piece).map((x) => x.trim());

        if (key === "version") {
            info.version = JSON.parse(value);
        }
    }

    return info;
};

const parseDependency = (line: string, lineNumber: number) => {
    const [name, info] = splitFirst(line).map((x) => x.trim());

    const version = info.includes("{")
        ? parseInfo(info).version
        : JSON.parse(info);

    return {
        name: normalize(name),
        version: {
            toml: version,
        },
        line: lineNumber,
        rawText: line,
    };
};

export const findDependencies = (text: string) => {
    const lines = text.split("\n");

    let lastSection: string = "";

    const dependencies: Dependency[] = [];

    lines.forEach((line, index) => {
        if (line.trim() === "") {
            return;
        }

        if (line.startsWith("[")) {
            lastSection = line.replace(/^\[/, "").replace(/\]$/, "");
        } else {
            if (
                [
                    "tool.poetry.dependencies",
                    "tool.poetry.dev-dependencies",
                ].includes(lastSection)
            ) {
                const dep = parseDependency(line, index);

                if (dep.name === "python") {
                    return;
                }

                dependencies.push(dep);
            }
        }
    });

    return dependencies;
};
