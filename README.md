# API Mapper - Edge Extension

A Microsoft Edge extension that tracks API calls from `localhost:3000` to `localhost:3001` and exports them to Excel.

## Features

- Automatically tracks all API calls from localhost:3000 to localhost:3001
- Displays tracked API calls in a clean, organized table
- Shows Location (URL), API endpoint, HTTP method, and timestamp
- Export data to Excel file with "Location" and "API" columns
- Clear tracked data with one click
- Badge counter showing total API calls tracked

## Installation

1. Open Microsoft Edge browser
2. Navigate to `edge://extensions/`
3. Enable "Developer mode" (toggle in the bottom left)
4. Click "Load unpacked"
5. Select the `api-mapping-extension` folder
6. The extension should now appear in your extensions list

## Usage

1. Open your application at `localhost:3000`
2. The extension will automatically track all API calls to `localhost:3001`
3. Click the extension icon in the toolbar to view tracked API calls
4. Click "Export to Excel" to download an Excel file with all tracked data
5. Click "Clear Data" to remove all tracked API calls
6. Click "Refresh" to reload the data

## Excel Export Format

The exported Excel file includes the following columns:
- **Location**: The URL from which the API call was made
- **API**: The API endpoint that was called
- **Method**: HTTP method (GET, POST, PUT, DELETE, etc.)
- **Timestamp**: When the API call was made

## File Structure

```
api-mapping-extension/
├── manifest.json       # Extension configuration
├── background.js       # Background service worker for tracking API calls
├── popup.html          # Extension popup UI
├── popup.js            # Popup logic and Excel export functionality
├── popup.css           # Popup styling
├── icon16.png          # Extension icon (16x16)
├── icon48.png          # Extension icon (48x48)
├── icon128.png         # Extension icon (128x128)
└── README.md           # This file
```

## Adding Custom Icons

The extension requires three icon sizes. You can create your own icons:
1. Create PNG images in the following sizes: 16x16, 48x48, and 128x128 pixels
2. Name them `icon16.png`, `icon48.png`, and `icon128.png`
3. Place them in the extension root folder

You can use any graphic design tool or online icon generators to create these icons.

## Technologies Used

- Chrome Extensions API (compatible with Edge)
- SheetJS (xlsx) for Excel file generation
- Vanilla JavaScript, HTML, and CSS

## Notes

- The extension only tracks requests when the origin is `localhost:3000` and the target is `localhost:3001`
- Data is stored locally using Chrome Storage API
- Data persists across browser sessions until manually cleared

## Troubleshooting

If the extension is not tracking API calls:
1. Make sure your application is running on exactly `localhost:3000`
2. Ensure API calls are being made to exactly `localhost:3001`
3. Check that the extension has proper permissions (reload the extension if needed)
4. Open the browser console (F12) and check for any error messages
5. Try reloading the extension from `edge://extensions/`

## License

This project is provided as-is for educational and development purposes.
# api-mapper
