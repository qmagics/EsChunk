ESChunkReady(function () {
    //重构后调用方式
    var ESChunk = top.ESChunk || ESChunk;

    var chunk = new ESChunk({
        id: 'CHUNK_EVENT_DIV_001',
        contentIds: ['Content', 'Content1', 'Content2']
    })

    document.getElementById('Btn_Start').addEventListener('click', function () {
        chunk.start();
    })

    document.getElementById('Btn_End').addEventListener('click', function () {
        chunk.stop();
    })
});