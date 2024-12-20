/**
 * object to query string
 */
export const objectToQueryString = (obj: any) => {
    return Object.keys(obj)
        .map((key) => key + "=" + obj[key])
        .join("&");
}

/**
 * query string to object
 */
export const queryStringToObject = (query: string) => {
    return query.split("&").reduce((acc, cur) => {
        const [key, value] = cur.split("=");
        acc[key] = value;
        return acc;
    }, {});
}