const remote    = electron.remote;
const dialog    = remote.require('electron').dialog;
const marked    = require('marked');
const fs        = require('fs');
const container             = document.querySelector('.container');
const openFileLink          = document.querySelector('a.open-file');
const saveFileLink          = document.querySelector('a.save-file');
const showFileInFolderLink  = document.querySelector('a.show-file-in-folder');
const openDLLink            = document.querySelector('a.open-download');
remote.app.clearRecentDocuments();

///////////////////

var currentFile = remote.getGlobal('fileToOpen') || null;
if(currentFile) {
    openFile(currentFile);
}

ipcRenderer.on('open-file', function(event, arg){
    openFile(arg);
});

marked.setOptions({
    gfm: true,
    tables: true,
    breaks: false,
    pedantic: false,
    sanitize: true,
    smartLists: true,
    smartypants: false
});

openDLLink.onclick = function(evt){
    console.log("Open Download click!");
    var downloads       = remote.app.getPath('downloads');
    shell.openItem(downloads);
}

openFileLink.onclick = function(evt){
    dialog.showOpenDialog({
        title: 'Select a file to edit',
        //defaultPath:'~/',
        filters: [
            { name: 'Markdown Documents', extensions: ['md', 'markdown'] }
        ]
    }, function(filenames){
        if (!filenames) return;
        if (filenames.length > 0) {
            openFile(filenames[0]);
            saveFileLink.classList.remove('hidden');
        }
    })
};

showFileInFolderLink.onclick = function(evt){
    shell.showItemInFolder(currentFile);
};


saveFileLink.onclick = function(evt){
    dialog.showOpenDialog({
        title: 'Select a place to save',
        properties: ['openDirectory']
    }, function(dirnames){
        if (!dirnames) return;
        if (dirnames.length > 0) {
            console.log(currentFile);
            var contents = editor.value;
            //var contents = clipboard.readText('selection');
            saveFile (dirnames[0], contents);
        }
    })
};

function openFile (filename) {

    document.title =filename;
    var contents = fs.readFileSync(filename);
    currentFile  = filename;
    editor.value = contents;

    container.classList.remove('hidden');
    remote.app.addRecentDocument(filename);

    /// app.js >> generatePreview()
    //generatePreview();

    ipcRenderer.send('set-represented-filename',filename);
}

function saveFile (dirname, content){
    console.log(dirname);
    var filename = dirname+'/README.md';
    fs.writeFile(filename, content, function(err){
        if (err) throw err;
        console.log('It\'s saved!');
    });
}
