// ==UserScript==
// @name        Agilix Buzz Enhancements
// @namespace   Violentmonkey Scripts
// @match       https://*.agilixbuzz.com/*
// @grant       none
// @version     0.0.3
// @author      cool_mineman
// @homepage    https://github.com/CoolMineman/AgilixBuzzEnhancements/tree/master/
// @homepageURL https://github.com/CoolMineman/AgilixBuzzEnhancements/tree/master/
// @downloadURL https://github.com/CoolMineman/AgilixBuzzEnhancements/raw/master/AgilixBuzzEnhancements.user.js
// @updateURL   https://github.com/CoolMineman/AgilixBuzzEnhancements/raw/master/AgilixBuzzEnhancements.user.js
// @supportURL  https://github.com/CoolMineman/AgilixBuzzEnhancements/issues
// @description Some simple changes to make Agilix Buzz more usable
// @run-at document-end
// ==/UserScript==

// Main Login Page
if (window.location.href.includes("agilixbuzz.com/login") || window.location.href.includes("agilixbuzz.com")) {
    // Open The Login Screen Automatically
    let waitUntilElementExists = (selector, callback) => {
        let el = document.querySelectorAll(selector)[0];

        if (el) {
            return callback(el);
        }

        setTimeout(() => waitUntilElementExists(selector, callback), 500);
    }
    waitUntilElementExists(".mat-button-wrapper", (el) => {
        console.log(el.innerHTML)
        if (el.innerHTML == "Login") {
            el.click();
        }
    })
}

// Bypass Strange Login Error
if (window.location.href.includes("https://api.agilixbuzz.com/SSOProcess")) {
    history.go(-3);
}

// Bypass Session Timeout
function reauth() {
    fetch("https://api.agilixbuzz.com/cmd?_token=" + JSON.parse(window.localStorage.session).token, {
        "credentials": "omit",
        "headers": {
            "Accept": "*/*",
            "Accept-Language": "en-US,en;q=0.5"
        },
        "referrer": window.location.toString(),
        "method": "OPTIONS",
        "mode": "cors"
    });
    fetch("https://api.agilixbuzz.com/cmd?_token=" + JSON.parse(window.localStorage.session).token, {
        "credentials": "omit",
        "headers": {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        "body": "{\"request\":{\"cmd\":\"extendsession\"}}",
        "method": "POST",
        "mode": "cors"
    });
    setTimeout(reauth, 10000)
}
reauth();