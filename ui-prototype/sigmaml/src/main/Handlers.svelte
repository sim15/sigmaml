<script context="module">


    let currentlyExpanding = null, expansionType = null;
	let start = null, initial =	null, currentHandler = null;

	export const startExpand = (elementSelected, type, event) => {
		currentHandler = event.target
		currentHandler.style.opacity = 1;

		currentlyExpanding = document.getElementById(elementSelected);
		expansionType = type;
		
		if (expansionType == 'height') {
			start = event.pageY;
			initial = currentlyExpanding.offsetHeight;
		}
		if ((expansionType == 'width-r') || (expansionType == 'width-l')) {
			start = event.pageX;
			console.log(start);
			initial = currentlyExpanding.offsetWidth;
		};
		// TODO: error handling
	};


	export const stopExpand = () => {
		currentlyExpanding = null
		start = null
		initial = null
		expansionType = null

		if (currentHandler) {
			currentHandler.style.opacity = 0;
		}
		currentHandler = null;
	}

	export const expand = (event) => {
		if (!currentlyExpanding) return
		
		if (expansionType == 'height') {
			const dY = start - event.pageY;
			currentlyExpanding.style.height = `${initial - dY}px`;
			window.api.updateTerminalSize();
			return
		}
		
		if ((expansionType == 'width-r') || (expansionType == 'width-l')) {
			// console.log(event.pageX +" " + start + " " + initial);
			const dX = start - event.pageX;
			if (expansionType == 'width-r') currentlyExpanding.style.width = `${initial + dX}px`;
			else if (expansionType == 'width-l') currentlyExpanding.style.width = `${initial - dX}px`;
			
			// currentlyExpanding.style.width = `${initial + dX}px`;
			// console.log(currentlyExpanding.style.width);
			window.api.updateTerminalSize();
			return
		}		
	}
</script>

<style>
    :global(.handler) {
		padding: 0;
		/* flex: 0 0 auto; */
		position: absolute;
		display: block;
		top:0; bottom:0; left:0; right:0;
		background-color: rgb(61, 108, 146);
		opacity: 0;
		transition: opacity	0.2s;
		transition-delay: 200ms;
	}

	:global(.handler:hover) {
		opacity: 1 !important;
	}

	:global(.handler-wrapper) {
		padding: 0;
		position: relative;
		z-index: 20;
		flex: 0 0 auto;
	}

	:global(.x-handler-border) {
		width: 0.08px;
		background-color: rgb(66, 66, 66);
	}

	:global(.x-handler) {
		width: .3em;
		cursor: col-resize;
	}

	:global(.y-handler) {
		height: .3em;
		cursor: row-resize;
	}

	:global(.y-handler-border) {
		height: 0.08px;
		background-color: rgb(66, 66, 66);
	}

</style>