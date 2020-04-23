const getById = function (id) {
    return document.getElementById(id);
};

(function (bg) {
    if (!bg) {
        return;
    }

    const
        select_port = getById('port'),
        select_bitrate = getById('bitrate'),
        btn_refresh = getById('BtnRefresh'),
        btn_confirm = getById('BtnConfirm');

    //上次配置
    const { PORT_NAME, BITRATE } = bg.getConfig();

    setBitrateOptions(BITRATE);

    //设置波特率选项
    function setBitrateOptions(selected) {
        let option = null;
        [
            110,
            300,
            600,
            1200,
            2400,
            4800,
            9600,
            14400,
            19200,
            38400,
            56000,
            57600,
            115200,
            128000,
            230400,
            256000,
            460800,
            500000,
            512000,
            600000,
            750000,
            921600,
            1000000,
            1500000,
            2000000
        ].forEach(function (i) {
            option = document.createElement('option');
            option.value = i;
            option.text = i;

            if (selected === i) {
                option.selected = true;
            }
            select_bitrate.appendChild(option);
        })
    }

    //获取设备选项
    function getDevicesSelections() {
        bg.getDevices(function (devices) {
            select_port.innerHTML = '';

            let option = null;

            devices.forEach(i => {
                option = document.createElement('option');
                option.value = i.displayName;
                option.text = i.displayName;

                if (PORT_NAME === i.displayName) {
                    option.selected = true;
                }
                select_port.appendChild(option);
            });

        });
    }

    //刷新按钮
    btn_refresh.addEventListener('click', function () {
        getDevicesSelections();
    })

    //确认按钮
    btn_confirm.addEventListener('click', function () {
        btn_confirm.disabled = true;
        btn_confirm.innerText = '正在连接中，请稍候...';

        bg.setConfig({
            PORT_NAME: select_port.value,
            BITRATE: select_bitrate.value
        });

        bg.reloadApp(function (bl) {
            if (bl) {
                setTimeout(() => {
                    btn_confirm.disabled = false;
                    btn_confirm.innerText = '刷新连接';
                }, 1000);
            }
        });
    })

    getDevicesSelections();

})(chrome.extension.getBackgroundPage());
