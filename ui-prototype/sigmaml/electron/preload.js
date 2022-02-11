
const { ipcRenderer } = require("electron");


const Terminal  =  require('xterm').Terminal;
const FitAddon = require('xterm-addon-fit').FitAddon;


// TODO: look into whether this is secure
window.addEventListener("load", function () {

    // load a terminal
    const term = new Terminal({
    'theme': { background: '#121212' }
    });

    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);

    // Open the terminal in #terminal-container
    term.open(document.getElementById('terminal-container'));

    term.onData(e => {
        ipcRenderer.send("terminal-into", e);
        // console.log("YES")
        // console.log(e);
    } );
    
    ipcRenderer.on('terminal-incData', (event, data) => {
        term.write(data);
        // console.log(event);
    })

    term.onResize((size) => {
        const newsize = {
            cols: size.cols,
            rows: size.rows,
        };

        ipcRenderer.send("term.resize", newsize);
    });

    window.addEventListener("resize", function () {
        fitAddon.fit();
    });

    // Make the terminal's size and geometry fit the size of #terminal-container
    fitAddon.fit();
    // ipcRenderer.send("terminal-into", " ");
    // console.log("binted");




    
    // load run button
    runbutton = document.getElementById("run-button");

    id = window.document.getElementById("drawflow");

    // TODO: use .data?
    runbutton.addEventListener("click", function() {
        ipcRenderer.send("runPythonScript", id.dataset.jsonFileStuff);
    })
})

