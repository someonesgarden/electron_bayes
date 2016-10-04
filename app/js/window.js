//const electron  = require('electron');
//const shell         = electron.shell;
//const ipcRenderer   = electron.ipcRenderer;

const osxPrefs  = require('electron-osx-appearance');
const topLogo   = document.querySelector('img.toplogo');
const platform = require('./platform');

document.body.classList.add('platform-' + platform.name);
if(platform.isMac){
    console.log("is Mac");
    if(osxPrefs.isDarkMode()){
        document.body.classList.add('platform-'+platform.name + '--dark');
    }
    osxPrefs.onDarkModeChanged(function(){
        console.log("onDarkModeChanged");
    });
}
///////////////////////////////////////////////////

var forEach = function(selector, callback){
    return [].forEach.call(document.querySelectorAll(selector), callback);
};

var actions = ['minimize', 'maximize', 'restore', 'close'];

forEach('.window-action', function(windowAction){
    windowAction.onclick = function(e){
        actions.forEach(function(actionName){
            var classNameSegment = actionName;
            if(windowAction.classList.contains('window-action-' + classNameSegment)){
                ipcRenderer.send('main-window', classNameSegment);
            }
        });
    };
});

ipcRenderer.on('maximized', function(){
    document.body.classList.add('window--is-maximised');
    document.querySelector('.window-action-wrapper-maximize').style.display = 'none';
    document.querySelector('.window-action-wrapper-restore').style.display = 'inherit';
});

ipcRenderer.on('restored', function(){
    document.body.classList.remove('window--is-maximised');
    document.querySelector('.window-action-wrapper-maximize').style.display = 'inherit';
    document.querySelector('.window-action-wrapper-restore').style.display = 'none';
});


topLogo.onclick = function(evt){
    var notification = new Notification("Welcome to Someonesgarden.org", {
        body:'[Click] to open website.',
        icon:'img/logo.png'
    });
    notification.onclick = function(){
        shell.openExternal('http://www.someonesgarden.org');
    }
}


///////////////////////////////////////