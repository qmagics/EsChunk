// 初始化端口显示名称（COM 和 LPT）
const PORT_NAME = 'Prolific USB-to-Serial Comm Port';

// 初始化波特率
const BITRATE = 2400;

(function () {
    let
        //临时存储串口返回结果数组
        arr = [],

        //转译后的结果
        result = [],

        //是否连接中
        isConnected = false,

        //上次连接的id
        lastConnectionId = null,

        //端口显示名称
        portName = '',

        //波特率
        bitrate = 0;

    function connectPortByName(name) {
        //获取所有设备并查找需要连接的设备
        chrome.serial.getDevices(function (ports) {
            for (let i = 0; i < ports.length; i++) {
                const port = ports[i];

                if (port.displayName === portName) {
                    connectPortByPath(port.path);
                    break;
                }
            }
        })
    }

    //尝试连接串口
    function connectPortByPath(path) {
        console.log('path:', path);

        chrome.serial.connect(path, {
            bitrate: bitrate,
            name: '电子秤'
        }, onConnect);
    }

    //连接串口成功回调
    function onConnect(connectionInfo) {

        console.log('connectionInfo:', connectionInfo)

        isConnected = true;
        try {
            lastConnectionId = connectionInfo.connectionId;
        } catch (error) {
        }

        chrome.serial.onReceive.addListener(onReceiveCallback);
    }

    //接收串口返回数据回调
    function onReceiveCallback(info) {
        let char = convertArrayBufferToString(info.data);
        arr.push(char);
        if (char == ')') {
            if (arr.length >= 14) {
                result = [...arr];
            }
            arr = [];
        }
    }

    //开始接收插件发来的消息
    chrome.runtime.onMessageExternal.addListener(function (msg, sender, sendResponse) {
        if (msg) {
            switch (msg.type) {
                case 'CONNNECT_PORT':

                    const { PORT_NAME, BITRATE } = msg.value;

                    portName = PORT_NAME;
                    bitrate = BITRATE;

                    connectPortByName();
                    sendResponse(true);

                    break;

                case 'GET_WEIGHT':
                    var weight = result.join('').replace('=', '').replace('↵', '').replace('(kg)', '');
                    sendResponse(weight);
                    break;

                case 'RELOAD':
                    if (lastConnectionId) {
                        chrome.serial.disconnect(lastConnectionId, function (bl) {
                            if (bl) {
                                console.log('APP重启');
                                sendResponse(true);
                                chrome.runtime.reload();
                            }
                        });
                    }
                    else {
                        // console.log('APP重启');
                        sendResponse(true);
                        chrome.runtime.reload();
                    }

                    break;

                case 'GET_DEVICES':
                    // console.log('获取设备列表');

                    chrome.serial.getDevices(function (ports) {
                        sendResponse(ports);
                    })

                    break;

                default:
                    break;
            }

            return true;
        }
    });

    //连接
    // chrome.runtime.onInstalled.addListener(function (info) {
    //     console.log('onInstalled:', info);
    // })

    console.log(chrome);

})();

//工具函数
function convertArrayBufferToString(buf) {
    var bufView = new Uint8Array(buf);
    var encodedString = String.fromCharCode.apply(null, bufView);
    return encodedString;
}