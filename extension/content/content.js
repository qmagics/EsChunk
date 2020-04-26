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

                // console.log('getWeight');
            }, this._tickInterval);
        }
    }

    onChunkStop() {
        if (this._timer) {
            clearInterval(this._timer);
            this._timer = null;
        }
    }

    onDestroy() {
        console.log('EsChunkPlugin Destroyed')
        this._eventDiv.removeEventListener('chunk_start', this.onChunkStart);
        this._eventDiv.removeEventListener('chunk_stop', this.onChunkStop);

        if (this._timer) {
            clearInterval(this._timer);
            this._timer = null;
        }
    }

    get id() {
        return this._id;
    }
}

//储存已经创建的EsChunkPlugin
class PluginsManager {
    storeMap = {

    };

    create(options) {
        const { id } = options;

        const sameNamePlg = this.storeMap[id];

        if (sameNamePlg) {
            sameNamePlg.onDestroy();
            this.storeMap[id] = new EsChunkPlugin(options);
        }
        else {
            const plg = new EsChunkPlugin(options);
            this.storeMap[id] = plg;
        }
    }
}

const pluginsManager = new PluginsManager();

//初始化
(function () {
    const ES_Chunk_Div = document.getElementById('ES_Chunk_Dispatch_Event_Div');
    let options = JSON.parse(ES_Chunk_Div.innerText || null);

    if (ES_Chunk_Div) {
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

        pluginsManager.create(options);
    }

    runPageScripts('onESChunkContentScriptReady();')
})();

function runPageScripts(script) {
    var oldNode = document.getElementById('content_script');
    if (oldNode) {
        document.body.removeChild(oldNode);
    }

    var scriptNode = document.createElement("script");
    scriptNode.id = 'content_script';
    scriptNode.text = script;
    document.body.appendChild(scriptNode);
};

//需要监听插件被关闭事件，用来清理缓存，取消对app的消息通讯
//...待完善