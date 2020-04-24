// 重构前
// //清单对象
// const manifest = chrome.runtime.getManifest();

// //s 配置项--------------
// //event元素对象ID
// const APP_ID = manifest.externally_connectable.ids[0];

// const CHUNK_EVENT_ID = 'CHUNK_EVENT_DIV_001';

// //心跳间隔
// const tickInterval = 30;

// //e 配置项--------------


// //初始化
// let timer = null;
// const EventDiv = document.getElementById(CHUNK_EVENT_ID);

// //添加开始侦听器
// EventDiv.addEventListener('Start', function () {
//     if (timer) return;

//     var options = JSON.parse(EventDiv.innerText);

//     var ContentElements = [],
//         doc = null;

//     if (options.target === 'iframe') {
//         doc = document.getElementById(options.iframeId).contentWindow.document;
//     }
//     else if (options.target === 'top') {
//         doc = document;
//     }
//     else {
//         doc = document;
//     }

//     if (options.contentIds && options.contentIds.length) {
//         options.contentIds.forEach(id => {
//             ContentElements.push(doc.getElementById(id));
//         });
//     }

//     if (ContentElements.length > 0) {
//         timer = setInterval(function () {

//             chrome.runtime.sendMessage(APP_ID, { type: 'GET_WEIGHT' }, function (weight) {
//                 ContentElements.forEach(el => {
//                     try {
//                         el.innerHTML = weight;
//                     } catch (error) { }

//                     try {
//                         el.value = weight;
//                     } catch (error) { }
//                 });
//             })
//         }, tickInterval);
//     }
// })

// //添加停止侦听器
// EventDiv.addEventListener('Stop', function () {
//     if (timer) {
//         clearInterval(timer);
//         timer = null;
//     }
// })


// 重构后
const manifest = chrome.runtime.getManifest();

const APP_ID = manifest.externally_connectable.ids[0];

//EsChunk插件构造函数
class EsChunkPlugin {
    _id = '';
    _target = '';
    _iframeId = '';
    _tickInterval = 0;
    _contentIds = [];
    _timer = null;
    _eventDiv = null;

    constructor(options = {}) {
        const { id, target, iframeId, contentIds, tickInterval } = options;

        this._id = id;
        this._target = target;
        this._iframeId = iframeId;
        this._contentIds = contentIds;
        this._tickInterval = tickInterval || 30;
        this._eventDiv = this.getDoc().getElementById(this._id);

        this.init();
    }

    init() {
        console.log('EsChunkPlugin init')
        this._eventDiv.addEventListener('chunk_start', this.onChunkStart.bind(this));
        this._eventDiv.addEventListener('chunk_stop', this.onChunkStop.bind(this));
    }

    getDoc() {
        let doc = null;

        if (this._target === 'iframe') {
            doc = document.getElementById(this._iframeId).contentWindow.document;
        }
        else if (this._target === 'top') {
            doc = top.document;
        }
        else {
            doc = document;
        }

        return doc;
    }

    onChunkStart() {
        if (this._timer) return;

        let ContentElements = [];

        if (this._contentIds && this._contentIds.length) {
            this._contentIds.forEach(id => {
                ContentElements.push(this.getDoc().getElementById(id));
            })
        }

        if (ContentElements.length > 0) {
            this._timer = setInterval(_ => {
                chrome.runtime.sendMessage(APP_ID, { type: 'GET_WEIGHT' }, function (weight) {
                    ContentElements.forEach(el => {
                        try {
                            el.innerHTML = weight;
                        } catch (error) { }
                        try {
                            el.value = weight;
                        } catch (error) { }
                    });
                })
            }, this._tickInterval);
        }
    }

    onChunkStop() {
        if (this._timer) {
            clearInterval(this._timer);
            this._timer = null;
        }
    }
}

//初始化
(function () {
    const ES_Chunk_Div = document.getElementById('ES_Chunk_Dispatch_Event_Div');
    let options = JSON.parse(ES_Chunk_Div.innerText || null);
    let count = 0;

    if (ES_Chunk_Div) {

        //先判断一次Es_Chunk_Div是否有触发过New_ESChunk事件,因为dom加载完成后contentScript才触发，会存在漏掉的情况
        if (options) {
            OnNewESChunk();
        }

        ES_Chunk_Div.addEventListener('New_ESChunk', () => {
            OnNewESChunk();
        });
    }
    else {
        console.warn('ES_Chunk_Div不存在');
    }

    //客户端调用new ESChunk()
    function OnNewESChunk() {
        options = JSON.parse(ES_Chunk_Div.innerText || null);

        console.log('New_ESChunk的调用次数:', ++count);
        console.log('参数:', options);

        new EsChunkPlugin(options);
    }
})();
