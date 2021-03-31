import * as execa from "execa";
import { workspace } from "vscode";
import { normalize } from "./normalize";

export const getInstalledVersions = async (path: string) => {
    let command = "pip list";

    const { pythonPath } = workspace.getConfiguration("python");

    if (pythonPath) {
        command = path + "/" + pythonPath.replace(/python$/, "") + command;
    }

    const { stdout } = await execa.command(command, {
        cwd: path,
    });

    const lines = stdout.split("\n");

    const installedVersions: { [key: string]: string } = {};

    lines.forEach((line) => {
        const [name, version] = line.split(/\s+/).map((x) => x.trim());

        installedVersions[normalize(name)] = version;
    });

    return installedVersions;
};
