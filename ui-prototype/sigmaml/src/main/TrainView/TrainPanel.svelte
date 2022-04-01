<script>
    import { onMount } from 'svelte';
    import {stopExpand, expand, startExpand} from '../Handlers.svelte';
    import * as d3 from 'd3';



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
        setInterval(addpoints1, dT);
    });
    
    let options = [
        {
            name: "Training Options",
            optionType: "header-option"
        },
        {
            name: "Epochs",
            description: "Define the number of epochs per training iteration.",
            optionType: "input-option",
            input: {
                type: "text",
                defaultValue: "4"
            }
        },
        {
            name: "Loss Function",
            description: "Which loss function to use.",
            optionType: "input-option",
            input: {
                type: "text",
                defaultValue: "MSELoss"
            }
        },
        {
            name: "Optimization Function",
            description: "Which optimization function to use.",
            optionType: "input-option",
            input: {
                type: "text",
                defaultValue: "Adadelta"
            }
        },
        {
            name: "Hyperparameter Optimization",
            optionType: "header-option"
        },
        {
            name: "Optimization Algorithm",
            description: "Define an algorithm for optimizing hyperparameters",
            optionType: "input-option",
            input: {
                type: "text",
                defaultValue: "Grid Search"
            }
        },
        {
            name: "Learning Rate",
            description: "Define a search space for learning rate",
            optionType: "input-option",
            input: {
                type: "text",
                defaultValue: "69"
            }
        }

    ]

</script>

<div class="train-view">
    <div class="train-settings-window">
            {#each options as option}
            {#if option.optionType == "input-option"}
                <div class="train-option-cell selectable-item">
                    <span class="option-name">
                        {option.name}
                    </span>
                    <p class="option-description">
                        {option.description}
                    </p>
                    <input class="option-input" type={option.input.type} value={option.input.defaultValue}>
                </div>
            {/if}
            {#if option.optionType == "header-option"}
                <div class="train-option-cell">
                    <span class="option-header">
                        {option.name}
                    </span>
                </div>
            {/if}
            {/each}
    </div>
    <div class="handler-wrapper x-handler-border">
        <div class="handler x-handler" id="train-main-handler" on:mousedown={startExpand.bind(this, 'train-progress-display', 'width')}></div>
    </div>
    <div id="train-progress-display">
        <div class="candidate-parameters-menu">

        </div>
        <div bind:this={el} class="chart">
        </div>
    
    </div>
</div>



<style>
    .chart {
        margin: 3em;
    }

    .option-name {
        font-size: 130%;
    }

    .option-header {
        font-size: 150%;
        font-weight: bold;
    }
    
    :global(input) {
        border-radius: 0;
        border: none;
        background-color: #303030;
        color: rgb(194, 194, 194);

    }

    :global(input:focus) {
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
        flex: auto;
        padding: 0;
        min-width: 30%;
        overflow: auto;
    }

    .candidate-parameters-menu {
        /* height: 10em; */
        flex: auto;
    }

    #train-progress-display {
        /* flex: 0 0 auto; */
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