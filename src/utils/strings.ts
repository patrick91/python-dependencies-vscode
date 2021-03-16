export const splitFirst = (line: string, separator: string = '=') => {
    const [a, ...b] = line.split(separator);

    return [a, b.join("=")];
};
