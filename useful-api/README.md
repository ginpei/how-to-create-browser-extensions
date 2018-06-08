# 使えそうなAPIの紹介

簡単に。

### 情報を保存する

`storage.local.get()` と `storage.local.set()` を。

`"permissions"` の設定をお忘れなく。

- [storage.local - Mozilla | MDN](https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/storage/local)
- [StorageArea.get() - Mozilla | MDN](https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/storage/StorageArea/get)
- [StorageArea.set() - Mozilla | MDN](https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/storage/StorageArea/set)

3種類あるけど、とりあえず `storage.local` で良さそう。

- `storage.local` - 端末単位に保存される情報。何も考えずに使える
- `storage.sync` - ログインして端末間で共有される情報っぽい。Firefoxはひと手間ある
- `storage.managed` - 実質 `manifest.json` で定義する情報を読む専用っぽい。別途 [`runtime.getManifest()`](https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/runtime/getManifest) もある。

あと `await` 使う場合はその外側が `async` になっている必要があります。

```js
(async () => {
  const message = document.querySelector('#message');

  // 最初に読み込み
  const result = await browser.storage.local.get(['message']);
  message.value = '2';
  message.value = result.message || 'Hello World!';

  // 変更あれば書き込み
  message.addEventListener('input', async () => {
    browser.storage.local.set({ message: message.value });
  });
})();
```

### 見ているページに挿入する

特定のページ、あるいは全ページにJSファイルやCSSファイルを挿入する場合は、 `manifest.json` の `content_scripts` を使う。

- [content_scripts - Mozilla | MDN](https://developer.mozilla.org/ja/Add-ons/WebExtensions/manifest.json/content_scripts)

スクリプトからコードを生成して実行する場合、あるいはJSファイルやCSSファイルを挿入する場合は `tabs.executeScript()` や `tabs.insertCSS()` を使う。いずれも `manifest.json` の `"permissions"` で `"activeTab"` を許可する。

- [tabs.executeScript() - Mozilla | MDN](https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/tabs/executeScript)
- [tabs.insertCSS() - Mozilla | MDN](https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/tabs/insertCSS)
- [permissions - Mozilla | MDN](https://developer.mozilla.org/ja/Add-ons/WebExtensions/manifest.json/permissions)

挿入したファイルからブラウザー拡張が持つファイルにアクセスする場合（画像を表示するとか）、 `manifest.json` で `web_accessible_resources` を使ってアクセス権の設定が必要。

- [web_accessible_resources - Mozilla | MDN](https://developer.mozilla.org/ja/Add-ons/WebExtensions/manifest.json/web_accessible_resources)

### 設定画面

`manifest.json` の `options_ui` を使う。

- [options_ui - Mozilla | MDN](https://developer.mozilla.org/ja/Add-ons/WebExtensions/manifest.json/options_ui)

ちなみに `options_page` というのもある。

### 拡張専用の任意ページ

`tabs.create()` で、 `url` の指定を `/` から始めて任意のHTMLファイル等を指定する。

- [tabs.create() - Mozilla | MDN](https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/tabs/create)

### `manifest.json` の情報を得る

`runtime.getManifest()` を使う。

- [runtime.getManifest() - Mozilla | MDN](https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/runtime/getManifest)

### スクリプト間でやりとりする

本文でもやったけど、 `runtime.sendMessage()` と `runtime.onMessage` でやりとりする。バックグラウンドからその他へ、あるいはその他からバックグラウンドへのメッセージ送受信になるっぽい。

- [runtime.sendMessage() - Mozilla | MDN](https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/runtime/sendMessage)
- [runtime.onMessage - Mozilla | MDN](https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/runtime/onMessage)

コンテンツスクリプトだと受信できない？

## おしまい

っていう話をVuePressを使ってやってみたんだけど、どこで公開しようとか考えてる間に先に内容をある程度出しておこうと思ってここに置いておきます。

今後とも何卒宜しくお願い致します。
