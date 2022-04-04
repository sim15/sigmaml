<script>

    const openExistingDir = () => {
        window.api.openDir();
    }

</script>

<style>
    .start-screen {
        display: flex;
        width: 100%;
        padding: 10em;
    }

    #left-start {
        width: 20em;
    }

    #right-start {
        flex: 1 1 auto;
    }

    .start-option-list {
        list-style: none;
        margin: .5em 0;
        padding: 0;
    }

    .start-option-list li {
        margin-bottom: .5em;
    }

    .start-option-list li span {
        color: rgb(60, 118, 184);
        /* text-decoration: underline; */
    }

    .start-option-list li span:hover {
        text-decoration: underline;
        cursor: pointer;
    }

    #recent-project-list {
        border-bottom: 1px solid rgb(255 255 255 / 43%);
    }
    

    
</style>

<div class="start-screen">
    <div class="start-sidebar" id="left-start">
        <div class="section-subtitle">Start</div>
        <ul class="start-option-list">
            <li><span>New project</span></li>
            <li><span on:click={openExistingDir}>Open folder...</span></li>
        </ul>
    </div>
    <div class="start-sidebar" id="right-start">
        <div class="section-subtitle" id="recent-project-list">Recent</div>
    </div>
</div>