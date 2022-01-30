export function getLocalStorage(name) {
    var storedData = ""
    storedData = localStorage.getItem(name)
    return storedData
}

export function setLocalStorage(name, data) {
    var setNewData = ""
    setNewData = localStorage.setItem(name, data)
    return setNewData
}

export function clearLocalStorage() {
    localStorage.clear();
}