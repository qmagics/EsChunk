// (function (win) {
//     if (!win) { console.warn('缺少window对象，无法初始化串口对象'); return; }

//     //配置项
//     const CHUNK_EVENT_ID = 'CHUNK_EVENT_DIV_001';

//     //初始化事件元素
//     var EventDiv = document.createElement('div');
//     EventDiv.style.display = 'none';
//     EventDiv.style.visibility = 'hidden';
//     EventDiv.style.opacity = 0;
//     document.body.appendChild(EventDiv);
//     EventDiv.id = CHUNK_EVENT_ID;

//     //初始化事件
//     var StartEvent = document.createEvent('Event');
//     StartEvent.initEvent('Start', true, true);

//     var StopEvent = document.createEvent('Event');
//     StopEvent.initEvent('Stop', true, true);

//     //添加方法
//     if (!win.ESChunk) {
//         win.ESChunk = {
//             start: function (options) {
//                 EventDiv.innerText = JSON.stringify(options || {});
//                 EventDiv.dispatchEvent(StartEvent);
//             },
//             stop: function () {
//                 EventDiv.dispatchEvent(StopEvent);
//             }
//         }
//     } else {
//         console.warn('初始化失败, 请勿重复添加串口对象');
//     }

// })(window);

//重构
(function (global) {

    //创建一个事件派发元素，用于跟contentScript传递事件
    var ES_Chunk_Div = document.createElement('div');
    ES_Chunk_Div.style.display = 'none';
    ES_Chunk_Div.style.visibility = 'hidden';
    ES_Chunk_Div.style.opacity = 0;
    ES_Chunk_Div.id = 'ES_Chunk_Dispatch_Event_Div';
    document.body.appendChild(ES_Chunk_Div);

    //注册New_ESChunk事件
    var New_ESChunk_Event = document.createEvent('Event');
    New_ESChunk_Event.initEvent('New_ESChunk', true, true);

    //构造函数
    function ESChunk(params) {
        var params = params || {
            //默认id
            id: 'CHUNK_EVENT_DIV__DEFAULT',
            contentIds: []
        };

        this._id = params.id;
        this._contentIds = params.contentIds;
        this._iframeId = params.iframeId;
        this._target = params.target;

        this.init();

        //向contentScript传递 new ESChunk()事件
        ES_Chunk_Div.innerText = JSON.stringify(params);
        ES_Chunk_Div.dispatchEvent(New_ESChunk_Event);
    }

    var proto = ESChunk.prototype;

    proto.getDoc = function () {
        var doc = null;

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

    proto.init = function () {
        //初始化控制电子秤串口的事件对象
        this._eventDiv = document.createElement('div');
        this._eventDiv.style.display = 'none';
        this._eventDiv.style.visibility = 'hidden';
        this._eventDiv.style.opacity = 0;
        this._eventDiv.id = this._id;

        this.getDoc().body.appendChild(this._eventDiv);

        //注册开始事件
        this._startEvent = document.createEvent('Event');
        this._startEvent.initEvent('chunk_start', true, true);

        //注册停止事件
        this._stopEvent = document.createEvent('Event');
        this._stopEvent.initEvent('chunk_stop', true, true);
    }

    proto.start = function () {
        this._eventDiv.dispatchEvent(this._startEvent);
    }

    proto.stop = function () {
        this._eventDiv.dispatchEvent(this._stopEvent);
    }

    global.ESChunk = ESChunk;
})(this);