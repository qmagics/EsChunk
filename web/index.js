document.getElementById('Btn_Start').addEventListener('click', function () {
    top.ESChunk.start({
        target: 'top',
        // iframeId: 'iframe1',
        contentIds: ['Content', 'Input1', 'Input2']
    });
});

document.getElementById('Btn_End').addEventListener('click', function () {
    top.ESChunk.stop();
});