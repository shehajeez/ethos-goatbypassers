// ==UserScript==
// @name         (GOATBYPASSERS) Ethos Adlinks Bypass
// @namespace    https://ethos.kys.gay
// @version      3.0
// @description  Bypasses adlinks using the Ethos API
// @author       shehajeez (from ethos team)
// @match        *://*.linkvertise.com/*/dynamic/?*
// @match        *://*.linkvertise.com/*/*
// @match        *://*.sub2unlock.com/*
// @match        *://*.sub2unlock.net/*
// @match        *://*.sub2unlock.io/*
// @match        *://*.sub4unlock.io/*
// @match        *://*.sub4unlock.com/*
// @match        *://*.rekonise.com/*
// @match        *://*.letsboost.net/*
// @match        *://*.mboost.me/a/*
// @match        *://*.socialwolvez.com/app/l/*
// @match        *://*.boost.ink/*
// @match        *://*.sub2get.com/link?l=*
// @match        *://*.valyse.best/verification?device_id=*
// @match        *://*.rebrand.ly/*
// @match        *://*.v.gd/*
// @match        *://*.tinyurl.com/*
// @match        *://*.is.gd/*
// @match        *://*.sub1s.com/*
// @match        *://*.tinylink.onl/*
// @match        *://*.mobile.codex.lol?token=*
// @match        *://*.mediafire.com/file/*/*/file
// @match        *://*.mediafire.com/file_premium/*/*/file
// @match        *://*.*/s?*
// @match        *://*.loot-link.com/s*
// @match        *://*.loot-links.com/s*
// @match        *://*.lootlinks.co/s*
// @match        *://*.lootdest.info/s*
// @match        *://*.lootdest.org/s*
// @match        *://*.links-loot.com/s*
// @match        *://*.linksloot.net/s*
// @match        *://*.lootlink.org/s*
// @match        *://*.lootdest.com/s*
// @exclude      *://*.linkvertise.com
// @exclude      *://*.sub2get.com
// @exclude      *://*.boost.ink
// @exclude      *://*.socialwolvez.com
// @exclude      *://*.mboost.me
// @exclude      *://*.letsboost.net
// @exclude      *://*.rekonise.com
// @exclude      *://*.sub2unlock.com
// @exclude      *://publisher.linkvertise.com/*
// @exclude      *://*.linkvertise.com/search*
// @exclude      *://*.linkvertise.com/login*
// @exclude      *://*.linkvertise.com/profile*
// @exclude      *://blog.linkvertise.com
// @exclude      *://blog.linkvertise.com/*
// @exclude      *://*.linkvertise.com/assets/vendor/*
// @exclude      *://publisher.linkvertise.com/*
// @exclude      *://*.link-mutation.linkvertise.com/*
// @exclude      *://*.linkvertise.com/assets/external/thinksuggest
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const currenturl = window.location.href;

    fetch('https://ethos.kys.gay/api/free/bypass?url=' + encodeURIComponent(currenturl))
        .then(response => response.json())
        .then(data => {
            if (data.result && ethosurl(data.result)) {
                console.log('redirecting to bypassed link / destination:', data.result);
                window.location.replace(data.result);
            } else {
                console.error('invalid url detected:', data.result);
                displayMessage(data.result);
            }
        })
        .catch(error => console.error('error:', error));

    function ethosurl(url) {
        const pattern = new RegExp('^(https?:\\/\\/)?'+
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+
        '((\\d{1,3}\\.){3}\\d{1,3}))'+
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+
        '(\\?[;&a-z\\d%_.~+=-]*)?'+
        '(\\#[-a-z\\d_]*)?$','i');
        return pattern.test(url);
    }

    function displayMessage(text) {
        const messageDiv = document.createElement('div');
        messageDiv.style.position = 'fixed';
        messageDiv.style.top = '50%';
        messageDiv.style.left = '50%';
        messageDiv.style.transform = 'translate(-50%, -50%)';
        messageDiv.style.backgroundColor = 'black';
        messageDiv.style.padding = '20px';
        messageDiv.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';
        messageDiv.style.zIndex = '9999';
        messageDiv.style.borderRadius = '8px';
        messageDiv.style.textAlign = 'center';
        messageDiv.style.width = '90%';
        messageDiv.style.maxWidth = '400px';
        messageDiv.style.boxSizing = 'border-box';
        messageDiv.style.animation = 'fadeIn 0.5s';

        const style = document.createElement('style');
        style.innerHTML = `
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
        `;
        document.head.appendChild(style);

        const messageText = document.createElement('p');
        messageText.style.color = 'red';
        messageText.innerText = 'Ethos detected that the destination for this link is not a valid URL. Click "Copy" to copy the result.';
        messageDiv.appendChild(messageText);

        const copyButton = document.createElement('button');
        copyButton.innerText = 'Copy';
        copyButton.style.padding = '10px 20px';
        copyButton.style.marginTop = '10px';
        copyButton.style.cursor = 'pointer';
        copyButton.style.borderRadius = '4px';
        copyButton.style.border = 'none';
        copyButton.style.backgroundColor = '#007bff';
        copyButton.style.color = '#fff';
        copyButton.addEventListener('click', () => {
            navigator.clipboard.writeText(text).then(() => {
                console.log("Copied: " + text);
            });
        });
        messageDiv.appendChild(copyButton);
        document.body.appendChild(messageDiv);
    }
})();
