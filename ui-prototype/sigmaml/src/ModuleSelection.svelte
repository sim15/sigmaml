<script>
    import Module from './Module.svelte';

    export let expanded = false;
	export let name;
	export let submodules;
    
    
    function toggle() {
        expanded = !expanded;
    }

</script>

<span class="disable-select" class:expanded on:click={toggle}>{name}</span>

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
		padding: 0 0 0 1.5em;
		/* background: url(/tutorial/icons/folder.svg) 0 0.1em no-repeat; */
		background-size: 1em 1em;
		font-weight: bold;
		cursor: pointer;
	}

	.expanded {
		/* background-image: url(/tutorial/icons/folder-open.svg); */
	}

	ul {
		padding: 0.2em 0 0 0.5em;
		margin: 0 0 0 0.5em;
		list-style: none;
		border-left: 1px solid #eee;
	}

	li {
		padding: 0.2em 0;
	}
</style>