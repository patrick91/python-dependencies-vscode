import * as execa from "execa";

export const getInstalledVersions = async (path: string) => {
    const { stdout } = await execa.command("poetry show", {
        cwd: path,
    });

    const lines = stdout.split("\n");

    const installedVersions: { [key: string]: string } = {};

    lines.forEach((line) => {
        const [name, version] = line.split(/\s+/).map((x) => x.trim());

        installedVersions[name] = version;
    });

    return installedVersions;
};
