(function() {
    'use strict';
    class Proxy {

        static xhr(url) {
            let port     = chrome.extension.connect({ name: 'Proxy_XHR' });
            let settings = {
              method : 'GET',
              url    : url
            };
            let onSuccess;
            let onFailure;
            let self = {
              onSuccess: function (callback) {
                onSuccess = callback;
                return self;
              },
              onFailure: function (callback) {
                onFailure = callback;
                return self;
              }
            };
            port.onMessage.addListener(function (msg) {
              if (msg.status === 200 && typeof onSuccess === 'function') {
                onSuccess(msg.data, msg.xhr);
              } else if (typeof onFailure === 'function') {
                onFailure(msg.data, msg.xhr);
              }
            });
            port.postMessage(settings);
            return self;
        }

        static insertWord(object) {
            let port = chrome.extension.connect({ name: 'Proxy_recentlyWord' });
            port.postMessage(object);
            return true;
        }
    }

    class Dictionary {

      constructor() {
        this.isInIframe = top !== self; // 최상위 부모 프레임인지?
      }

      parser(word) {
        this.createDic();

        // api before
        //Proxy.xhr('https://zh.dict.naver.com/cndictApi/search/all?sLn=ko&q=' + encodeURIComponent(word) + '&mode=pc&pageNo=1&format=json&hid=153989713248236640')

        // api v3
        Proxy.xhr(`https://zh.dict.naver.com/api3/zhko/search?query=${encodeURIComponent(word)}&m=pc&lang=ko&articleAnalyzer=true&hid=156982484709810140`)
          .onSuccess(function (data) {
            data = JSON.parse(data);
            
            // db 저장
            Proxy.insertWord(data);

            // 창 오픈
            document.getElementById('chrome_extension_chinese_dictionary').classList.add('open');

            const words  = data.searchResultMap.searchResultListMap.WORD.items;
            // 그리기
            let ret = `<ul class='words'>`;

            // 단어
            for (let word of words) {

              if ( word.destinationLinkKo ) // 링크가 있으면
                ret += `<li><p><a href="` + word.destinationLinkKo + `" target="_blank">` + word.handleEntry + `</a></p>`;
              else
                ret += `<li><p>` + word.handleEntry + `</p>`;

              // pinyin
              try {
                ret += `<span>[` + word.searchPhoneticSymbolList[0].symbolValue + `]</span>`;
              }catch(e) {}

              // 소리
              try {
                const audio = `https://learn.dict.naver.com/tts?speaker=zh_cn&service=today-conversation&domain=naver&from=mobile&speech_fmt=mp3&text=${word.handleEntry}`;
                /*
                 * chrome extension 아닌경우에만 출력하도록함
                 * chrome extension에서는 inline script추가 불가능, addEventListener로 따로 처리해야함
                 */
                if (audio[0] && window.location.protocol !== 'chrome-extension:') {
                  // ret += `
                  //   <span class="audio" onclick="(function() {
                  //     const player = new Audio('${audio}');
                  //     player.play();
                  //   })();"><svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="volume-up" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" class="svg-inline--fa fa-volume-up fa-w-18 fa-2x"><path fill="currentColor" d="M215.03 71.05L126.06 160H24c-13.26 0-24 10.74-24 24v144c0 13.25 10.74 24 24 24h102.06l88.97 88.95c15.03 15.03 40.97 4.47 40.97-16.97V88.02c0-21.46-25.96-31.98-40.97-16.97zm233.32-51.08c-11.17-7.33-26.18-4.24-33.51 6.95-7.34 11.17-4.22 26.18 6.95 33.51 66.27 43.49 105.82 116.6 105.82 195.58 0 78.98-39.55 152.09-105.82 195.58-11.17 7.32-14.29 22.34-6.95 33.5 7.04 10.71 21.93 14.56 33.51 6.95C528.27 439.58 576 351.33 576 256S528.27 72.43 448.35 19.97zM480 256c0-63.53-32.06-121.94-85.77-156.24-11.19-7.14-26.03-3.82-33.12 7.46s-3.78 26.21 7.41 33.36C408.27 165.97 432 209.11 432 256s-23.73 90.03-63.48 115.42c-11.19 7.14-14.5 22.07-7.41 33.36 6.51 10.36 21.12 15.14 33.12 7.46C447.94 377.94 480 319.54 480 256zm-141.77-76.87c-11.58-6.33-26.19-2.16-32.61 9.45-6.39 11.61-2.16 26.2 9.45 32.61C327.98 228.28 336 241.63 336 256c0 14.38-8.02 27.72-20.92 34.81-11.61 6.41-15.84 21-9.45 32.61 6.43 11.66 21.05 15.8 32.61 9.45 28.23-15.55 45.77-45 45.77-76.88s-17.54-61.32-45.78-76.86z" class=""></path></svg></span>
                  // `;
                  ret += `
                    <a href='${audio}' class='audio' target='_blank'>
                      <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="volume-up" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" class="svg-inline--fa fa-volume-up fa-w-18 fa-2x"><path fill="currentColor" d="M215.03 71.05L126.06 160H24c-13.26 0-24 10.74-24 24v144c0 13.25 10.74 24 24 24h102.06l88.97 88.95c15.03 15.03 40.97 4.47 40.97-16.97V88.02c0-21.46-25.96-31.98-40.97-16.97zm233.32-51.08c-11.17-7.33-26.18-4.24-33.51 6.95-7.34 11.17-4.22 26.18 6.95 33.51 66.27 43.49 105.82 116.6 105.82 195.58 0 78.98-39.55 152.09-105.82 195.58-11.17 7.32-14.29 22.34-6.95 33.5 7.04 10.71 21.93 14.56 33.51 6.95C528.27 439.58 576 351.33 576 256S528.27 72.43 448.35 19.97zM480 256c0-63.53-32.06-121.94-85.77-156.24-11.19-7.14-26.03-3.82-33.12 7.46s-3.78 26.21 7.41 33.36C408.27 165.97 432 209.11 432 256s-23.73 90.03-63.48 115.42c-11.19 7.14-14.5 22.07-7.41 33.36 6.51 10.36 21.12 15.14 33.12 7.46C447.94 377.94 480 319.54 480 256zm-141.77-76.87c-11.58-6.33-26.19-2.16-32.61 9.45-6.39 11.61-2.16 26.2 9.45 32.61C327.98 228.28 336 241.63 336 256c0 14.38-8.02 27.72-20.92 34.81-11.61 6.41-15.84 21-9.45 32.61 6.43 11.66 21.05 15.8 32.61 9.45 28.23-15.55 45.77-45 45.77-76.88s-17.54-61.32-45.78-76.86z" class=""></path></svg>
                    </a>
                  `;
                }
              }catch(e) {}

              // 뜻
              ret += `<ul class="means">`;

              let index = 0;
              for (let meansCollector of word.meansCollector) {
                for(let mean of meansCollector.means) {
                  index++;
                  ret += `
                    <li>
                      <span class="index">${index}.</span>
                  `;
                  if ( meansCollector.partOfSpeech ) { // parts
                      ret += `<span class="parts">${meansCollector.partOfSpeech}</span>`;
                  }
                  // mean
                  ret += `
                      <span class="mean">${mean.value.replace(/(<([^>]+)>)/ig,"")}</span>
                    </li>
                  `;
                }
              }

              ret += `</ul>`;
              ret += `</li>`;

            }

            // 예문
            const examples  = data.searchResultMap.searchResultListMap.EXAMPLE.items;
            if ( typeof examples !== "undefined" ) {
              ret += `<ul class="example">`;
              for (let example of examples) {
                ret += `
                  <li>
                    <span class="example1">${example.expExample1}</span>
                    <span class="example1Pronun">${example.expExample1Pronun}</span>
                    <span class="example2">${example.expExample2}</span>
                  </li>
                `;
              }
              ret += `</ul>`;
            }

            if ( !examples.length && !words.length ) {
              ret += `
                <li class="nothing">
                  '${data.query}'에 대한 검색 결과가 없습니다.
                </li>
              `;
            }

            ret += `</ul>`;

            document.querySelector('#chrome_extension_chinese_dictionary .content').innerHTML = ret;
          })
          .onFailure(function () {
              return;
          });
        
      }

      createDic() {
        
        if ( document.getElementById('chrome_extension_chinese_dictionary') ) return;
        if ( this.isInIframe ) return;

        const element = document.body ? document.body : document.documentElement;

        element.insertAdjacentHTML("beforeend", `
          <div id="chrome_extension_chinese_dictionary">
              <div class="title">
                  <h1>
                      네이버 중국어사전
                      <!--<span>(비공식)<span>-->
                  </h1>
              </div>
              <div class="content">
              <div>
          </div>
        `);
      }
      
      // 사전 창 닫기
      clearDic() {
        const element = document.getElementById('chrome_extension_chinese_dictionary');
        if ( element && typeof element.classList.contains('open') !== null ) {
          element.classList.remove('open');
        }
      }

      // 부모페이지 찾아간다
      run = (e) => {

        if ( !e.data || !( e.data.chinese_dictionary_window || e.data.chinese_dictionary_word ) ) {
            return;
        }
    
        // 창 닫으라는 메세지면
        if ( e.data.chinese_dictionary_window === 1 ) {
          if ( this.isInIframe ) {
              window.parent.postMessage({ 'chinese_dictionary_window': 1 }, '*');
          }else{
            this.clearDic();
          }
          return;
        }
    
        const word = e.data.chinese_dictionary_word;
        if ( typeof word === 'undefined' ) return;
    
        // 아직도 부모가 있으면
        if ( this.isInIframe ) {
            window.parent.postMessage({ 'chinese_dictionary_word': word }, '*');
            return;
        }
    
        this.parser(word);
      }

      isInDictionary = (el) => {

        const parentSelector = document;
        let parents = [];
        let p = el.parentNode;
    
        while (p !== parentSelector) {
            let o = p;
            parents.push(o);
            p = o.parentNode;
        }
        parents.push(parentSelector); 

        return parents.some(element => element.id === 'chrome_extension_chinese_dictionary');

      }
    }

    const dic = new Dictionary();

    window.addEventListener('message', dic.run);

    document.addEventListener("mouseup", function(e) {

      // 이미 열려있는 뷰어 닫기
      if ( !dic.isInDictionary(e.target) ) {
        window.parent.postMessage({ 'chinese_dictionary_window': 1 }, '*');
      }


      // select된 텍스트 구하기
      const selected_text = document.getSelection().toString().trim();
      if ( !selected_text.length || !/^[\u4E00-\u9FA5]*$/.test(selected_text) ) { // 드래그 된 내용이 없거나 중국어가 아니면
          return false;
      }

      dic.run({ 'data' : { 'chinese_dictionary_word' : selected_text }});
    });

    try {
      const popupButton = document.getElementById('chrome_extension_chinese_tab_submit');
      const popupInput = document.getElementById('chrome_extension_chinese_tab_input');

      function popupSearch() {
        try {
          const value = popupInput.value.trim();
          if ( !value ) {
            return;
          }

          dic.run({ 'data' : { 'chinese_dictionary_word' : value }});
        }catch(e){}
      }

      popupButton.addEventListener('click', popupSearch, false);
      popupInput.addEventListener('keyup', function(e) {
        if(e.keyCode === 13) { //enter
          popupSearch();
        }
      })
    }catch(e){}
}());