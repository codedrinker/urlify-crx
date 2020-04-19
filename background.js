function shortenLink(info, tab) {
    var uri = info.linkUrl || info.pageUrl;
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "https://urlify.cn/chrome/extension", true);
    data = new FormData();
    data.append("url", uri);
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            var message = xhr.responseText;
            if (!!message && message.indexOf("http") != -1) {
                var copyFrom = document.createElement("textarea");
                copyFrom.textContent = xhr.responseText;
                var body = document.getElementsByTagName('body')[0];
                body.appendChild(copyFrom);
                copyFrom.select();
                document.execCommand('copy');
                body.removeChild(copyFrom);
                sendMessageToContentScript(createMessage(1,1,"生成短链接成功并复制到剪切板"));
            } else {
                sendMessageToContentScript(createMessage(1,0,message));
            }
        }
    }
    xhr.send(data);
}

function qrcode(info, tab) {
    var uri = info.linkUrl || info.pageUrl;
    sendMessageToContentScript(createMessage(2,1,uri));
}


function getCurrentTabId(callback) {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        if (callback) callback(tabs.length ? tabs[0].id : null);
    });
}

function sendMessageToContentScript(message, callback) {
    getCurrentTabId((tabId) => {
        chrome.tabs.sendMessage(tabId, message, function(response) {
            if (callback) callback(response);
        });
    });
}

function createMessage(biz, code, msg) {
    return JSON.stringify({
            "biz": biz,
            "code": code,
            "msg": msg
        });
}

chrome.contextMenus.create({
    "title": "为选中链接生成短链",
    "contexts": ["link"],
    "onclick": shortenLink
});

chrome.contextMenus.create({
    "title": "为选中链接生成二维码",
    "contexts": ["link"],
    "onclick": qrcode
});

chrome.contextMenus.create({
    "title": "为此页面生成短链",
    "contexts": ["page"],
    "onclick": shortenLink
});

chrome.contextMenus.create({
    "title": "为此页面生成二维码",
    "contexts": ["page"],
    "onclick": qrcode
});