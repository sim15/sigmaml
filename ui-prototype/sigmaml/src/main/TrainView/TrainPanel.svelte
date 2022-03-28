<script>
    import { onMount } from 'svelte';
    import {stopExpand, expand, startExpand} from '../Handlers.svelte';
    import * as d3 from 'd3';



    var rawData = [[],[]];
	
	let el;
    // let trainContainer = document.getElementById("train-progress-display");
    let width = 800;
    let height = 500;
    const ABS_MAX = 1;
    const ABS_MIN = -1;
    const dT = 700;

    const margin = {top: 20, right: 20, bottom: 20, left: 50};
    
    let render = () => {return};

    // initial page render
    onMount(() => {

        const svg = d3.select(el).append("svg")
        .attr("height", height).attr("width", width)
        .append("g")
            .attr("transform", `translate(${margin.left}, ${margin.right})`) 

        const xScale = d3.scaleLinear()
        .range([0, width - margin.left - margin.right]);

        const yScale = d3.scaleLinear()
        .range([height - margin.top - margin.bottom, 0]);

        const line = d3.line()
        .x(d => xScale(d.x))
        .y(d => yScale(d.y));
        // .curve(d3.curveMonotoneX);

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
                return Math.min(pv, currentMin);
            }, ABS_MAX);

            const yMax = data.reduce((pv,cv) => {
                const currentMax = cv.reduce((pv,cv) => Math.max(pv,cv.y), ABS_MIN)
                return Math.max(pv, currentMax);
            }, ABS_MIN);

            // set domain for axis
            yScale.domain([yMin, yMax]);

            // create axis scale
            const yAxis = d3.axisLeft().scale(yScale);

            // if no axis exists, create one, otherwise update it
            if (svg.selectAll(".y.axis").empty()){
                svg.append("g")
                    .attr("class","y axis")
                    .call(yAxis);
            } else {
                svg.selectAll(".y.axis")
                .transition().duration(dT)
                .call(yAxis);
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
                .style("stroke", () =>
                    '#' + Math.floor(Math.random() * 16777215).toString(16)
                )
                // Update new data
                .merge(lines)
                .transition().duration(1500)
                .attr("d", line)
                .style("fill", 'none')
                .style("stroke", () =>
                    '#' + Math.floor(Math.random() * 16777215).toString(16)
                );
            
        }
        const addpoints0 = () => {
            rawData[0].push(Math.random());
        }
        const addpoints1 = () => {
            rawData[1].push(Math.random());
        }

        render();
        setInterval(render, dT);
        // setInterval(addpoints0, dT);
        setInterval(addpoints1, dT*4);
    });
    
    let options = [
        {
            name: "Epochs",
            description: "Define the number of epochs per training iteration.",
            input: {
                type: "text",
                defaultValue: "4"
            }
        },
        {
            name: "Loss Function",
            description: "Which loss function to use.",
            input: {
                type: "text",
                defaultValue: "MSELoss"
            }
        },
        {
            name: "Optimization Function",
            description: "Which optimization function to use.",
            input: {
                type: "text",
                defaultValue: "Adadelta"
            }
        }

    ]

</script>

<div class="train-view">
    <div class="train-settings-window">
            {#each options as option}
            <div class="train-option-cell selectable-item">
                <span class="option-name">
                    {option.name}
                </span>
                <p class="option-description">
                    {option.description}
                </p>
                <input class="option-input" type={option.input.type} value={option.input.defaultValue}>
            </div>
            {/each}
    </div>
    <div class="handler-wrapper x-handler-border">
        <div class="handler x-handler" id="train-main-handler" on:mousedown={startExpand.bind(this, 'train-progress-display', 'width')}></div>
    </div>
    <div id="train-progress-display">
        <div bind:this={el} class="chart">
        </div>
    
    </div>
</div>



<style>
    .chart {
        margin: 100px;
    }

    .option-name {
        font-size: 130%;
    }
    
    .option-input {
        border-radius: 0;
        border: none;
        background-color: #303030;
        color: rgb(194, 194, 194);

    }

    .option-input:focus{
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

    
    #train-progress-display {
        /* flex: 0 0 auto; */
        /* padding: 15%; */
        /* overflow: hidden; */
    }

    :global(.axis path,
    .axis line) {
    fill: none;
    stroke: rgb(255, 255, 255);
    shape-rendering: crispEdges;
    }

    :global(.x.axis path) {
    display: none;
    }

    :global(.line) {
    fill: none;
    stroke-width: 1.5px;
    }
</style>