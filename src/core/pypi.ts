import fetch from "node-fetch";

export const fetchLatestVersion = async (library: string) => {
    const x = await fetch(`https://pypi.org/pypi/${library}/json`);
    const data = await x.json();

    return (data.info?.version as string) ?? "unknown";
};
