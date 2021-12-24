<script defer>
    import Drawflow from 'drawflow'
    import styleDrawflow from 'drawflow/dist/drawflow.min.css'

    var id;
    // TODO: make this work better
    let moduleSelect = () => {};

    const onload = () => {
        id = window.document.getElementById("drawflow");
        console.log(id);
        var editor = new Drawflow(id);
        editor.start()
        var html = `
        <div class="flowbox"><input type="text" df-name></div>
        `;
        var data = { "name": '' };

        editor.addNode('github', 0, 1, 0, 300, 'github', data, html);
        editor.addNode('github', 1, 1, 50, 200, 'github', data, html);

    };

</script>

<!-- TODO: make sure that canvas doesn't reset after every load? performance -->
<div id="drawflow" use:onload></div>

<style>

    #drawflow {
        width: 100%;
        height: 100%;
        overflow: hidden;
    }

    .flowbox {
        background-color: black;
    }
</style>