import { MarkdownString, Position, Range, ThemeColor } from "vscode";
import { Dependency } from "../types";

export const getDecoration = (dep: Dependency) => {
    const message = new MarkdownString(
        `**this is a new update lololol**`,
        true,
    );
    message.appendText("\n");
    message.appendMarkdown("$(globe)");
    message.isTrusted = true;

    const prefix = dep.version.latest === dep.version.installed ? "✅" : "⚠️";

    return {
        range: new Range(
            new Position(dep.line, Number.MAX_SAFE_INTEGER),
            new Position(dep.line, Number.MAX_SAFE_INTEGER),
        ),
        hoverMessage: message,
        renderOptions: {
            after: {
                contentText: `${prefix} latest: ${
                    dep.version.latest || "unknown"
                }, installed: ${dep.version.installed || "unknown"}`,
                margin: `4ch`,
            },
            dark: {
                after: {
                    color: "rgba(255, 255, 255, 0.3)",
                },
            },
            light: {
                after: {
                    color: "rgba(0, 0, 0, 0.3)",
                },
            },
        },
    };
};
