function onclick(info, tab) {
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
                sendMessageToContentScript();
            } else {
                sendMessageToContentScript(message);
            }
        }
    }
    xhr.send(data);
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

chrome.contextMenus.create({
    "title": "转换选中链接为短链接",
    "contexts": ["link"],
    "onclick": onclick
});

chrome.contextMenus.create({
    "title": "转换当前页面为短链接",
    "contexts": ["page"],
    "onclick": onclick
});