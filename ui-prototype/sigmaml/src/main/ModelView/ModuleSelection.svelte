<script>
    import Module from './Module.svelte';

    export let expanded = false;
	export let name;
	export let submodules;
    
    
    function toggle() {
        expanded = !expanded;
    }

</script>

<div class="module-item selectable-item" on:click={toggle}>
	<span class="disable-select" class:expanded>{name}</span>
</div>

{#if expanded}
	<ul class="disable-select">
		{#each submodules as pytorchModule}
			<li class="disable-select">
				{#if pytorchModule.submodules}
                    <svelte:self {...pytorchModule}/>
				{:else}
					<Module {...pytorchModule}/>
				{/if}
			</li>
		{/each}
        <!-- {modules[0]} -->
	</ul>
{/if}

<style>
	span {
		padding: 0 0 0 1.4em;
		background: url(../icons/plus-square-svgrepo-com.svg) 0 0 no-repeat;
		/* background: ; */
		background-size: auto 80%;
		background-position: left center;
		cursor: pointer;
		white-space: nowrap;
	}

	.expanded {
		color: rgb(229 227 227);
		background: url(../icons/minus-square-svgrepo-com.svg) 0 0 no-repeat;
		background-size: auto 80%;
		background-position: left center;
	}

	ul {
		padding: 0.2em 0 0 0.5em;
		margin: 0 0 0 0.5em;
		list-style: none;
		border-left: 1px solid rgba(255, 255, 255, 0.4);
	}

	.module-item {
		padding: 0.2em 0;
	}
</style>