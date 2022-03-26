<script>
    import ModuleSelection from './ModuleSelection.svelte';
	import Drawflow from './Drawflow.svelte';
	import * as pytorchData from './nnTree.json';

	import {stopExpand, expand, startExpand} from '../Handlers.svelte';
	// document.getElementById('container-side-panel').getBoundingClientRect()
	// {x: 653.5, y: 0, width: 451.5, height: 773.25, top: 0, …}
</script>



<div class="main-view">
	<Drawflow />
</div>
<div class="handler-wrapper x-handler-border">
	<div class="handler x-handler" on:mousedown={startExpand.bind(this, 'container-side-panel', 'width')}></div>
</div>
<div class="selection-menu sub-panel" id="container-side-panel">
	<div class="section-title">Modules</div>
	<ModuleSelection name="PyTorch" submodules={pytorchData.default} expanded/>
</div>

<style>
	

	.main-view {
		height: 100%;
		flex: 1 1 auto;
		position: relative;
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


</style>