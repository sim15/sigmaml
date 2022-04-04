<script>
    import { createEventDispatcher } from 'svelte';
    // import {changeWindow, currentViewName, currentView, views} from "./App.svelte";
    export let processes = [
        {name: 'Start and Configure', status: "complete", selected: false},
        {name: 'Data', status: "error", selected: false},
        {name: 'Model', status: "unfinished", selected: true},
        {name: 'Train', status: "unfinished", selected: false},
        {name: 'Test', status: "unfinished", selected: false}
    ];


    const dispatch = createEventDispatcher();

    function changeWindow(name) {
        console.log('Changed in panel!')
		dispatch('changed-window-view', {
			newWindowName: name
		});
	}

</script>

<ul class="disable-select">
    {#each processes as process}
        <li class="disable-select selectable-item" on:click={() => {changeWindow(process.name)}}>

            <span style="background-image: url(./icons/{process.status}.svg)">
                {process.name}
            </span>
        
        </li>
    {/each}
    <!-- {modules[0]} -->
</ul>


<!-- https://www.svgrepo.com/collection/files-types/3 -->
<style>
    ul {
        margin: 0;
        padding: 0;
        white-space: nowrap;
    }

    

    li {
        padding: 0.2em 1.8em;
        font-size: 1em;
    }

    /* .check-mark {
        display: inline;
        padding-left: .7em;
    } */

    :global(.selected-process) {
       backdrop-filter: brightness(1.6);
    }

    :global(.selectable-item:hover) {
        backdrop-filter: brightness(1.3);
        cursor: pointer;
    }

    span {
		padding: 0 0 0 1.2em;
		/* background-image: url(../icons/plus-square-svgrepo-com.svg) 0 0 no-repeat; */
		background: 0 0 no-repeat;
		background-size: auto 80%;
		background-position: left center;
		cursor: pointer;
	}

</style>