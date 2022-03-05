<script>
	export let name;
	// export let args;

	// export let reference;
	$: type = name.slice(name.lastIndexOf('.') + 1);
	// console.log(args);
	// function drag(ev) {
	// 	console.log(ev.target.textContent);
	// 	ev.dataTransfer.setData("moduleName", ev.target.textContent);
	// 	ev.dataTransfer.setData("arguments", JSON.stringify(args));
	// };

	// $: type = "pytorch-icon";
</script>

<div class="selectable-item">
	<span style="background-image: url(./icons/{type}.svg)">{name}</span>
</div>

<style>
	span {
		color: rgb(229 227 227);
		padding: .2em 0 .2em 1.5em;
		background: 0 0.1em no-repeat;
		background-size: auto 70%;
		background-position: left center;
		white-space: nowrap;
	}
</style>