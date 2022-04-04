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
    // TODO: Fix these; may not need a store here
    const updateDirFunc = async () => {
        // currentDir.set(window.api === "undefined" ? {name: "No project selected", children: []} : await window.api.getDir());
        currentDir.set(await window.api.getDir());
        // console.log(dirv);
        };

    setInterval(updateDirFunc, 500)
</script>

<div class="directory-tree">
    <Tree name={dirv.name} children={dirv.children} expanded/>
</div>



<style>

    .directory-tree {
        overflow: auto;
        overflow-x: hidden;
    }
</style>