<script>
	export let name;
	// export let reference;
	// $: type = name.slice(name.lastIndexOf('.') + 1);

	function drag(ev) {
		ev.dataTransfer.setData("text", ev.target.textContent);
	};

	$: type = "pytorch-icon";
</script>

<span style="background-image: url(./icons/{type}.svg)"
draggable="true" on:dragstart={drag}
>{name}</span>

<style>
	span {
		padding: 0 0 0 1.5em;
		background: 0 0.1em no-repeat;
		background-size: 1em 1em;
	}
</style>