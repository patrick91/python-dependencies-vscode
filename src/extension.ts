import {
    window,
    workspace,
    ExtensionContext,
    TextDocumentChangeEvent,
} from "vscode";
import { setCache } from "./cache";
import { pyProjectListener, requirementsTxtListener } from "./core/listener";

export function activate(context: ExtensionContext) {
    setCache(context);

    context.subscriptions.push(
        window.onDidChangeActiveTextEditor(pyProjectListener),
        window.onDidChangeActiveTextEditor(requirementsTxtListener),
    );

    context.subscriptions.push(
        workspace.onDidChangeTextDocument((e: TextDocumentChangeEvent) => {
            if (e.document.isDirty) {
                return;
            }

            const fileName = e.document.fileName.toLocaleLowerCase();

            if (fileName.endsWith("pyproject.toml")) {
                pyProjectListener(window.activeTextEditor);
            }

            if (
                fileName.endsWith("requirements.txt") ||
                fileName.endsWith("requirements.in")
            ) {
                requirementsTxtListener(window.activeTextEditor);
            }
        }),
    );

    pyProjectListener(window.activeTextEditor);
    requirementsTxtListener(window.activeTextEditor);
}

export function deactivate() {}
