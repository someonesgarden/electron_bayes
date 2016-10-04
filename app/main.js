const electron      = require('electron');
const app           = electron.app;
const BrowserWindow = electron.BrowserWindow;
const Menu          = electron.Menu;
const ipcMain       = electron.ipcMain;

if (process.env.NODE_ENV === 'development') {
  require('electron-debug')();
}

// Keep a global reference of the window object not to be garbage collected.
var mainWindow = null;

//ipc
ipcMain.on('set-represented-filename',
    function(event,filename){
      mainWindow.setRepresentedFilename(filename);
    });

ipcMain.on('main-window',function(event, windowActionName){
  console.log("windowAdction:"+windowActionName);
  if(windowActionName === 'restore'){
    mainWindow.unmaximize();
  }else{
    mainWindow[windowActionName]();
  }
});



function createWindow() {
  // Create the browser window.
    mainWindow = new BrowserWindow(
        {
          width: 1240,
          height: 520,
          webPreferences:{

          },
          frame:false
        });

    if (process.env.NODE_ENV === 'development') {
        mainWindow.openDevTools();
    }
    mainWindow.loadURL('file://' + __dirname + '/index.html');

    mainWindow.on('closed', function(){ mainWindow = null; });


    mainWindow.on('maximize', function(){
      mainWindow.webContents.send('maximized');
    });
    mainWindow.on('unmaximize', function(){
      mainWindow.webContents.send('restored');
    });
}

app.on('ready', function() {
  createWindow();
  installMenu();
});

app.on('window-all-closed', function(){
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function(){
  console.log("on activate");
  // re-create a window in the app when the dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});


function installMenu() {
  var template;

  if(process.platform == 'darwin') {
    template = [
      {
        label: 'texproofer',
        submenu: [
          {
            label: 'Quit',
            accelerator: 'Command+Q',
            click: function() { app.quit(); }
          },
        ]
      },
      {
        label: 'Window',
        submenu:[
          {
            label:'new window',
            click:function(){
              createWindow();
            }
          }
        ]
      },
      {
        label: 'View',
        submenu: [
          {
            label: 'Reload',
            accelerator: 'Command+R',
            click: function() { mainWindow.reload(); }
          },
          {
            label: 'Toggle Full Screen',
            accelerator: 'Ctrl+Command+F',
            click: function() { mainWindow.setFullScreen(!mainWindow.isFullScreen()); }
          },
        ]
      },
      {
        label: 'Edit',
        submenu: [
          {
            label: 'Undo',
            accelerator: 'Command+Z',
            role: 'undo'
          },
          {
            label: 'Redo',
            accelerator: 'Shift+Command+Z',
            role: 'redo'
          },
          {
            type: 'separator'
          },
          {
            label: 'Cut',
            accelerator: 'CmdOrCtrl+X',
            role: 'cut'
          },
          {
            label: 'Copy',
            accelerator: 'CmdOrCtrl+C',
            role: 'copy'
          },
          {
            label: 'Paste',
            accelerator: 'CmdOrCtrl+V',
            role: 'paste'
          },
          {
            label: 'Select All',
            accelerator: 'CmdOrCtrl+A',
            role: 'selectall'
          },
        ]
      }
    ];
  } else {
    template = [
      {
        label: '&View',
        submenu: [
          {
            label: '&Reload',
            accelerator: 'Ctrl+R',
            click: function() { mainWindow.reload(); }
          },
          {
            label: 'Toggle &Full Screen',
            accelerator: 'F11',
            click: function() { mainWindow.setFullScreen(!mainWindow.isFullScreen()); }
          },
        ]
      }
    ];
      mainWindow.setMenu(menu);
  }

  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu);
}
