import { getCache } from "../cache";
import { fetchLibrary } from "./pypi";

const ONE_HOUR = 60 * 60 * 1000;
const CACHE_PREFIX = "v1";

const getCacheKey = (library: string) => `${CACHE_PREFIX}-${library}`;

export const getInfo = async (
    library: string,
): Promise<{ version: string; summary: string }> => {
    const cache = getCache();
    const key = getCacheKey(library);

    let info = cache.get(key, null);

    if (info) {
        const data = JSON.parse(info);
        const parsedDate = new Date(data.date);

        if (new Date().getTime() - parsedDate.getTime() < ONE_HOUR) {
            console.info("Not fetching new value for", library);

            return data.info;
        }
    }

    const data = await fetchLibrary(library);

    info = {
        version: data.info.version as string,
        summary: data.info.summary as string,
    };

    await cache.put(key, JSON.stringify({ info, date: new Date() }));

    return info;
};
