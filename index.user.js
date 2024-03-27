// ==UserScript==
// @name         Hasslich
// @namespace    https://example.com/ujs/hasslich
// @version      0.0.1
// @description  Fix for 65k people.
// @author       Alex Ho
// @match        https://schon.berlin/*
// @copyright    Alex Ho
// @license      MIT
// ==/UserScript==

/*
CHANGE LOG:
V1
- release
*/

(function() {
    'use strict';

    const S_WORD = `S` + `C` + `H` + `O` + `N`;

    // Force to collapse "free" banner
    const BANNER_KEY = `${S_WORD}_banner`;
    const BANNER_VALUE = `{"1":true}`;

    // Hide cookies banner
    const COOKIE_KEY = `${S_WORD.toLowerCase()}GDPRPanelClosed`;
    const COOKIE_VALUE = true;

    // Remove article paywall limit
    const PAYWALL_KEY = `${S_WORD}_config`;
    const PAYWALL_VALUE = `{"timestamp":${Math.floor(Date.now()/1000)},"history":[]}`;

    const ADS_BLOCK = `div[class*="PaywallBanner-module"]`;

    async function init() {
        navigation.addEventListener('navigate', () => {
            fixStorage();
            setTimeout(() => hideBanner, 1000);
        });

        const observer = new MutationObserver(mutations => {
            fixStorage();
            hideBanner();
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        fixStorage();
        hideBanner();
    }

    function fixStorage() {
        lsWrite(BANNER_KEY, BANNER_VALUE);
        lsWrite(COOKIE_KEY, COOKIE_VALUE);
        lsWrite(PAYWALL_KEY, PAYWALL_VALUE);
    }

    function hideBanner() {
        console.log('Trying to hide');
        const el = document.querySelector(ADS_BLOCK);
        if (el) {
            console.log('Trying to hide...done');
            el.style.visibility = 'hidden';
        }
    }

    function lsWrite(key, value) {
        localStorage.setItem(key, value);
        log(`Write ok: ${key} -- ${value}`);
    }

    function log(text) {
        console.log(`[H-SL-CH] ${text}`);
    }

    try {
        init().then();

    } catch (e) {
        console.log(e.message);
        throw e;
    }
})();
