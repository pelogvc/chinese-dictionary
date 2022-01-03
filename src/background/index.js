let settings = {
  isEnabled: true,
}
let contentTabId = null;

// default settings for development environment
if (process.env.NODE_ENV === 'development') {
  settings = {
    isEnabled: true,
  }

  console.info('Extension initialized with settings: ', settings)
}

function loadSettings() {
  chrome.storage.sync.get((items) => {
    if (items.settings) settings = items.settings
  })
}

function saveSettings(updated) {
  if (updated) settings = updated

  chrome.storage.sync.set({
    settings,
  })
}

chrome.runtime.onMessage.addListener((message, sender) => {
  if (!settings.isEnabled) return

  console.log(message, settings)
  contentTabId = sender.tab.id;
})

chrome.runtime.onInstalled.addListener(() => {
  saveSettings()
})

loadSettings()

chrome.contextMenus.create({
  title: "네이버 중국어사전에서 '%s' 검색",
  contexts: ["selection"],
  onclick: (info) => {
    chrome.tabs.sendMessage(contentTabId, {
      name: 'chinese-dictionary-context-search',
      selectedText: info.selectionText,
    })
    return true;
  }
});
