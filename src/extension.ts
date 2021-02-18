import {
    window,
    workspace,
    ExtensionContext,
    TextDocumentChangeEvent,
} from "vscode";
import { setCache } from "./cache";
import { pyProjectListener } from "./core/listener";

export function activate(context: ExtensionContext) {
    setCache(context);

    context.subscriptions.push(
        window.onDidChangeActiveTextEditor(pyProjectListener),
    );

    context.subscriptions.push(
        workspace.onDidChangeTextDocument((e: TextDocumentChangeEvent) => {
            const { fileName } = e.document;
            if (
                !e.document.isDirty &&
                fileName.toLocaleLowerCase().endsWith("pyproject.toml")
            ) {
                pyProjectListener(window.activeTextEditor);
            }
        }),
    );

    pyProjectListener(window.activeTextEditor);
}

export function deactivate() {}
