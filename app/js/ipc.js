window.ipcRenderer.on('pong', function(event,arg){
   console.log("ACCEPTED <PONG> arg=",arg);
   //document.write('<h1>POIONG!!:'+arg+'</h1>');
});

window.ipcRenderer.send('ping','hello');
