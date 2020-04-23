(function (win) {
    if (!win) { console.warn('缺少window对象，无法初始化串口对象'); return; }

    //配置项
    const CHUNK_EVENT_ID = 'CHUNK_EVENT_DIV_001';

    //初始化事件元素
    var EventDiv = document.createElement('div');
    EventDiv.style.display = 'none';
    EventDiv.style.visibility = 'hidden';
    EventDiv.style.opacity = 0;
    document.body.appendChild(EventDiv);
    EventDiv.id = CHUNK_EVENT_ID;

    //初始化事件
    var StartEvent = document.createEvent('Event');
    StartEvent.initEvent('Start', true, true);

    var StopEvent = document.createEvent('Event');
    StopEvent.initEvent('Stop', true, true);

    //添加方法
    if (!win.ESChunk) {
        win.ESChunk = {
            start: function (options) {
                EventDiv.innerText = JSON.stringify(options || {});
                EventDiv.dispatchEvent(StartEvent);
            },
            stop: function () {
                EventDiv.dispatchEvent(StopEvent);
            }
        }
    } else {
        console.warn('初始化失败, 请勿重复添加串口对象');
    }

})(window);