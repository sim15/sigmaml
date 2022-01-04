<script>
	// // export let name;
	// let customMessage = "HELLO FROM RENDER PROCESS";
	// let count = 0;

	// window.myApi.onCount((data) => {
	// 	count = data;
	// })

	// const sendMessage = () => {
	// 	window.myApi.sendMsg(customMessage);
	// 	customMessage = "";
	// }

	// // when you click. uses api from preload to communicate with main (index.js), gets CPU usage, and then prints WITHIN render process.
	// // essentially we communicate with main, and then it is sent back to render process
	// const getUsage = async () => {
	// 	const data = await window.myApi.sendPromise("HELLO THIS IS A MESSAGE")
	// 	console.log(data);
	// }

	// import { draggable } from 'svelte-drag';
	import ModuleSelection from './ModuleSelection.svelte';
	import Drawflow from './Drawflow.svelte';
	import TerminalPanel from './TerminalPanel.svelte';
	import * as pytorchData from './nnTree.json';

    import 'xterm/css/xterm.css';
import { element } from 'svelte/internal';

	// should change
	// let heightWin = window.innerHeight;
	// window.addEventListener('resize', function(event) {
    // 	heightWin = window.innerHeight;
	// }, true);

	// var leftPanel = window.document.querySelector('.side-menu') 
	// let resizeLeftPanel = () => {

	// };

	// let selectHandler = (handlerId) => {
	// 	window.document.querySelector("#" + handlerId).style.background = 'rgb(85, 85, 85)';
	// };

	// let deselectHandler = (handlerId) => {
	// 	window.document.querySelector("#" + handlerId).style.background = 'rgb(223, 223, 223)';
	// };

	// let resizePanelY = (offsetY, panelId, minHeight, containerOffsetTop) => {
	// 	var panel = window.document.querySelector("#" + panelId);
	// 	var relativeY = 500 + offsetY;
	// 	console.log(offsetY, relativeY);
	// 	panel.style.height = (Math.max(minHeight, relativeY)) + 'px';
	// 	panel.style.flexGrow = 0;
	// };

	let currentlyExpanding = null, expansionType = null;
	let start = null, initial =	null;

	const startExpand = (elementSelected, type, event) => {
		currentlyExpanding = document.getElementById(elementSelected);
		expansionType = type;
		
		if (expansionType == 'height') {
			start = event.pageY;
			initial = currentlyExpanding.clientHeight;
		}
		if (expansionType == 'width') {
			start = event.pageX;
			console.log(start);
			initial = currentlyExpanding.clientWidth;
		};
		// TODO: error handling
	};


	const stopExpand = () => {
		currentlyExpanding = null
		start = null
		initial = null
		expansionType = null
	}

	const expand = (event) => {
		if (!currentlyExpanding) return
		
		if (expansionType == 'height') {
			const dY = start - event.pageY;
			currentlyExpanding.style.height = `${initial - dY}px`;
			return
		}
		
		if (expansionType == 'width') {
			console.log(event.pageX +" " + start + " " + initial);
			const dX = start - event.pageX;
			currentlyExpanding.style.width = `${initial + dX}px`;
			console.log(currentlyExpanding.style.width);
			return
		}		
	}
	
</script>


<style>
	.grid-main {
		height: 100vh;
		width: 100vw;
		display: flex;
		flex-direction: row;
	}

	.left-panel {
		background-color: #181818;
		/* min-width: 20%;
		max-width: 40%; */
		height: 100%;
		/* width: 20%; */
		display: flex;
		flex-direction: column;
		flex: auto;
	}

	.right-panel {
		/* width: 70%; */
		min-width: 60%;
		max-width: 90%;
		height: 100%;
		/* flex: 0 0 auto; */
		display: flex;
		flex-direction: column;
		flex: 1 1 auto;
	}

	.main-panel {
		width: 100%;
		height: 75%;
		background-color: #121212;
		display: flex;
		flex-flow: row;
		flex: auto;
	}

	.main-view {
		width: 70%;
		height: 100%;
		/* display: flex; */
	}

	.selection-menu {
		/* width: 30%; */
		height: 100%;
		flex: 1 1 auto;
		overflow: auto;
	}

	.lower-panel {
		background-color: #303030;
		height: 25%;
		display: flex;
		flex-flow: column;
		flex: 1 1 auto;
		overflow: hidden; 
	}

	.panel {
		/* flex: auto; */
		margin: 0;
	}

	.sub-panel {
		box-sizing: border-box;
		padding: 1em;
		/* flex: 0 1 auto; */
		/* border: .5px solid white; */
	}

	#terminal-container {
		min-width: 300px;
		width: 100%;
		height: 100%;
		padding: 0;
		margin: 0 1em 1em 1em;
		overflow: hidden;
	}

	.handler {
		padding: 0;
		flex: 0 0 auto;
		background: rgb(223, 223, 223);
	}
	.y-handler {
		height: .2em;
		cursor: row-resize;
	}

	.x-handler {
		width: .2em;
		cursor: col-resize;

	}

	.left-tabs {
		flex: 1 1 auto;
	}

	#side-menu-left {
		max-height: 70%;
		height: 50%;
		min-height: 30%;
	}

</style>

<main on:mouseup={stopExpand} >
	<!-- <input type="text" bind:value={customMessage}> -->

	<!-- <button on:click={sendMessage}>Send Message</button>
	<button on:click={getUsage}>Get Usage</button> -->

	
	<div class="grid-main" on:mousemove={expand} >
		<div class="left-panel panel disable-select" >
			<div class="side-menu sub-panel testy" id="side-menu-left">
				side-menu
			</div>
			<!-- </div> -->
			<div class="handler y-handler" id="side-menu-left-handler" on:mousedown={startExpand.bind(this,'side-menu-left', 'height')}></div>
			<div class="left-tabs sub-panel testy">
				left-tabs
			</div>
		</div>
		<div class="handler x-handler" id="side-menu-tall-handler" on:mousedown={startExpand.bind(this, 'side-panel-menu-container', 'width')}></div>
		<!-- <div class="handler"></div> -->
		<div class="right-panel panel disable-select" id="side-panel-menu-container">
			<div class="main-panel panel" id="upper-right-panel">
				<div class="main-view">
					<Drawflow />
				</div>
				<div class="handler x-handler" on:mousedown={startExpand.bind(this, 'container-side-panel', 'width')}></div>
				<div class="selection-menu sub-panel" id="container-side-panel">
					<!-- selection-menu -->
					<ModuleSelection name="Home" submodules={pytorchData.default} expanded/>
				</div>
			</div>
			<div class="handler y-handler" on:mousedown={startExpand.bind(this, 'upper-right-panel', 'height')}></div>
			<!-- <div class="handler"></div> -->
			<div class="lower-panel panel" >
				<div class="terminal-menu sub-panel">
					<span>Terminal</span> <!-- add styling -->
				</div>
				<!-- <TerminalPanel /> -->
				<!-- <div id="terminal"></div> -->
				<!-- <div id="subcontainer"> -->
					<div class="sub-panel" id="terminal-container"></div>
				<!-- </div> -->
			</div>
		</div>
		

	</div>
	
</main>



