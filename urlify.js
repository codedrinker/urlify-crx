function onclick(info, tab) {
    var uri = info.linkUrl || info.pageUrl;
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "https://urlify.cn/chrome/extension", true);
    data = new FormData();
    data.append("url", uri);
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            var copyFrom = document.createElement("textarea");
            copyFrom.textContent = xhr.responseText;
            var body = document.getElementsByTagName('body')[0];
            body.appendChild(copyFrom);
            copyFrom.select();
            document.execCommand('copy');
            body.removeChild(copyFrom);
            alert("已经复制短链接到剪切板");
        }
    }
    xhr.send(data);
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