import './index.scss'

// eslint-disable-next-line func-names
(function() {
  class Dictionary {
    constructor() {
      // eslint-disable-next-line no-restricted-globals
      this.isInIframe = top !== self;
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
                </h1>
            </div>
            <div class="content">
            <div>
        </div>
      `);
    }

    // 부모페이지 찾아간다
    run(e) {
      if ( !e.data || !( e.data.chinese_dictionary_window || e.data.chinese_dictionary_word ) ) {
          return;
      }

      // 창 닫으라는 메세지면
      if ( e.data.chinese_dictionary_window === 1 ) {
        if ( this.isInIframe ) {
          window.parent.postMessage({ 'chinese_dictionary_window': 1 }, '*');
        }else{
          const element = document.getElementById('chrome_extension_chinese_dictionary');
          // eslint-disable-next-line valid-typeof
          if ( element && typeof element.classList.contains('open') !== null ) {
            element.classList.remove('open');
          }
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

      this.createDic();
      document.getElementById('chrome_extension_chinese_dictionary').classList.add('open');

      if (!e.data || !e.data.chinese_dictionary_word) {
        return;
      }

      document.querySelector('#chrome_extension_chinese_dictionary .content').innerHTML = `
        <iframe
          src="${chrome.extension.getURL('search.html')}?search=${e.data.chinese_dictionary_word}"
        />
      `;
    }
  }

  const dic = new Dictionary();

  window.addEventListener('message', dic.run);

  document.addEventListener("mouseup", () => {

    // select된 텍스트 구하기
    const selectedText = document.getSelection().toString().trim();
    if (!selectedText.length || !/^[\u4E00-\u9FA5]*$/.test(selectedText)) { // 드래그 된 내용이 없거나 중국어가 아니면
      window.parent.postMessage({ 'chinese_dictionary_window': 1 }, '*');
      return false;
    }

    dic.run({ 'data': { 'chinese_dictionary_word': selectedText } });

    return true;
  });
}());
