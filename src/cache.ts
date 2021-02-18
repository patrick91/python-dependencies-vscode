import { ExtensionContext } from "vscode";
import * as Cache from "vscode-cache";

let cache: any = null;

export const getCache = () => {
    if (!cache) {
        throw new Error("Unable to get cache");
    }

    return cache;
};

export const setCache = (extensionContext: ExtensionContext) => {
    cache = new Cache(extensionContext);
};
