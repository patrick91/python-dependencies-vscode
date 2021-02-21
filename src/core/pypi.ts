import fetch from "node-fetch";

export const fetchLibrary = async (library: string) => {
    const x = await fetch(`https://pypi.org/pypi/${library}/json`);

    return await x.json();
};
