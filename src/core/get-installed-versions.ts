import * as execa from "execa";
import { getInterpreterDetails } from "../common/python";
import { normalize } from "./normalize";

export const getInstalledVersions = async (path: string) => {
    const data = await getInterpreterDetails();
    const pythonPath = data?.path ? data.path[0] : "python";
    const command = pythonPath + " -m pip list";

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
