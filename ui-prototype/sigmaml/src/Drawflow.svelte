<script defer>
    import Drawflow from 'drawflow'
    import styleDrawflow from 'drawflow/dist/drawflow.min.css';

    // recursively check if a cycle was created in the graph
    function cycleCreated(curNode, visited, recursionPath) {
        if (recursionPath[curNode])
            return true;
        
        if (visited[curNode])
            return false;
        
        
        visited[curNode] = true;
        recursionPath[curNode] = true;

        let currentNode = editor.getNodeFromId(curNode);

        for (let key1 in currentNode.outputs) {
            for (let key2 in currentNode.outputs[key1].connections) {
                let curID = currentNode.outputs[key1].connections[key2].node;
                if (cycleCreated(curID, visited, recursionPath))
                    return true;
            };
        };

        recursionPath[curNode] = false;
        return false
    };

    function existMultipleGraphsOld() {
        const existingNodes = Object.keys(editor.export()['drawflow']['Home']['data']);
        console.log(existingNodes);
        existingNodes.pop();
        console.log(existingNodes);
        if (existingNodes.length < 2) {
            return false;
        };

        let visited = {};
        for (let i=0; i < existingNodes.length; i++) {
            console.log(existingNodes[i]);
            visited[existingNodes[i]] = false;
        };

        let currentNode;
        let queue = [existingNodes[0]];
        while (queue.length > 0) {
            currentNode = queue.pop();
            if (visited[currentNode]) 
                continue;
            
            visited[currentNode] = true;
            let parentNode = editor.getNodeFromId(currentNode);
            
            for (let key1 in parentNode.inputs) {
                for (let key2 in parentNode.inputs[key1].connections) {
                    let curID = parentNode.inputs[key1].connections[key2].node;
                    queue.push(curID);
                };
            };
        };
        

        console.log(visited)

        if (Object.values(visited).filter(Boolean).length == Object.values(visited).length) {
            return false
        };
        

        queue = [currentNode];
        visited[currentNode] = false;
        console.log(queue[0]);
        while (queue.length > 0) {
            currentNode = queue.pop();
            if (visited[currentNode]) 
                continue;
            
            visited[currentNode] = true;
            let parentNode = editor.getNodeFromId(currentNode);
            
            for (let key1 in parentNode.outputs) {
                for (let key2 in parentNode.outputs[key1].connections) {
                    let curID = parentNode.outputs[key1].connections[key2].node;
                    queue.push(curID);
                };
            };
        };

        console.log(visited)

        return Object.values(visited).filter(Boolean).length != Object.values(visited).length;

    };

    

    function existMultipleGraphs() {

        function dfsOutputs(aNode) {
            visited1[aNode] = true;
            let parentNode = editor.getNodeFromId(aNode);

            for (let key1 in parentNode.outputs) {
                for (let key2 in parentNode.outputs[key1].connections) {
                    let curID = parentNode.outputs[key1].connections[key2].node;
                    if (!visited1[curID]) {
                        editor.dispatch('nodeSelected', curID);
                        dfsOutputs(curID);
                    }
                };
            };
        };

        function dfsInputs(aNode) {
            visited2[aNode] = true;
            let parentNode = editor.getNodeFromId(aNode);

            for (let key1 in parentNode.inputs) {
                for (let key2 in parentNode.inputs[key1].connections) {
                    let curID = parentNode.inputs[key1].connections[key2].node;
                    if (!visited2[curID]) {
                        dfsInputs(curID);
                    }
                };
            };
        };


        const existingNodes = Object.keys(editor.export()['drawflow']['Home']['data']);

        console.log(existingNodes);
        existingNodes.pop();
        if (existingNodes.length < 2) {
            return false;
        };

        let visited1 = {};
        let visited2 = {};
        for (let i=0; i < existingNodes.length; i++) {
            // console.log(existingNodes[i]);
            visited1[existingNodes[i]] = false;
            visited2[existingNodes[i]] = false;
        };

        dfsOutputs(existingNodes[0]);
        dfsInputs(existingNodes[0]);

        for (let i=0; i < existingNodes.length; i++) {
            if (!visited1[existingNodes[i]] && !visited2[existingNodes[i]]) {
                return true
            }
        };
        
        return false;
    };

    var id;
    var editor;
    // TODO: make this work better
    let moduleSelect = () => {};

    const onload = () => {
        id = window.document.getElementById("drawflow");
        
        editor = new Drawflow(id);
        editor.start();
        var html = `
        <div class="flowbox">
            <span class="nodeTitle"}>Root: Input Data</span>
            
            </div>
        `;
        var data = { "name": 'Root Data', inputdata: ""};
        // add path input for root data
        editor.addNode('root', 1, 1, 0, 0, 'github', data, html);

        editor.on('connectionCreated', (connection) => {
            if (cycleCreated(connection.output_id, {}, {})) {
                console.log("There was a cycle in the graph!");
                // TODO: Show some alert that indicates a cycle
                editor.removeSingleConnection(connection.output_id,
                connection.input_id,
                connection.output_class,
                connection.input_class);
            }
        });

        editor.on('nodeCreated', (nodeID) => {
            // TODO: set a root node for initial data. scan to make sure the digraph is connected

            // if (existMultipleGraphs()) {
            //     console.log("There are multiple graphs!");
            //     // TODO: Show some alert that indicates a cycle
            //     editor.removeNodeId("node-" + nodeID);
            // }
        });

    };

    const saveGraphJSON = (ev) => {
        id.dataset.jsonFileStuff = JSON.stringify(editor.export(), null, 4);
    }

    

    const drop = (ev) => {
        ev.preventDefault();
        var moduleArgs = JSON.parse(ev.dataTransfer.getData("arguments"));
        var data = {"name": ev.dataTransfer.getData("text")};
        Object.assign(data, moduleArgs);

        var html = `
        <div class="flowbox">
            <div><span class="nodeTitle">${data.name}</span></div>
            <div class="arg-inputs">
        `;

        for (const arg in moduleArgs) {
            html += `
            <div class="argbox">
            <div class="argcol">
            <span>${arg}</span>
            </div>

            <div class="argcol">
            <input class="input-arg" type="text" df-${arg} value="${moduleArgs[arg]}"></input>
            </div>
            </div>`;
        }
        html += '</div></div>';

        var pos_x = ev.clientX
        var pos_y = ev.clientY

        // make sure location is correct (account for zoom and canvas shift)
        pos_x = pos_x * ( editor.precanvas.clientWidth / (editor.precanvas.clientWidth * editor.zoom)) - (editor.precanvas.getBoundingClientRect().x * ( editor.precanvas.clientWidth / (editor.precanvas.clientWidth * editor.zoom)));
        pos_y = pos_y * ( editor.precanvas.clientHeight / (editor.precanvas.clientHeight * editor.zoom)) - (editor.precanvas.getBoundingClientRect().y * ( editor.precanvas.clientHeight / (editor.precanvas.clientHeight * editor.zoom)));
        // TODO: remove 'github'
        editor.addNode(data, 1, 1, pos_x, pos_y, 'github', { "name": data }, html);
        // console.log(editor.export());
        
    };

    
    const allowDrop = (ev) => {
        ev.preventDefault();
    };

    

</script>
<!-- TODO: MAKE SURE NODES CAN'T CONNECT TO THEMSELVES. CHANGE WHAT CAN CONNECT TO WHAT -->
<!-- add dropdown selection for connections -->
<!-- TODO: make sure that canvas doesn't reset after every load? performance -->
<div class="button-container">
    <div id="run-button">RUN</div>
    <div id="save-button" on:click={saveGraphJSON}>SAVE</div>
</div>
<div id="drawflow" use:onload on:drop={drop} on:dragover={allowDrop} draggable="false"></div>

<style>

    #drawflow {
        width: 100%;
        height: 100%;
        overflow: hidden;
        z-index: -1;
    }

    div :global(.drawflow .drawflow-node) {
        background: rgb(85, 85, 85);
        border-radius: 2px;
        border: 2px solid black;
        padding: 1em;
        width: 400px;
    }

    div :global(.drawflow .drawflow-node.selected) {
        background: rgb(59, 59, 59);
        border: 2px solid white;
    }

    div :global(.drawflow .drawflow-node .input), div :global(.drawflow .drawflow-node .output) {
        background-color: black;
        border: 2px solid white;
    }

    div :global(.flowbox) {
        overflow: hidden;
    }

    div :global(.argbox) {
        display: flex;
        flex-direction: row;
        width: 100%;
    }

    div :global(.argcol ) {
        flex: 1;
        overflow: hidden;
    }
    /* THIS DOESNT WORK */
    /* input :global(.input-arg) {
        width: 90%;
    } */


    .button-container {
        display: flex;
        flex-direction: row;
        gap: 1em;
    }

    #run-button, #save-button {
		background: green;
		width: 50px;
		height: 50px;
	}

</style>