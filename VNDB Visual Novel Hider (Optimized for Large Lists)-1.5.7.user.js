// ==UserScript==
// @name         VNDB Visual Novel Hider (Optimized for Large Lists)
// @namespace    http://tampermonkey.net/
// @version      1.5.7
// @description  Hide specific visual novels from VNDB tag pages, search results, and producer pages with persistent memory, theme-matching button, and optimizations for large lists
// @author       Your Name
// @match        https://vndb.org/g*
// @match        https://vndb.org/v?sq=*
// @match        https://vndb.org/v?q=*
// @match        https://vndb.org/v?cfil=*
// @match        https://vndb.org/p*
// @match        https://vndb.org/u*/ulist?*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    // Key for storing the list of names in localStorage
    const STORAGE_KEY = 'vndbHiddenNames';
    const TOGGLE_STATE_KEY = 'vndbToggleState';

    // Function to hide/show rows based on the list of names and the toggle state
    function toggleRows(names, hide) {
        const targetNames = new Set(names.map(name => name.toLowerCase()));

        // Handle tag pages, search results (v?sq=), and user list pages (u*/ulist?*)
        const rows = document.querySelectorAll('.browse.vnbrowse table.stripe tr, .browse.vnbrowse table.releases tr.vn, .browse.ulist table tr.vn, .browse.ulist table tr[id^="ulist_tr_v"]');
        rows.forEach(row => {
            let titleCell;
            if (window.location.href.includes('/u') && window.location.href.includes('/ulist')) {
                // Handle user list page structure
                titleCell = row.querySelector('.tc_title a');
            } else {
                // Handle other pages
                titleCell = row.querySelector('.tc_title a, td a');
            }
            if (titleCell && targetNames.has(titleCell.textContent.trim().toLowerCase())) {
                row.style.display = hide ? 'none' : '';
            }
        });

        // Handle producer pages (p[number])
        const producerRows = document.querySelectorAll('.releases tr.vn');
        producerRows.forEach(row => {
            const titleCell = row.querySelector('td a');
            if (titleCell && targetNames.has(titleCell.textContent.trim().toLowerCase())) {
                row.style.display = hide ? 'none' : '';
                // Hide/show all associated releases
                let nextRow = row.nextElementSibling;
                while (nextRow && !nextRow.classList.contains('vn')) {
                    nextRow.style.display = hide ? 'none' : '';
                    nextRow = nextRow.nextElementSibling;
                }
            }
        });
    }

    // Function to get the list of names from localStorage
    function getHiddenNames() {
        const storedNames = localStorage.getItem(STORAGE_KEY);
        return storedNames ? JSON.parse(storedNames) : [];
    }

    // Function to save the list of names to localStorage
    function saveHiddenNames(names) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(names.map(name => name.toLowerCase())));
    }

    // Function to get the toggle state from localStorage
    function getToggleState() {
        const storedState = localStorage.getItem(TOGGLE_STATE_KEY);
        return storedState ? JSON.parse(storedState) : true;
    }

    // Function to save the toggle state to localStorage
    function saveToggleState(state) {
        localStorage.setItem(TOGGLE_STATE_KEY, JSON.stringify(state));
    }

    // Function to prompt the user for a list of names
    function promptForNames() {
        const currentNames = getHiddenNames();
        const input = prompt("Enter the names of the visual novels you want to hide, separated by pipes (|):", currentNames.join(' | '));
        if (input) {
            const newNames = input.split('|').map(name => name.trim().toLowerCase());
            saveHiddenNames(newNames);
            return newNames;
        }
        return currentNames;
    }

    // Function to create a theme-matching button
    function createUpdateButton() {
        if (document.getElementById('vndb-hide-button')) return;

        const button = document.createElement('button');
        button.id = 'vndb-hide-button';
        button.textContent = 'Update Hidden Names';
        button.style.position = 'fixed';
        button.style.bottom = '20px';
        button.style.right = '20px';
        button.style.zIndex = '1000';
        button.style.padding = '10px';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';

        function updateButtonColors() {
            const bodyStyle = window.getComputedStyle(document.body);
            button.style.backgroundColor = bodyStyle.backgroundColor;
            button.style.color = bodyStyle.color;
            button.style.border = `1px solid ${bodyStyle.color}`;
        }

        updateButtonColors();
        const observer = new MutationObserver(updateButtonColors);
        observer.observe(document.body, { attributes: true, attributeFilter: ['style', 'class'], subtree: true });

        button.addEventListener('click', () => {
            const namesToHide = promptForNames();
            if (namesToHide && namesToHide.length > 0) {
                toggleRows(namesToHide, getToggleState());
            }
        });

        document.body.appendChild(button);
    }

    // Function to create the toggle visibility button
    function createToggleVisibilityButton() {
        if (document.getElementById('vndb-toggle-button')) return;

        const updateButton = document.getElementById('vndb-hide-button');
        if (!updateButton) return;

        const toggleButton = document.createElement('button');
        toggleButton.id = 'vndb-toggle-button';
        toggleButton.textContent = getToggleState() ? 'Hide: ON' : 'Hide: OFF';
        toggleButton.style.position = 'fixed';
        toggleButton.style.bottom = '20px';
        toggleButton.style.right = `${updateButton.offsetWidth + 40}px`; // 20px margin
        toggleButton.style.zIndex = '1000';
        toggleButton.style.padding = '10px';
        toggleButton.style.border = 'none';
        toggleButton.style.borderRadius = '5px';
        toggleButton.style.cursor = 'pointer';

        function updateToggleButtonColors() {
            const bodyStyle = window.getComputedStyle(document.body);
            toggleButton.style.backgroundColor = bodyStyle.backgroundColor;
            toggleButton.style.color = bodyStyle.color;
            toggleButton.style.border = `1px solid ${bodyStyle.color}`;
        }

        updateToggleButtonColors();
        const observer = new MutationObserver(updateToggleButtonColors);
        observer.observe(document.body, { attributes: true, attributeFilter: ['style', 'class'], subtree: true });

        let isHidden = getToggleState();

        toggleButton.addEventListener('click', () => {
            isHidden = !isHidden;
            saveToggleState(isHidden);
            toggleButton.textContent = isHidden ? 'Hide: ON' : 'Hide: OFF';
            toggleRows(getHiddenNames(), isHidden);
        });

        document.body.appendChild(toggleButton);
    }

    // Function to force update the visuals
    function forceUpdateVisuals() {
        const namesToHide = getHiddenNames();
        const isHidden = getToggleState();
        if (namesToHide && namesToHide.length > 0) {
            toggleRows(namesToHide, isHidden);
        }
    }

    // Main function to run the script
    function main() {
        forceUpdateVisuals();
        createUpdateButton();
        createToggleVisibilityButton();
    }

    // Run the script after the page has loaded
    window.addEventListener('load', main);

    // Re-run the script when the page content changes (e.g., AJAX navigation)
    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                main();
            }
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Immediately create the buttons if the page is already loaded
    if (document.readyState === 'complete') {
        createUpdateButton();
        createToggleVisibilityButton();
    } else {
        window.addEventListener('load', () => {
            createUpdateButton();
            createToggleVisibilityButton();
        });
    }
})();