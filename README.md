# $\Sigma$ SigmaML 
Implementation of the  SigmaML application.

### Dependencies
* NodeJS
* Python3

## Running the prototype

#### 0. Install dependencies
- Install main project dependencies (NodeJS, Python, ...)
  - If errors occur in versioning, try reinstalling dependencies with the version mentioned in the error. Current tests were run with NodeJS v14.18.1 and npm 8.3.0, though other versions should work as well.
```
sudo apt-get nodejs
```

- Within the project directory ```ui-prototype/sigmaml```, install all npm packages with:
```
cd ui-prototype/sigmaml
npm install
```
- All dependecies should now be installed

#### 1. Running for the first time
- Prior to first running the application, make sure to run:
```
npm run rebuild
```

### 2. Running in developer mode
- You should now be able to run the application in developer mode with:
```
npm run dev
```
- Following any changes, save and rerun the above command.


## Editing Code

 The base Electron application is located in ```/electron```
- Here, all base application code is run. The app lives here anything you write here cannot be directly interacted with by the browser view.
- ```preload.js``` is responsible for bridging between the back-end application and the front-end browser window in a secure manner. It is run when the application starts and builds the necessary apis.
- ```electron.js``` houses the app itself. Here lies the back-end event listeners and structure.

All node modules are within ```/node_modules```. Do not touch this folder, as it is storing the installed npm packages. Every user installs this on their own machine, so any edits you make will not persist.

The ```/public``` directory holds the built application once it is compiled. It can be run by the user. Within this folder are all the files that are directly accessible to the main application.
- ```/build``` holds the compiled application. Every time you run ```npm run dev```, the svelte compiler (rollup) writes the application here (will get into this later).
- ```/icons``` and any other directories you make here will store public data or images. This folder is accessible to the main browser window.

The ```/src``` directory houses all the main source code. This application is built with the Svelte framework, which allows for modularized Javascript code. When you run the application in dev mode, it compiles all the Svelte files and then compresses them into the public ```/build``` directory, where the program can be run. 
- Most edits are made to this folder, where we change the application. Currently, ```/ModelView``` holds the Model menu code, while all the fundamental modules live in the parent directory. I would not recommend sorting these into their own directory as they are globally accessed by future Svelte modules.

**Contact me with further questions!**