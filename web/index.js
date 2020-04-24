//原有调用方式
// document.getElementById('Btn_Start').addEventListener('click', function () {
//     top.ESChunk.start({
//         target: 'top',
//         // iframeId: 'iframe1',
//         contentIds: ['Content', 'Input1', 'Input2']
//     });
// });

// document.getElementById('Btn_End').addEventListener('click', function () {
//     top.ESChunk.stop();
// });




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

// setTimeout(_ => {
//     new ESChunk({
//         id: 'CHUNK_EVENT_DIV_002',
//         contentIds: ['Content', 'Input1', 'Input2']
//     })
// }, 3000);