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

      const db = new Dexie('chinese-dictionary');
      db.version(3).stores({
        wordbook: `++id, query, created, examples, means, [query+created]`
      });

      let currentDate = new Date();
      let latestDate = new Date();
      latestDate.setMinutes((currentDate.getMinutes() -5));

      let returnData = {
        query: data.query,
        created: currentDate,
        examples: [],
        means: [],
      }

      // api v3

      data.searchResultMap.searchResultListMap.EXAMPLE.items.map((value, i) => {
        returnData.examples.push({
          langType: value.exampleLangCode,
          entry: value.expEntry,
          exampleZh: value.expExample1,
          examplePinyin: value.expExample1Pronun,
          exampleKo: value.expExample2,
          sourceDictnameKO: value.sourceDictnameKO,
          sourceDictnameOri: value.sourceDictnameOri,
          sourceDictnameURL: value.sourceDictnameURL,
        })
      })

      data.searchResultMap.searchResultListMap.WORD.items.map((value, i) => {
        let ret = {
          langType: value.languageCode,
          entry: value.handleEntry,
          sourceDictnameKO: value.sourceDictnameKO,
          sourceDictnameOri: value.sourceDictnameOri,
          sourceDictnameURL: value.sourceDictnameURL,
          destinationLink: value.destinationLink,
          destinationLinkKo: value.destinationLinkKo,
          meansCollector: [],
          phoneticSymbol: [],
        }
        value.meansCollector.map((v, k) => {
          let collectorRet = {
            partOfSpeech: v.partOfSpeech,
            means: []
          }
          v.means.map((mean, j) => {
            collectorRet.means.push({
              code: mean.code,
              exampleOri: mean.exampleOri,
              value: mean.value,
            })
          })
          ret.meansCollector.push(collectorRet)
        })
        value.searchPhoneticSymbolList.map((v, k) => {
          let symbolRet = {
            phoneticSymbolType: v.phoneticSymbolType,
            phoneticSymbol: v.phoneticSymbol,
            phoneticSymbolPath: v.phoneticSymbolPath
          }
          ret.phoneticSymbol.push(symbolRet)
        })
        returnData.means.push(ret)
      });



      db.table('wordbook').where('[query+created]').between([data.query, latestDate], [data.query, currentDate]).toArray().then(function (cursor) {
        if ( !cursor.length ) {
          db.table('wordbook').add(returnData);
        }
      });
      
      // backup
      /*
      db.table('wordbook').reverse().toArray().then(function (array) {
        let json = JSON.stringify(array);
        console.log(json);
      });
      */

    });
  } 
  return;
});