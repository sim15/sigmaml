<script>
    import File from './File.svelte';

    export let expanded = false;
	export let name;
	export let children;
    
    
    function toggle() {
        expanded = !expanded;
    }

</script>

<span class="disable-select" class:expanded on:click={toggle}>{name}</span>

{#if expanded}
	<ul class="disable-select">
		{#each children as pytorchModule}
			<li class="disable-select">
				{#if pytorchModule.children}
                    <svelte:self {...pytorchModule}/>
				{:else}
					<File {...pytorchModule}/>
				{/if}
			</li>
		{/each}
        <!-- {modules[0]} -->
	</ul>
{/if}

<style>
	span {
		padding: 0 0 0 1.5em;
		background: url(../icons/closed.svg) 0 0 no-repeat;
		background-size: 1em 1em;
		/* font-weight: bold; */
		cursor: pointer;
		white-space: nowrap;
	}

	.expanded {
		/* padding: 0 0 0 1.5em; */
		background: url(../icons/open.svg) 0 0 no-repeat;
		background-size: 1em 1em;
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