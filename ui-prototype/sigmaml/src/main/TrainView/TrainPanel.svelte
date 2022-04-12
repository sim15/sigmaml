<script>
    import { onMount } from 'svelte';
    import {stopExpand, expand, startExpand} from '../Handlers.svelte';
    import * as d3 from 'd3';
    import Svelecte from 'svelecte'

    var rawData = [[],[]];
	
	let el;
    let trainContainer = document.getElementById("train-progress-display");
    let width = 800;
    let height = 500;
    const ABS_MAX = 1;
    const ABS_MIN = -1;
    const dT = 100;

    const margin = {top: 20, right: 20, bottom: 20, left: 50};
    let curT = 0;
    let render = () => {return};

    // initial page render
    onMount(() => {
        const svg = d3.select(el).append("svg")
        .attr("viewBox", "0 0 " + width + " " + height)
        .attr("preserveAspectRatio", "xMidYMid meet")
        .append("g")
            .attr("transform", `translate(${margin.left}, ${margin.right})`)
            
        
            
        const xScale = d3.scaleLinear()
        .range([0, width - margin.left - margin.right]);

        const yScale = d3.scaleLinear()
        .range([height - margin.top - margin.bottom, 0]);

        const line = d3.line()
        .x(d => xScale(d.x))
        .y(d => yScale(d.y))
        .curve(d3.curveLinear);

        

        const formatData = (src) => {
            return d3.range(src.length).map((lineIndex) =>
                d3.range(src[lineIndex].length).map((index) =>
                    ({x: index / src[lineIndex].length, y: src[lineIndex][index]})
                )
            );
        }

        

        render = () => {
            const data = formatData(rawData);
            
            

            // obtain absolute min and max
            const yMin = data.reduce((pv,cv) => {
                const currentMin = cv.reduce((pv,cv) => Math.min(pv,cv.y), ABS_MAX);
                // return Math.min(pv, currentMin);
                return 0;
            }, ABS_MAX);

            const yMax = data.reduce((pv,cv) => {
                const currentMax = cv.reduce((pv,cv) => Math.max(pv,cv.y), ABS_MIN)
                return Math.max(pv, currentMax);
            }, ABS_MIN);

            // set domain for axis
            yScale.domain([yMin, yMax]);

            // create axis scale
            const yAxis = d3.axisLeft().scale(yScale);
            const xAxis = d3.axisBottom().scale(xScale).tickValues([]);


            // const zeroConstantLine = d3.append( "line" )
            // .attr("x1", 0 )
            // .attr("x2", width)
            // .attr("y1", yScale( 0 ) )   // whatever the y-val should be
            // .attr("y2", yScale( 0 ) )
            // .style("stroke", "#bfbfbf")
            // .attr("stroke-width", "3");

            

            // if no axis exists, create one, otherwise update it
            if (svg.selectAll(".y.axis").empty()){
                svg.append("g")
                    .attr("class","y axis")
                    .call(yAxis);

                svg.append("g")
                .attr("transform", "translate(0," + yScale(0) +")")
                .attr("class","x axis")
                .call(xAxis);

                // svg.append("g")
                // .attr("class","zeroLine");
                

            } else {
                svg.selectAll(".y.axis")
                .transition().duration(dT)
                .call(yAxis);

                svg.selectAll(".x.axis")
                .attr("transform", "translate(0," + yScale(0) +")")
                .transition().duration(dT)
                .call(xAxis);

                // svg.selectAll(".zeroLine")
                // .transition()    
                // .call(zeroConstantLine);
            }
            
            // generate line paths
            const lines = svg.selectAll(".line")
            .data(data)
                .attr("class", "line");

            // exit
            lines.exit()
                .remove();
            
            // enter any new data
            lines.enter()
                .append("path")
                .attr("class", "line")
                .attr("d", line)
                // .style("stroke", () =>
                //     '#' + Math.floor(Math.random() * 16777215).toString(16)
                // )
                .style("stroke", () =>
                    "#bfbfbf"
                )
                // Update new data
                .merge(lines)
                .transition().duration(dT)
                .attr("d", line)
                .style("fill", 'none')
                // .style("stroke", () =>
                //     '#' + Math.floor(Math.random() * 16777215).toString(16)
                // )
                .style("stroke", () =>
                    "#bfbfbf"
                );
            
        }
        const addpoints0 = () => {
            curT = curT + 0.1;
            rawData[0].push(20 * Math.pow(0.98, curT) + 5*(Math.random() - 0.5));
        }
        const addpoints1 = () => {
            curT = curT + 0.1;
            rawData[0].push(20 * Math.pow(0.8, curT) + 5*(Math.random() - 0.5));
        }

        render();
        setInterval(render, dT);
        // setInterval(addpoints0, dT);
        // setInterval(addpoints1, dT);
    });
    
    let options = [
        {
            name: "Training Options",
            optionType: "header-option"
        },
        {
            name: "Epochs",
            configID: "epochs",
            configType: "constant",
            description: "Define the number of epochs per training iteration.",
            optionType: "input-option",
            input: {
                type: "number",
                defaultValue: 4
            }
        },
        {
            name: "Loss Function",
            configID: "loss",
            configType: "iterated-selection",
            description: "Which loss function to use.",
            optionType: "input-option",
            input: {
                type: "multi-select",
                defaultValue: ["BCELoss", "NLLLoss2d"],
                selections: [
                    "AdaptiveLogSoftmaxWithLoss",
                    "BCELoss",
                    "BCEWithLogitsLoss",
                    "CTCLoss",
                    "CosineEmbeddingLoss",
                    "CrossEntropyLoss",
                    "GaussianNLLLoss",
                    "HingeEmbeddingLoss",
                    "HuberLoss",
                    "KLDivLoss",
                    "L1Loss",
                    "MSELoss",
                    "MarginRankingLoss",
                    "MultiLabelMarginLoss",
                    "MultiLabelSoftMarginLoss",
                    "MultiMarginLoss",
                    "NLLLoss",
                    "NLLLoss2d",
                    "PoissonNLLLoss",
                    "SmoothL1Loss",
                    "SoftMarginLoss",
                    "TripletMarginLoss",
                    "TripletMarginWithDistanceLoss"
                ]
            }
        },
        {
            name: "Optimization Function",
            configID: "optim",
            configType: "iterated-selection",
            description: "Which optimization function to use.",
            optionType: "input-option",
            input: {
                type: "multi-select",
                defaultValue: ["ASGD", "AdamW"],
                selections: [
                    'ASGD',
                    'Adadelta',
                    'Adagrad',
                    'Adam',
                    'AdamW',
                    'Adamax',
                    'LBFGS',
                    'NAdam',
                    'Optimizer',
                    'RAdam',
                    'RMSprop',
                    'Rprop',
                    'SGD',
                    'SparseAdam'
                ]
            }
        },
        // {
        //     name: "Hyperparameter Optimization",
        //     optionType: "header-option"
        // },
        // {
        //     name: "Optimization Algorithm",
        //     configID: "mode",
        //     configType: "global",
        //     description: "Define an algorithm for optimizing hyperparameters",
        //     optionType: "input-option",
        //     input: {
        //         type: "dropdown",
        //         defaultValue: "Grid Search",
        //         selections: ["Grid Search", "Random Search"]
        //     }
        // },
        {
            name: "Learning Rate",
            configID: "lr",
            configType: "iterated-range",
            description: "Define a search space for learning rate",
            optionType: "input-option",
            input: {
                type: "number-range",
                defaultValue: [0, 1, 0.5]
            }
        }

    ]

    // TODO 4/10: Will break if range value list is empty (e.g., no maximum value is filled in)
    const createConfig = () => {
        let configFile = {
            "feature_head" : "inputHeader",
            "label_header" : "outputHeader",
            "data": "TODO",
        }


        for (const option of options) {
            if (option.configID) {
                switch (option.configType) {
                    case "iterated-range":
                        let rangeIterVals = []
                        for (let i = option.input.defaultValue[0]; i <= option.input.defaultValue[1]; i += option.input.defaultValue[2]) {rangeIterVals.push(i)};

                        configFile[option.configID] = rangeIterVals;
                        break;
                    case "iterated-selection":
                        configFile[option.configID] = [];
                        for (const opt of option.input.defaultValue) {
                            configFile[option.configID].push(option.input.selections[opt]);
                        }
                        break;
                    default:
                        configFile[option.configID] = option.input.defaultValue;
                        break;
                }
                
            }
        }


        return configFile
    }

    let topTrainingRuns;

    setInterval(() => {console.log(createConfig())}, 5000);

    setInterval(async () => {
        topTrainingRuns = await window.api.retrieveJSON("training_history/top_5");
        console.log(topTrainingRuns);
        rawData[0] = topTrainingRuns[topTrainingRuns.length - 1]["loss_vals"];
        console.log(rawData);
    }, 200)

    const beginTraining = () => {
        let configurationFile = JSON.stringify(createConfig());
        window.api.storeJSON(configurationFile, 'temp_training_config')
        // TODO: disable button while running
        // add async
        window.api.runTraining();
    }
</script>

<div class="train-view">
    <div class="train-settings-window" id='train-settings-panel'>
            {#each options as option}
            {#if option.optionType == "input-option"}
                <div class="train-option-cell selectable-item">
                    <span class="option-name">
                        {option.name}
                    </span>
                    <p class="option-description">
                        {option.description}
                    </p>
                    {#if option.input.type == "dropdown"}
                        <select class="option-input"  bind:value={option.input.defaultValue}>
                            {#each option.input.selections as selection}
                                <option value={selection}>
                                    {selection}
                                </option>
                            {/each}
                        </select>
                    {/if}
                    {#if option.input.type == "text"}
                        <input class="option-input" bind:value={option.input.defaultValue}>
                    {/if}
                    {#if option.input.type == "number"}
                        <!-- TODO 4/10: Add min and max -->
                        <input class="option-input" type=number bind:value={option.input.defaultValue}>
                    {/if}
                    {#if option.input.type == "number-range"}
                        <!-- TODO 4/10: Add min and max -->
                        <input class="option-input" type=number placeholder="Minimum Value" bind:value={option.input.defaultValue[0]}>
                        <input class="option-input" type=number placeholder="Maximum Value" bind:value={option.input.defaultValue[1]}>
                        <input class="option-input" type=number placeholder="Step" bind:value={option.input.defaultValue[2]}>
                    {/if}
                    {#if option.input.type == "multi-select"}
                        <!-- <multiselect-combo-box use:loadMultiSelect={option.input.selections} clear-button-visible></multiselect-combo-box> -->
                        <!-- <MultiSelect bind:value={option.input.defaultValue} options={option.input.selections}/> -->
                        <!-- <MultiSelect bind:selected options={ui_libs}/> -->
                        <Svelecte options={option.input.selections} bind:value={option.input.defaultValue} multiple></Svelecte>
                    {/if}
                    
                </div>
            {/if}
            {#if option.optionType == "header-option"}
                <div class="train-option-cell">
                    <span class="section-subtitle">
                        {option.name}
                    </span>
                </div>
            {/if}
            {/each}
            <div class="action-button-bar">
                <div class="action-button" id="training-run" on:click={beginTraining}>TRAIN</div>
            </div>
    </div>
    <div class="handler-wrapper x-handler-border">
        <div class="handler x-handler" id="train-main-handler" on:mousedown={startExpand.bind(this, 'train-settings-panel', 'width-l')}></div>
    </div>
    <div id="train-progress-display">
        <div class="candidate-parameters-menu">

        </div>
        <div bind:this={el} class="chart">
        </div>
    
    </div>
</div>



<style>
    .action-button-bar {
        bottom: 0;
        right: 0;
        position: absolute;
    }

    :global(.svelecte-control) {
        max-width: 30em;
    }
    #training-run {
        right: 10px;
        height: 50px;
        width: 50px;
        background: rgba(0, 128, 0, 0.2);
        line-height: 50px;
        text-align: center;
    }

    #training-run:hover {
        cursor: pointer;
    }

    .chart {
        margin: 3em;
        max-height: 70%;
    }

    .option-name {
        font-size: 130%;
        white-space: nowrap;
    }

    :global(.section-subtitle) {
        font-size: 150%;
        padding-bottom: 0.2em;
    }
    
    :global(input, select) {
        border-radius: 0;
        border: none;
        background-color: #303030;
        color: rgb(194, 194, 194);

    }

    :global(input:focus, select:focus) {
        outline: .7px solid steelblue;
        color: white;
    }

    .train-option-cell {
        padding: 1em 2em;
    }

    .chart :global(div) {
		font: 10px sans-serif;
		background-color: steelblue;
		text-align: right;
		padding: 3px;
		margin: 1px;
		color: white;
        width: 100%;
        height: 100%;
	}

    :global(.chart svg) {
        width: 100%;
        max-width: 60em;
        min-width: 25em;
        max-height: 100%;
        display: block;
        margin: auto;
    }

    .train-view {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: row;
    }

    .train-settings-window {
        flex: 0 0 auto;
        padding: 0;
        min-width: 30%;
        overflow: auto;
        position: relative;
    }

    .candidate-parameters-menu {
        /* height: 10em; */
        flex: auto;
    }

    #train-progress-display {
        flex: 1 1 auto;
        /* padding: 15%; */
        /* overflow: hidden; */
        width: 50%;
        display: flex;
        flex-direction: column;
        /* justify-content: space-between; */
    }

    :global(.axis path,
    .axis line) {
    fill: none;
    stroke: rgb(255, 255, 255);
    shape-rendering: crispEdges;
    }

    /* :global(.x.axis path) {
    display: none;
    } */

    :global(.line) {
    fill: none;
    stroke-width: 1.5px;
    }
</style>