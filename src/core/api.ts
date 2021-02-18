import { getCache } from "../cache";
import { fetchLatestVersion } from "./pypi";

const ONE_HOUR = 60 * 60 * 1000;

export const getVersion = async (library: string) => {
    const cache = getCache();

    const info = cache.get(library, null);

    if (info) {
        const { version, date } = JSON.parse(info);
        const parsedDate = new Date(date);

        if (new Date().getTime() - parsedDate.getTime() < ONE_HOUR) {
            console.log("Not fetching new value for", library);

            return version;
        }
    }

    const version = await fetchLatestVersion(library);

    await cache.put(
        library,
        JSON.stringify({
            version,
            date: new Date(),
        }),
    );

    return version;
};
