<script>

    /** @type { { based: {value: number, stringed: string}, simple: {value: number, stringed: string}; } } */
    export let degree_grade;
    
</script>

<h2 id="new-average">Μέσος Όρος</h2>

<div id="grades-box">

    <div class="grade-box" >
        <h1 class="grade-text">{degree_grade.based.stringed}</h1>
        <p class="grade-subtext">Με συντελεστές</p>
    </div>

    <div id="grade-line"> </div>

    <div class="grade-box">
        <h1 class="grade-text">{degree_grade.simple.stringed}</h1>
        <p class="grade-subtext">Απλός</p> 
    </div>
</div>  




<style>

    #new-average {
        text-align: center;
        color: #515151;
        margin-top: 2.5rem;
        margin-bottom: -0.5rem;
        font-weight: 550;
        color: var(--app-color-degree-text);
    }

    #grades-box {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: flex-start;
        gap: 1.5rem;
        margin-bottom: 2em;
    }

    #grade-line {
        border-left: 0.09rem solid #868686;
        height: 3.1rem;      
        margin-top: 1.8rem; 
    }

    .grade-box {
        align-items: center;
    }

    .grade-text{
        font-weight: 525;
        font-size: 40px;
        color: var(--app-color-degree-grade);
    }

    .grade-subtext{
        text-align: center;
        margin-top: -1em;
        color: var(--app-color-degree-subtext);
        font-size: 10px;
    }


</style>