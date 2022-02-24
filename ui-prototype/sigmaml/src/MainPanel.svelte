<script>
    import ModuleSelection from './ModuleSelection.svelte';
	import Drawflow from './Drawflow.svelte';
	import * as pytorchData from './nnTree.json';

	import {stopExpand, expand, startExpand} from './Handlers.svelte';

</script>

<div class="main-panel panel" id="upper-right-panel">
    <div class="main-view">
        <Drawflow />
    </div>
    <div class="handler-wrapper x-handler-border">
        <div class="handler x-handler" on:mousedown={startExpand.bind(this, 'container-side-panel', 'width')}></div>
    </div>
    <div class="selection-menu sub-panel" id="container-side-panel">
        <ModuleSelection name="PyTorch" submodules={pytorchData.default} expanded/>
    </div>
</div>

<style>
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

</style>