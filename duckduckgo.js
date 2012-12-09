// ==UserScript==
//@include        http://duckduckgo.com
// @require        utils.js
// ==/UserScript==

var Unity = external.getUnityObject(1.0);

function unityReady() {
    Unity.addAction("http://duckduckgo.com/", function () {
       Unity.Notification.showNotification("Nouvelle recherche", "Vous vous apprêtez à lancer une nouvelle recherche.");
    });
    Unity.addAction("http://help.duckduckgo.com/customer/portal/articles/216441/", function() {
        Unity.Notification.showNotification("Installation de l'extension", "Vous cherchez actuellement à installer DuckDuckGo sur votre navigateur web.");
    });
    Unity.Launcher.addAction("Internet", internetActionCallback);
}

Unity.init({name: "DuckDuckGo",
            iconUrl: "http://duckduckgo.com/assets/logo_homepage.normal.v102.png",
            homepage: 'http://duckduckgo.com',
            domain: 'duckduckgo.com',
            onInit: unityReady});
