<!-- <script>
    import { ipcRenderer } from 'electron';

    // TODO: es6?
    import { Terminal } from 'xterm';
    import 'xterm/css/xterm.css';
    

    var term = new Terminal();
    const terminalLoad = () => {
        term.open(window.document.getElementById("terminal"));
        term.onData(e => {
            ipcRenderer.send("terminal.toTerm", e);
        });

        ipcRenderer.on("terminal.incData", (event, data) => {
            term.write(data);
        });
    };
</script>


<div class="terminal sub-panel" id="terminal" use:terminalLoad>
    terminal
</div> -->