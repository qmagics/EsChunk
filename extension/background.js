// console.log('Extension BackgroundJS');

const APP_ID = 'kjamadoeacefeepkbakojebokmfedkkh';

//获取本地存储的配置信息
function getConfig() {
    return {
        PORT_NAME: localStorage.getItem('ESChunk__PORTNAME') || 'Prolific USB-to-Serial Comm Port',

        BITRATE: Number(localStorage.getItem('ESChunk__BITRATE')) || 2400,
    };
}

function setConfig(config) {
    const { PORT_NAME, BITRATE } = config;

    localStorage.setItem('ESChunk__PORTNAME', PORT_NAME);
    localStorage.setItem('ESChunk__BITRATE', BITRATE);
}

//获取设备列表供用户选择连接哪一个
function getDevices(cb) {
    chrome.runtime.sendMessage(APP_ID, { type: 'GET_DEVICES' }, function (devices) {
        console.log('所有设备列表', devices);
        cb && cb(devices);
    })
}

//让app开始监听端口
function connectPort() {
    const config = getConfig();
    chrome.runtime.sendMessage(APP_ID, { type: 'CONNNECT_PORT', value: config }, function (bl) {

    })
}

//重启App
function reloadApp(cb) {
    chrome.runtime.sendMessage(APP_ID, { type: 'RELOAD' }, function (bl) {
        cb(bl);
        setTimeout(() => {
            connectPort();
        }, 100);
    })
}
connectPort();


// chrome.management.launchApp(APP_ID, function () {
    //     connectPort();
    // });

// console.log(chrome);

// chrome.management.get(APP_ID,function(ExtensionInfo){
//     console.log(ExtensionInfo)
// });

// chrome.management.launchApp(APP_ID, function () {
//     connectPort();
// });
