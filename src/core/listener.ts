import { TextEditor, window, TextEditorDecorationType } from "vscode";
import { Dependency } from "../types";
import { findDependencies } from "../utils/parsing/toml";
import { getInstalledVersions } from "./poetry";
import { getInfo } from "./api";
import { getDecoration } from "./decorations";
import { dirname } from "path";
import { findDependenciesFromRequirementsTxt } from "../utils/parsing/requirements-txt";

let decorationType: TextEditorDecorationType | null = null;

const updateVersions = (
    deps: Dependency[],
    installedVersions: { [k: string]: string },
) => {
    return Promise.all(
        deps.map(async (dep) => {
            const info = await getInfo(dep.name);

            // dep.version.installed = installedVersions[dep.name];
            dep.version.latest = info.version;
            dep.summary = info.summary;
        }),
    );
};

const decorateEditor = async (deps: Dependency[], editor: TextEditor) => {
    if (decorationType) {
        decorationType.dispose();
    }

    const installedVersions = {} 
    // await getInstalledVersions(
    //     dirname(editor.document.fileName),
    // );

    await updateVersions(deps, installedVersions);

    const decorations = deps.map(getDecoration);

    decorationType = window.createTextEditorDecorationType({
        after: {},
    });

    editor.setDecorations(decorationType!, decorations);
};

function parseAndDecorateToml(editor: TextEditor) {
    const text = editor.document.getText();

    const deps = findDependencies(text);

    decorateEditor(deps, editor);
}

function parseAndDecorateRequirementsTxt(editor: TextEditor) {
    const text = editor.document.getText();

    const deps = findDependenciesFromRequirementsTxt(text);

    decorateEditor(deps, editor);
}

export const pyProjectListener = (editor: TextEditor | undefined) => {
    if (editor) {
        const { fileName } = editor.document;
        if (fileName.toLocaleLowerCase().endsWith("pyproject.toml")) {
            parseAndDecorateToml(editor);
        }
    }
};

export const requirementsTxtListener = (editor: TextEditor | undefined) => {
    if (editor) {
        const fileName = editor.document.fileName.toLocaleLowerCase();

        if (
            fileName.endsWith("requirements.txt") ||
            fileName.endsWith("requirements.in")
        ) {
            parseAndDecorateRequirementsTxt(editor);
        }
    }
};
