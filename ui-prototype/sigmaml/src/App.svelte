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

	import MainPanel from './MainPanel.svelte';
	import ProgressPanel from './ProgressPanel.svelte';
	import DirectoryView from './DirectoryView.svelte';



	import {stopExpand, expand, startExpand} from './Handlers.svelte';

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
	}

	.right-panel {
		width: 80%;
		min-width: 60%;
		max-width: 90%;
		height: 100%;
		display: flex;
		flex-direction: column;
		flex: 0 0 auto;
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

	.main-view {
		height: 100%;
		flex: 1 1 auto;
		/* display: flex; */
	}

	.selection-menu {
		width: 30%;
		min-width: 1%;
		max-width: 50%;
		height: 100%;
		flex: 0 0 auto;
		overflow: auto;
	}

	.lower-panel {
		background-color: #121212;
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
		/* flex: 0 0 auto; */
		position: absolute;
		display: block;
		top:0; bottom:0; left:0; right:0;
		background-color: rgb(61, 108, 146);
		opacity: 0;
		transition: opacity	0.2s;
		transition-delay: 200ms;
	}

	.handler:hover {
		opacity: 1;
	}

	.handler-wrapper {
		padding: 0;
		position: relative;
		z-index: 20;
		flex: 0 0 auto;
	}

	.y-handler {
		height: .3em;
		cursor: row-resize;
	}

	.y-handler-border {
		height: 0.08px;
		background-color: rgb(66, 66, 66);
	}

	.x-handler-border {
		width: 0.08px;
		background-color: rgb(66, 66, 66);
	}

	.x-handler {
		width: .3em;
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
				<ProgressPanel />
			</div>
			<div class="handler-wrapper y-handler-border">
				<div class="handler y-handler" id="side-menu-left-handler" on:mousedown={startExpand.bind(this,'side-menu-left', 'height')}></div>
			</div>
			<div class="left-tabs sub-panel testy">
				<DirectoryView />
			</div>
		</div>
		<div class="handler-wrapper">
			<div class="handler x-handler" id="side-menu-tall-handler" on:mousedown={startExpand.bind(this, 'side-panel-menu-container', 'width')}></div>
		</div>
		<!-- <div class="handler"></div> -->
		<div class="right-panel panel disable-select" id="side-panel-menu-container">
			<MainPanel />
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



