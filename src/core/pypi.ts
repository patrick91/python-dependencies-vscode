import fetch from "node-fetch";

export const fetchLibrary = async (library: string) => {
    const response = await fetch(`https://pypi.org/pypi/${library}/json`);

    if (response.status === 200) {
        return await response.json();
    }

    console.log(`unable to fetch library ${library}`);

    return null;
};
