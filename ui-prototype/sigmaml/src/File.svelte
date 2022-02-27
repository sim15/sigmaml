<script>
	export let name;
	// export let args;

	// export let reference;
	// $: type = name.slice(name.lastIndexOf('.') + 1);
	// console.log(args);
	// function drag(ev) {
	// 	console.log(ev.target.textContent);
	// 	ev.dataTransfer.setData("moduleName", ev.target.textContent);
	// 	ev.dataTransfer.setData("arguments", JSON.stringify(args));
	// };

	$: type = "pytorch-icon";
</script>

<span style="background-image: url(./icons/{type}.svg)">{name}</span>

<style>
	span {
		padding: 0 0 0 1.5em;
		background: 0 0.1em no-repeat;
		background-size: 1em 1em;
		white-space: nowrap;
	}
</style>