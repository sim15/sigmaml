<script>
	import Tree from './Tree.svelte';
    import { writable } from 'svelte/store';

    // allows for updated directory value.
    // TODO: add right click to delete/interact with files.
    // TODO: 
    const currentDir = writable({});
    
    let dirv;
    currentDir.subscribe(value => {
		dirv = value;
	});

    const updateDirFunc = () => {
        currentDir.set(window.api === "undefined" ? {} : window.api.getDir());
        console.log(dirv);
        };
</script>

<div class="directory-tree sub-panel" on:click={updateDirFunc}>
    <Tree name="path" children={[dirv]} expanded/>
</div>



<style>

    .directory-tree {
        overflow: auto;
    }
</style>