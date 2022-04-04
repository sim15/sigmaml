<script defer>
    import DrawflowMod from './drawflow_wrapper'
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
        
        editor = new DrawflowMod(id);

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

        // TODO: this is a temporary fix.
        // fix order of classes since svelte- is added prior to drawflow-parent
        // this causes a bug and doesnt allow dragging outside of the precanvas.
        var temp = id.classList[0];
        id.classList.remove(temp);
        id.classList.add(temp);

    };

    const saveGraphJSON = (ev) => {
        // id.dataset.jsonFileStuff = ;
        window.api.convertJSONtoModel(JSON.stringify(editor.export(), null, 4))
    }

    

    const drop = (ev) => {
        ev.preventDefault();
        var moduleArgs = JSON.parse(ev.dataTransfer.getData("arguments"));
        var nameDropped = ev.dataTransfer.getData("moduleName");

        
        var html = `
        <div class="flowbox">
            <div class="nodeHeader">
                <span class="nodeTitle">${nameDropped}</span>
                <div class="control-buttons">
                    <object type="image/svg+xml" data="./icons/icons8-cancel.svg"></object>
                </div>
            </div>
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
        editor.addNode(nameDropped, 1, 1, pos_x, pos_y, 'github', moduleArgs, html);
        // console.log(editor.export());
        
    };

    // TODO: 02/14/2022: Reconsider whether we can connect mutliple nodes into one input.
    
    const allowDrop = (ev) => {
        ev.preventDefault();
    };

    
    
    

</script>

<!-- TODO: Collapsable modules (close and open the arguments) -->
<!-- TODO: MAKE SURE NODES CAN'T CONNECT TO THEMSELVES. CHANGE WHAT CAN CONNECT TO WHAT -->
<!-- add dropdown selection for connections -->
<!-- TODO: make sure that canvas doesn't reset after every load? performance -->
<div class="button-container">
    <div id="save-button" on:click={saveGraphJSON}>SAVE</div>
</div>
<div id="drawflow" use:onload on:drop={drop} on:dragover={allowDrop} draggable="false"></div>


<style>

    #drawflow {
        width: 100%;
        height: 100%;
        overflow: hidden;
        z-index: -1;
        background-size: 2em 2em;
        background-image: linear-gradient(to right, #1c1c1c 1px, transparent 1px), linear-gradient(to bottom, #1c1c1c 1px, transparent 1px);
    }

    div :global(.drawflow .drawflow-node) {
        background: #121212;
        /* border-radius: 15px; */
        border: 0 solid black;
        padding: 0;
        width: 400px;
        color: white;
        min-height: initial;
    }
/* 
    div :global(.drawflow_content_node) {
        margin: 1em 0 0 1em;
    } */

    :global(.nodeHeader) {
        padding: 1em 0.5em 1em 1em;
        background: #202020;
        /* border-radius: 15px 15px 0 0; */
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    div :global(.drawflow .connection .main-path) {
        stroke: white;
        stroke-width: 2px;
        stroke-dasharray: 10,5;
    }

    /* div :global(.drawflow .drawflow-node.selected) {
        background: rgb(59, 59, 59);
        border: 0 solid white;
    } */

    div :global(.drawflow .drawflow-node .input), div :global(.drawflow .drawflow-node .output) {
        background: rgba(255,255,255,0.1);
        border: 0 solid white;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        border-radius: 50%;
        transform: translateX(-50%) translateY(-50%);
        /* box-shadow: 0px 0px 8px 4px #ffffff; */
    }


    div :global(.drawflow .drawflow-node .inputs), div :global(.drawflow .drawflow-node .outputs) {
        height: 0;
        
    }

    div :global(.drawflow .drawflow-node) {
        align-items: center;
        flex-direction: column;
    }

    div :global(.flowbox) {
        overflow: hidden;
    }

    div :global(.arg-inputs) {
        padding: 1em 1em 1em 2em;
    }

    div :global(.argbox) {
        display: flex;
        flex-direction: row;
        width: 100%;
        align-items: center;
    }

    div :global(.argcol ) {
        flex: 1;
        overflow: hidden;
    }
    :global(.input-arg) {
        width: 95%;
    }

    :global(.control-buttons) {
        background: none;
        margin: 0;
        padding: 0;
        height: 1.5em;
    }

    :global(object) {
        height: 100%;
    }


    .button-container {
        position: absolute;
        z-index: 5;
        display: flex;
        flex-direction: row;
        gap: 1em;
        right: 10px;
    }

     #save-button {
		background: rgba(0, 128, 0, 0.2);
		width: 50px;
		height: 50px;
        line-height: 50px;
        text-align: center;
        
	}
    #save-button:hover {
        cursor: pointer;
		background: rgba(0, 128, 0, 0.3);
    }

</style>