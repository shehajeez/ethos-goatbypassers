// ==UserScript==
// @name          Ethos (BYPASS.VIP SRC) LINKVERTISE BYPASSER
// @namespace     goatbypassers.xyz
// @version       1.9
// @description   Credits to BYPASS.VIP for the main script, modified it to use the Ethos API and changed a few messages, alerts. Credits to https://github.com/bypass-vip/userscript/blob/main/bypass-vip.user.js
// @match         *://*.linkvertise.com/*
// @match         *://linkvertise.com/*/*
// @include       *://*.linkvertise.com/*
// @homepageURL   https://goatbypassers.xyz
// @downloadURL   https://raw.githubusercontent.com/shehajeez/ethos-goatbypassers/main/linkvertisebypassuserscript.user.js
// @updateURL     https://raw.githubusercontent.com/shehajeez/ethos-goatbypassers/main/linkvertisebypassuserscript.user.js
// @icon          https://www.google.com/s2/favicons?domain=bypass.vip&sz=64
// @require       https://gist.github.com/raw/2625891/waitForKeyElements.js
// @run-at        document-idle
// @grant         GM_getValue
// @grant         GM_setValue
// @grant         GM_registerMenuCommand
// ==/UserScript==

(function() {
    'use strict';

    let autoBypass = GM_getValue('autoBypass', false);

    GM_registerMenuCommand('Toggle Auto Bypass', toggleAutoBypass);

    function toggleAutoBypass() {
        autoBypass = !autoBypass;
        GM_setValue('autoBypass', autoBypass);
        showNotification(`Auto Bypass is now ${autoBypass ? 'enabled' : 'disabled'}`);
    }

    function showNotification(message) {
        const notification = document.createElement('div');
        notification.innerText = message;
        notification.style.position = 'fixed';
        notification.style.bottom = '20px';
        notification.style.right = '20px';
        notification.style.backgroundColor = '#4169e1';
        notification.style.color = '#fff';
        notification.style.padding = '10px 20px';
        notification.style.borderRadius = '5px';
        notification.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        notification.style.fontSize = '14px';
        notification.style.zIndex = '1000';
        notification.style.transition = 'opacity 0.5s ease';
        notification.style.maxWidth = '90%';
        notification.style.wordWrap = 'break-word';
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => {
                notification.remove();
            }, 500);
        }, 3000);
    }

    showNotification(`Bypassing with Auto Bypass ${autoBypass ? 'enabled' : 'disabled'}`);

    function updateButton(buttonEl, buttonTextEl, data) {
        buttonEl.disabled = false;
        buttonEl.style.transition = 'background-color 0.5s ease';
        if (data.bypassed) {
            buttonEl.style.backgroundColor = '#4169e1';
            buttonEl.onclick = function(e) {
                e.stopPropagation();
                e.preventDefault();
                try {
                    new URL(data.bypassed);
                    window.location.href = data.bypassed;
                } catch (e) {
                    fetch('https://kairo-api.kys.gay/api/pastebin/create', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            content: data.bypassed
                        })
                    })
                    .then(response => response.json())
                    .then(result => {
                        if (result.success && result.paste) {
                            window.location.href = result.paste;
                        } else {
                            throw new Error('Failed to create Pastebin');
                        }
                    })
                    .catch(error => {
                        console.error('Error posting to Pastebin:', error);
                        showNotification('Failed to post content. Please try again.');
                    });
                }
            };
            updateButtonText(buttonTextEl);
            if (autoBypass) {
                buttonEl.click();
            }
            buttonTextEl.addEventListener('DOMSubtreeModified', () => updateButtonText(buttonTextEl));
            showNotification('Bypassed successfully! Check the icon of this Linkvertise link if you dont get redirected when you click on the button.');
        } else {
            buttonEl.style.backgroundColor = 'yellow';
            showNotification(data.message || 'Failed to bypass the link.');
        }
    }

    function updateButtonText(buttonTextEl) {
        if (buttonTextEl.innerText !== '🗝️ Click me for the result!') {
            buttonTextEl.innerText = '🗝️ Click me for the result!';
        }
    }

    waitForKeyElements(".lv-lib-button--primary", () => {
        const buttonEl = document.querySelector('.lv-lib-button--primary');
        const buttonTextEl = document.querySelector('[lv-lib-ellipsis="1"]');
        buttonEl.disabled = true;

        fetch(`https://et.goatbypassers.xyz/api/adlinks/bypass?url=${encodeURIComponent(window.location.href)}`)
            .then(response => response.json())
            .then(data => {
                updateButton(buttonEl, buttonTextEl, data);
            })
            .catch(err => {
                buttonEl.style.backgroundColor = 'red';
                showNotification('An error occurred while attempting to bypass your link: ' + err);
                console.error('Fetch Error:', err);
            });
    });
})();
