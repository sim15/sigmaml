<script defer>
    import Drawflow from 'drawflow'
    import styleDrawflow from 'drawflow/dist/drawflow.min.css'

    var id;
    var editor;
    // TODO: make this work better
    let moduleSelect = () => {};

    const onload = () => {
        id = window.document.getElementById("drawflow");
        console.log(id);
        editor = new Drawflow(id);
        editor.start()
        var html = `
        <div class="flowbox"><input type="text" df-name></div>
        `;
        var data = { "name": '' };

        // editor.addNode('github', 0, 1, 0, 300, 'github', data, html);
        // editor.addNode('github', 1, 1, 50, 200, 'github', data, html);

    };

    const drop = (ev) => {
        ev.preventDefault();
        var data = ev.dataTransfer.getData("text");
        var html = `
        <div class="flowbox">${data}</div>
        `;
        console.log("X: " + ev.clientX + ", Y: " + ev.clientY);

        var pos_x = ev.clientX
        var pos_y = ev.clientY
        // ev.target.appendChild(document.getElementById(data));

        pos_x = pos_x * ( editor.precanvas.clientWidth / (editor.precanvas.clientWidth * editor.zoom)) - (editor.precanvas.getBoundingClientRect().x * ( editor.precanvas.clientWidth / (editor.precanvas.clientWidth * editor.zoom)));
        pos_y = pos_y * ( editor.precanvas.clientHeight / (editor.precanvas.clientHeight * editor.zoom)) - (editor.precanvas.getBoundingClientRect().y * ( editor.precanvas.clientHeight / (editor.precanvas.clientHeight * editor.zoom)));

        editor.addNode(data, 1, 1, pos_x, pos_y, 'github', { "name": data }, html);
    };

    
    const allowDrop = (ev) => {
        ev.preventDefault();
    };

</script>
<!-- TODO: MAKE SURE NODES CAN'T CONNECT TO THEMSELVES. CHANGE WHAT CAN CONNECT TO WHAT -->
<!-- add dropdown selection for connections -->
<!-- TODO: make sure that canvas doesn't reset after every load? performance -->
<div id="drawflow" use:onload on:drop={drop} on:dragover={allowDrop} draggable="false"></div>

<style>

    #drawflow {
        width: 100%;
        height: 100%;
        overflow: hidden;
    }

    div :global(.drawflow .drawflow-node) {
        background: white;
        border-radius: 1em;
        border: 2px solid black;
        padding: 1em;
    }

    div :global(.drawflow .drawflow-node.selected) {
        background: rgb(173, 228, 233);
        border: 2px solid white;
    }

    div :global(.drawflow .drawflow-node .input), div :global(.drawflow .drawflow-node .output) {
        background-color: black;
        border: 2px solid white;
    }
</style>