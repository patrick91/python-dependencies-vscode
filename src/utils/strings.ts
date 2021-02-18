export const splitFirst = (line: string) => {
    const [a, ...b] = line.split("=");

    return [a, b.join("=")];
};
