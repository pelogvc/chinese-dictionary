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
            console.log(data);
            
            // db 저장
            Proxy.insertWord(data);

            // 창 오픈
            document.getElementById('chrome_extension_chinese_dictionary').classList.add('open');

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
                      <span>(비공식)<span>
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
    }

    const dic = new Dictionary();

    window.addEventListener('message', dic.run);

    document.addEventListener("mouseup", function(e) {

      // 이미 열려있는 뷰어 닫기
      window.parent.postMessage({ 'chinese_dictionary_window': 1 }, '*');

      // select된 텍스트 구하기
      const selected_text = document.getSelection().toString().trim();
      if ( !selected_text.length || !/^[\u4E00-\u9FA5]*$/.test(selected_text) ) { // 드래그 된 내용이 없거나 중국어가 아니면
          return false;
      }

      dic.run({ 'data' : { 'chinese_dictionary_word' : selected_text }});
    });
}());