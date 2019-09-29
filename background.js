chrome.extension.onConnect.addListener(function(port) {
    if (port.name === 'Proxy_XHR') {
      port.onMessage.addListener(function(xhrOptions) {
        var xhr = new XMLHttpRequest();
        xhr.open(xhrOptions.method || "GET", xhrOptions.url, true);
        xhr.setRequestHeader('accept', 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8');
        //xhr.setRequestHeader('accept-encoding', 'gzip, deflate, br');
        xhr.setRequestHeader('accept-language', 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7,zh-CN;q=0.6,zh;q=0.5');
        xhr.setRequestHeader('upgrade-insecure-requests', '1');
        xhr.setRequestHeader('cache-control', 'max-age=0');
        //xhr.setRequestHeader("user-agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36");
        xhr.onreadystatechange = function() {
          if (this.readyState == 4) {
            port.postMessage({
              status : this.status,
              data   : this.responseText,
              xhr    : this
            });
          }
        }
        xhr.send();
      });
  }
  if (port.name === 'Proxy_recentlyWord') {

    port.onMessage.addListener(function(data) {

      if ( !data || !data.query ) return;

      const db = new Dexie('dictionary');
      db.version(1).stores({
          recentlyWords: `++id, query, created, title, url, [query+created]`
      });

      var currentDate = new Date();
      var latestDate = new Date();
      latestDate.setMinutes((currentDate.getMinutes() -5));

      db.table('recentlyWords').where('[query+created]').between([data.query, latestDate], [data.query, currentDate]).toArray().then(function (cursor) {
        if ( !cursor.length ) {
          db.table('recentlyWords').add(Object.assign(data, {
            created: currentDate,
          }));
        }
      });
      

      // backup
      /*
      db.table('recentlyWords').reverse().offset(0).limit(1).toArray().then(function (array) {
        let json = JSON.stringify(array);
        console.log(json);
      });
      */

    });
  } 
  return;
});