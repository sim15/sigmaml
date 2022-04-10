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

const setProjectPath = (projPath) => {
    storage.set("project-path", projPath);
}

const getProjectPath = () => {

    const projPath = storage.get("project-path");

    if (projPath) return projPath;
    return ""
    
} 

// const getModelState = () => {
//     const modelState = storage.get("model-state");

//     if (modelState) return modelState;
//     return {}
// }

// const setModelState = (modelJSON) => {
//     storage.set("model-state", modelJSON)
// }

module.exports = {
    getWindowSettings: getWinSettings,
    saveBounds: saveBounds,
    getProjectDir: getProjectDirectory,
    setProjectDir: setProjectDir,
    setProjectPath: setProjectPath,
    getProjectPath: getProjectPath,
    // getModelState: getModelState,
    // setModelState: setModelState
}