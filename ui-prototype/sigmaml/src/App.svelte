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

	// should change
	let heightWin = window.innerHeight;
	window.addEventListener('resize', function(event) {
    	heightWin = window.innerHeight;
	}, true);

	var leftPanel = window.document.querySelector('.side-menu') 
	let resizeLeftPanel = () => {

	};

	let selectHandler = (handlerId) => {
		window.document.querySelector("#" + handlerId).style.background = 'rgb(85, 85, 85)';
	};

	let deselectHandler = (handlerId) => {
		window.document.querySelector("#" + handlerId).style.background = 'rgb(223, 223, 223)';
	};

	let resizePanelY = (offsetY, panelId, minHeight, containerOffsetTop) => {
		var panel = window.document.querySelector("#" + panelId);
		var relativeY = 500 + offsetY;
		console.log(offsetY, relativeY);
		panel.style.height = (Math.max(minHeight, relativeY)) + 'px';
		panel.style.flexGrow = 0;
	};

</script>


<style>
	.grid-main {
		height: 100vh;
		width: 100vw;
		display: flex;
	}

	.left-panel {
		background-color: #181818;
		height: 100%;
		/* width: 20%; */
		display: flex;
		flex-direction: column;
	}

	.right-panel {
		width: 80%;
		height: 100%
	}

	.main-panel {
		width: 100%;
		height: 75%;
		background-color: #121212;
		display: flex;
	}

	.main-view {
		width: 70%;
		height: 100%;
	}

	.selection-menu {
		width: 30%;
		height: 100%;
		overflow: auto;
	}

	.lower-panel {
		background-color: #303030;
		height: 25%;
		display: flex;
		flex-flow: column;
	}

	.panel {
		flex: auto;
		margin: 0;
	}

	.sub-panel {
		box-sizing: border-box;
		padding: 1em;
		flex: 1 1 auto;
		/* border: .5px solid white; */
	}

	#terminal-container {
		width: 100%;
		height: 100%;
		padding: 0;
		margin: 0 1em 1em 1em;
		overflow: hidden;
	}

	.handler {
		height: 3px;
		padding: 0;
		cursor: ns-resize;
		flex: 0 0 auto;
		background: rgb(223, 223, 223);
	}

</style>

<main>
	<!-- <input type="text" bind:value={customMessage}> -->

	<!-- <button on:click={sendMessage}>Send Message</button>
	<button on:click={getUsage}>Get Usage</button> -->

	
	<div class="grid-main">
		<div class="left-panel panel">
			<div class="side-menu sub-panel" id="side-menu-left">
				side-menu
				<!-- <div class="handler" id="side-menu-left-handler"></div> -->
			</div>
			
			<div class="left-tabs sub-panel">
				left-tabs
			</div>
		</div>
		<!-- <div class="handler"></div> -->
		<div class="right-panel panel">
			<div class="main-panel panel">
				<div class="main-view">
					<Drawflow />
				</div>
				<div class="selection-menu sub-panel">
					<!-- selection-menu -->
					<ModuleSelection name="Home" submodules={pytorchData.default} expanded/>
				</div>
			</div>
			<!-- <div class="handler"></div> -->
			<div class="lower-panel panel">
				<div class="terminal-menu sub-panel">
					<span>Terminal</span> <!-- add styling -->
				</div>
				<!-- <TerminalPanel /> -->
				<!-- <div id="terminal"></div> -->
				<div class="sub-panel" id="terminal-container"></div>
			</div>
		</div>
		

	</div>
	
</main>



