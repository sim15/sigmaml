# SigmaML 
Implementation of SigmaML -- A cross-platform compatible desktop application for building machine learning models
with an intuitive UI that aggregates all steps of the development process. Built entirely using web-technology.

The above prototype is currently in development.
Please feel free to contact me with any questions. 

### Dependencies
* NodeJS
* Python3
* PyTorch

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
