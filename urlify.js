injectElement();
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    console.log(request);
    showUrlifyMessage(request);
});

function injectElement() {
    var urlifyContainer = document.createElement('div');
    urlifyContainer.id = "urlify-alert-id";
    urlifyContainer.className = "urlify-container";

    var urlifyAlert = document.createElement('div');
    urlifyAlert.className = "urlify-alert";

    urlifyContainer.appendChild(urlifyAlert);
    document.body.appendChild(urlifyContainer);
}

function showUrlifyMessage(message) {
    var target = document.getElementById("urlify-alert-id");
    if (!message) {
        target.children[0].style.backgroundColor = "#81C784";
        target.children[0].textContent = "生成短链接成功并复制到剪切板";
    } else {
        target.children[0].style.backgroundColor = "#E57373";
        target.children[0].textContent = message || "获取短链接失败请检查网络并重试";
    }
    urlifyFadeIn(target, 10);
    setTimeout(function() { urlifyFadeOut(target, 50) }, 1000);
}

function setUrlifyOpacity(elem, opacity) {
    if (elem.style.filter) { //IE
        elem.style.filter = 'alpha(opacity:' + opacity * 100 + ')';
    } else {
        elem.style.opacity = opacity;
    }
}

function urlifyFadeIn(elem, speed) {
    elem.style.display = "block";
    setUrlifyOpacity(elem, 0);

    var tempOpacity = 0;
    (function() {
        setUrlifyOpacity(elem, tempOpacity);
        tempOpacity += 0.05;
        if (tempOpacity <= 1) {
            setTimeout(arguments.callee, speed);
        }
    })();
}

function urlifyFadeOut(elem, speed) {
    elem.style.display = "block";
    var tempOpacity = 1;
    (function() {
        setUrlifyOpacity(elem, tempOpacity);
        tempOpacity -= 0.05;
        if (tempOpacity > 0) {
            setTimeout(arguments.callee, speed);
        } else {
            elem.style.display = "none"; //不可放在匿名函数外面会先执行。
        }
    })();
}