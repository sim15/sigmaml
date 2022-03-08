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
	
	import TerminalPanel from './TerminalPanel.svelte';
    import 'xterm/css/xterm.css';


	import { element } from 'svelte/internal';

	import MainPanel from './ModelView/MainPanel.svelte';
	import ProgressPanel from './ProgressPanel.svelte';
	import DirectoryView from './DirectoryView.svelte';
	import DataPanel from './DataView/DataPanel.svelte';


	import {stopExpand, expand, startExpand} from './Handlers.svelte';
	
	const views = {
		"Model": MainPanel,
		"Data": DataPanel
	};
	let currentViewName = "Model";
	let currentView = views["Model"];

	const changingWindow = (event) => {
		console.log("Changed in APP");
		// console.log(event.detail.newWindowName);
		currentViewName = event.detail.newWindowName;
		currentView = views[currentViewName];
		// console.log(currentView);
	}

	// changeWindow("Data");

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
		height: 100%;
		display: flex;
		flex-direction: column;
		flex: auto;
		overflow: hidden;
	}

	.right-panel {
		width: 85%;
		min-width: 60%;
		max-width: 90%;
		height: 100%;
		display: flex;
		flex-direction: column;
		flex: 0 0 auto;
	}

	.lower-panel {
		background-color: #121212;
		height: 25%;
		display: flex;
		flex-flow: column;
		flex: 1 1 auto;
		overflow: hidden; 
	}

	:global(.panel) {
		/* flex: auto; */
		margin: 0;
	}

	:global(.sub-panel) {
		box-sizing: border-box;
		padding: 1em;
		padding-bottom: 0;
		/* flex: 0 1 auto; */
		/* border: .5px solid white; */
	}

	#terminal-container {
		min-width: 300px;
		width: 100%;
		height: 100%;
		padding: 0;
		margin: 1em 1em 1em 1em;
		overflow: hidden;
	}


	.left-tabs {
		flex: 1 1 0;
		overflow: auto;
		overflow-x: hidden;
	}

	#side-menu-left {
		max-height: 70%;
		height: 30%;
		min-height: 30%;
		padding: 0;
	}

	:global(.section-title) {
		/* margin-bottom: .5em; */
		text-transform: uppercase;
		white-space: nowrap;
		padding: 0 .8em .8em 0;
	}

	.main-panel {
		width: 100%;
		height: 75%;
		min-height: 30%;
		max-height: 99%;
		background-color: #161616;
		display: flex;
		flex-flow: row;
		flex: 0 0 auto;
	}
	

</style>

<main on:mouseup={stopExpand} >
	<!-- <input type="text" bind:value={customMessage}> -->

	<!-- <button on:click={sendMessage}>Send Message</button>
	<button on:click={getUsage}>Get Usage</button> -->

	
	<div class="grid-main" on:mousemove={expand} >
		<div class="left-panel panel disable-select" >
			<div class="side-menu sub-panel" id="side-menu-left">
				<div class="sub-panel">
					<div class="section-title">Dashboard</div>
				</div>
				<ProgressPanel on:changed-window-view={changingWindow}/>
			</div>
			<div class="handler-wrapper y-handler-border">
				<div class="handler y-handler" id="side-menu-left-handler" on:mousedown={startExpand.bind(this,'side-menu-left', 'height')}></div>
			</div>
			<div class="left-tabs sub-panel">
				<div class="section-title">Project Directory</div>
				<DirectoryView />
			</div>
		</div>
		<div class="handler-wrapper">
			<div class="handler x-handler" id="side-menu-tall-handler" on:mousedown={startExpand.bind(this, 'side-panel-menu-container', 'width')}></div>
		</div>
		<!-- <div class="handler"></div> -->
		<div class="right-panel panel disable-select" id="side-panel-menu-container">
			<div class="main-panel panel" id="upper-right-panel">
				{#if currentView == views[currentViewName]}
						<svelte:component this={currentView}></svelte:component>
				{/if}
			</div>
			<div class="handler-wrapper y-handler-border">
				<div class="handler y-handler" on:mousedown={startExpand.bind(this, 'upper-right-panel', 'height')}></div>
			</div>
			<div class="lower-panel panel" >
				<div class="terminal-menu sub-panel">
					<span>Terminal</span>
				</div>
					<div class="sub-panel" id="terminal-container"></div>
			</div>
		</div>
		

	</div>
	
</main>



