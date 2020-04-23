//s 配置项--------------
//event元素对象ID
const CHUNK_EVENT_ID = 'CHUNK_EVENT_DIV_001';
const APP_ID = 'kjamadoeacefeepkbakojebokmfedkkh';

//心跳间隔
const tickInterval = 30;

//e 配置项--------------


//初始化
let timer = null;
const EventDiv = document.getElementById(CHUNK_EVENT_ID);

//添加开始侦听器 -- 部署时修改
EventDiv.addEventListener('Start', function () {
    if (timer) return;

    var options = JSON.parse(EventDiv.innerText);

    var ContentElements = [],
        doc = null;

    if (options.target === 'iframe') {
        doc = document.getElementById(options.iframeId).contentWindow.document;
    }
    else if (options.target === 'top') {
        doc = document;
    }

    if (options.contentIds && options.contentIds.length) {
        options.contentIds.forEach(id => {
            ContentElements.push(doc.getElementById(id));
        });
    }


    if (ContentElements.length > 0) {
        timer = setInterval(function () {

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
        }, tickInterval);
    }
})

//添加停止侦听器
EventDiv.addEventListener('Stop', function () {
    if (timer) {
        clearInterval(timer);
        timer = null;
    }
})