const Store = require('electron-store');
const storage = new Store();


// TODO: add general error handling
const getWinSettings = () => {
    const default_bounds = [800, 650]

    const size = storage.get("win-size");

    if (size) return size;
    else {
        storage.set("win-size", default_bounds);
        return default_bounds;
    }
}

const saveBounds = (bounds) => {
    storage.set("win-size", bounds);
}


const getProjectDirectory = () => {

    const projDir = storage.get("project-dir");

    if (projDir) return projDir;
    return {name: "", children: []}
    
}

// TODO: error checking
const setProjectDir = (dirObject) => {
    storage.set("project-dir", dirObject);
}

module.exports = {
    getWindowSettings: getWinSettings,
    saveBounds: saveBounds,
    getProjectDir: getProjectDirectory,
    setProjectDir: setProjectDir
}