import { TextEditor, window, TextEditorDecorationType } from "vscode";
import { Dependency } from "../types";
import { findDependencies } from "../utils/parsing";
import { getInstalledVersions } from "./poetry";
import { getVersion } from "./api";
import { getDecoration } from "./decorations";
import { dirname } from "path";

let decorationType: TextEditorDecorationType | null = null;

const updateVersions = (
    deps: Dependency[],
    installedVersions: { [k: string]: string },
) => {
    return Promise.all(
        deps.map(async (dep) => {
            const version = await getVersion(dep.name);

            dep.version.installed = installedVersions[dep.name];
            dep.version.latest = version;
        }),
    );
};

const doThings = async (deps: Dependency[], editor: TextEditor) => {
    if (decorationType) {
        decorationType.dispose();
    }

    const installedVersions = await getInstalledVersions(
        dirname(editor.document.fileName),
    );

    await updateVersions(deps, installedVersions);

    const decorations = deps.map(getDecoration);

    decorationType = window.createTextEditorDecorationType({
        after: {},
    });

    editor.setDecorations(decorationType!, decorations);
};

function parseAndDecorate(editor: TextEditor) {
    const text = editor.document.getText();
    // const config = workspace.getConfiguration("", editor.document.uri);

    const deps = findDependencies(text);

    console.log("parsing and decorating");

    doThings(deps, editor);
}

export const pyProjectListener = (editor: TextEditor | undefined) => {
    if (editor) {
        const { fileName } = editor.document;
        if (fileName.toLocaleLowerCase().endsWith("pyproject.toml")) {
            parseAndDecorate(editor);
        }
    } else {
        console.log("No active editor found.");
    }
};
