# VNDB Visual Novel Hider (Optimized for Large Lists)

This userscript allows you to hide specific visual novels from VNDB tag pages, search results, and producer pages. It features persistent memory, theme-matching buttons, and optimizations for handling large lists.

## Installation

1. Install a userscript manager like [Tampermonkey](https://www.tampermonkey.net/) or [Violentmonkey](https://violentmonkey.github.io/).
2. Click [here](https://github.com/Kamikadashi/VNDB-Visual-Novel-Hider/raw/refs/heads/main/VNDB%20Visual%20Novel%20Hider%20(Optimized%20for%20Large%20Lists)-1.5.7.user.js) to install the script.
3. Refresh your VNDB pages.

## Usage

1. **Update Hidden Names**: Click the "Update Hidden Names" button at the bottom-right corner of the page. Enter the names of the visual novels you want to hide, separated by pipes (`|`).
2. **Toggle Visibility**: Click the "Hide: ON/OFF" button to toggle the visibility of the hidden visual novels.
3. The script will automatically hide/show the specified visual novels on tag pages, search results, and producer pages.

## Features

- **Persistent Memory**: Your list of hidden visual novels is saved in localStorage.
- **Theme-Matching Buttons**: Buttons automatically match the VNDB theme.
- **Optimized for Large Lists**: Efficiently handles large lists of hidden visual novels.

## Notes

- The script works on VNDB tag pages (`/g*`), search results (`/v?sq=*`), producer pages (`/p*`), and user list pages (`/u*/ulist?*`).
- If the page content changes (e.g., AJAX navigation), the script will re-run automatically.

Enjoy a cleaner VNDB browsing experience!
