export function isValidData(data) {
    return data && data.length > 0
}

export function uppercaseFirstCharacter(name) {
    return name.charAt(0).toUpperCase() + name.slice(1);
}

export const DATEFORMAT = "mmm d, yyyy HH:MM"

export function shuffle(sourceArray) {
    for (var i = 0; i < sourceArray.length - 1; i++) {
        var j = i + Math.floor(Math.random() * (sourceArray.length - i));

        var temp = sourceArray[j];
        sourceArray[j] = sourceArray[i];
        sourceArray[i] = temp;
    }
    return sourceArray;
}