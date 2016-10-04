/**
 * This will be loaded before every other script in our browser window
 * and has full access to Node, even in nodeIntegration is set to false.
 * This provides interprocess communication without giving window full Node access.
 **/

window.ipcRenderer = require('electron').ipcRenderer;
