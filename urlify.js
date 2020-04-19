injectElement();
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
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

function createQrcodeElement(){
    var urlifyQrcodeContainer = document.createElement('div');
    urlifyQrcodeContainer.id = "urlify-qrcode-id";
    urlifyQrcodeContainer.className = "urlify-qrcode";

    var urlifyClose = document.createElement('div');
    urlifyClose.className = "urlify-close";
    urlifyClose.innerHTML = "X";
    urlifyClose.onclick = function(){
       removeQrcodeElement();
    };
    urlifyQrcodeContainer.appendChild(urlifyClose);
    document.body.appendChild(urlifyQrcodeContainer);
}

function removeQrcodeElement() {
    var element = document.getElementById("urlify-qrcode-id");
    if(!!element) {
        element.outerHTML = "";
        delete element;   
    }
}


function showUrlifyMessage(message) {
    var target = document.getElementById("urlify-alert-id");
    if (!!message) {
        var msg = JSON.parse(message);
        if(msg.biz == 1) {
            if(msg.code == 1) {
                target.children[0].style.backgroundColor = "#81C784";
                target.children[0].textContent = msg.msg;
                urlifyFadeIn(target, 10);
                setTimeout(function() { urlifyFadeOut(target, 50) }, 1000);
            } else {
                target.children[0].style.backgroundColor = "#E57373";
                target.children[0].textContent = msg.msg || "获取短链接失败请检查网络并重试";
                urlifyFadeIn(target, 10);
                setTimeout(function() { urlifyFadeOut(target, 50) }, 1000);
            }
        } else if(msg.biz == 2){
            removeQrcodeElement();
            createQrcodeElement();
            new QRCode('urlify-qrcode-id', {
                              text: msg.msg,
                              width: 125,
                              height: 125,
                              colorDark : '#000000',
                              colorLight : '#ffffff',
                              correctLevel : QRCode.CorrectLevel.H
                        });
            urlifyFadeIn(document.getElementById("urlify-qrcode-id"), 10);
        }
    } else { 
        target.children[0].style.backgroundColor = "#E57373";
        target.children[0].textContent = "处理失败，请重试";
        urlifyFadeIn(target, 10);
        setTimeout(function() { urlifyFadeOut(target, 50) }, 1000);
    }
}

function setUrlifyOpacity(elem, opacity) {
    if (elem.style.filter) {
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