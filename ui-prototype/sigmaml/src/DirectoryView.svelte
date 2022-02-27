<script>
	import Tree from './Tree.svelte';
    import { writable } from 'svelte/store';

    // allows for updated directory value.
    // TODO: add right click to delete/interact with files.
    // TODO: 
    const currentDir = writable({name: "No project selected", children: []});
    
    let dirv;
    currentDir.subscribe(value => {
		dirv = value;
	});

    const updateDirFunc = () => {
        currentDir.set(window.api === "undefined" ? {name: "No project selected", children: []} : window.api.getDir());
        console.log(dirv);
        };
</script>

<div class="directory-tree sub-panel" on:click={updateDirFunc}>
    <Tree name={dirv.name} children={dirv.children} expanded/>
</div>



<style>

    .directory-tree {
        overflow: auto;
        overflow-x: hidden;
    }
</style>