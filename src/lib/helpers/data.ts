export function flattenTree(tree, key = 'children', collection = []) {
    if (!Array.isArray(tree)) return;

    for (var i=0; i < tree.length; i++) {
        const child = tree[i];

        collection.push(child);
        if (Array.isArray(child[key])) {
            collection = [...flattenTree(child[key], key, collection)];
        }
    }

    return collection;
}


export function filterInFields(input: string, arr: object[], searchFields: string[], filterOnProp?: string) {
    const regex = new RegExp(input, 'gmi');

    return arr.filter(item => {
        for (let key in searchFields) {
            if (!item[searchFields[key]]) {
                continue;
            }
            const match = (filterOnProp) ? item[searchFields[key]][filterOnProp].match(regex) : item[searchFields[key]].match(regex);
            if (match && match.length > 0) { return item; }
        }
    });
}
