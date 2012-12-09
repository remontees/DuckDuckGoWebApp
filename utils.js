function _(strid) {
    var dict = JSON.parse(unescape('GETTEXT_DICT'));
    var lang = unsafeWindow.navigator.language; //TODO: came up with a better approach

    if (dict.hasOwnProperty(lang) && dict[lang].hasOwnProperty(strid)) {
        return dict[lang][strid];
    } else {
        return strid;
    }
}

/**
 * On Chrommium v18 (and maybe earlier versions) the click() function
 *  does not seem to work on otherwise proper DOM elements (that are supposed
 *  to support click() as per the spec), e.g. SPAN elements etc.
 */
function launchClickEvent(node) {
    var doclick = node.click ? node.click.bind(node) : function () {
            var e = unsafeWindow.document.createEvent('MouseEvents');
            e.initMouseEvent("click", true, true,
                            unsafeWindow, 1, 1, 1, 1, 1,
                            false, false, false, false, 0, node);
            node.dispatchEvent(e);
        };
    doclick();
}

function click(node) {
    var event = unsafeWindow.document.createEvent("MouseEvents");
    event.initMouseEvent("mousedown", true, true, unsafeWindow,
                         0, 0, 0, 0, 0,
                         false, false, false, false,
                         0, null);
    node.dispatchEvent(event);

    event = unsafeWindow.document.createEvent("MouseEvents");
    event.initMouseEvent("mouseup", true, true, unsafeWindow,
                         0, 0, 0, 0, 0,
                         false, false, false, false,
                         0, null);
    node.dispatchEvent(event);
}

function evalInPageContext(func) {
    var script = document.createElement('script');
    script.appendChild(document.createTextNode('(' + func + ')();'));
    (document.body || document.head || document.documentElement).appendChild(script);
}

function makeRedirector(link) {
    return function () {
        evalInPageContext('function() {window.location = "' + link + '";}');
    };
}

function wrapCallback(callback) {
    return function () {
        try {
            callback.apply(window, arguments);
        } catch (x) {
            console.log(x);
        }
    };
}

var MAX_PINS = 10;
var FAVORITES = '____unity_favorites';
function addFavoritesInLauncher(links) {
    var i;
    if (!links) {
        return;
    }

    Unity.Launcher.removeActions();
    links.sort(function (a, b) {
        if (a.count > b.count) {
            return -1;
        }
        if (a.count < b.count) {
            return 1;
        }
        return 0;
    });

    links.splice(MAX_PINS);

    for (i = 0; i < links.length; i++) {
        if (links[i].name) {
            Unity.Launcher.addAction(links[i].name, makeRedirector(links[i].url));
        }
    }
}

if (!window.reportTestState) {
    window.reportTestState = function (msg) {
        console.log(msg);
    };
}

function linkVisited(url, name, second) {
    if (!name) {
        return;
    }

    var i, links = localStorage.getItem(FAVORITES);
    if (!links) {
        links = [];
        if (!second) {
            setTimeout(wrapCallback(function () {
                linkVisited(url, name, true);
            }), 1000);
            return;
        }
    } else {
        links = JSON.parse(links);
    }

    var obj = null;

    for (i = 0; i < links.length; i++) {
        if (links[i].url === url) {
            obj = links[i];
        }
    }
    if (!obj) {
        obj = { url: url, name: name, count: 0 };
        links.push(obj);
    }
    obj.count++;

    localStorage.setItem(FAVORITES, JSON.stringify(links));
    addFavoritesInLauncher(links);
}
