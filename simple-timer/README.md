# タイマーアプリを作る

お知らせできるようになったので、何かお知らせしたいですね。何をお知らせしましょうか。時間でしょうか。三分でしょうか。カップラーメンのできあがりでしょうか。

よし、タイマーを作りましょう。

### 本章で学べること

- バックグラウンド処理
- `manifest.json` - [background](https://developer.mozilla.org/ja/Add-ons/WebExtensions/manifest.json/background)
- ブラウザー拡張の部品間の通信
- [browser.runtime.sendMessage()](https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/runtime/sendMessage)
- [browser.runtime.onMessage](https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/runtime/onMessage)

### 作るもの

とりあえず簡単な方が良いよね。またポップアップを使うとして、HTMLには同じようにボタンがひとつだけ。押すと3分後にお知らせ。これでいきましょう。

### 書いてみる

またこれじゃ動かないんだけど、いったん実装します。

```js
sugoiButton.onclick = () => {
  const delay = 3 * 1000;  // 3秒
  setTimeout(() => {
    chrome.notifications.create(null, {
      type: chrome.notifications.TemplateType.BASIC,
      iconUrl: '/icon-90.png',
      title: 'Hello World!',
      message: 'お元気ですか',
    });
  }, delay);
};
```

何のひねりもなく `setTimeout()` でした。あ、3分だと開発中は長すぎるので、いったん3秒にしておきます。はい。

で、ポップアップを開いて、ボタンを押して、そのまま3秒待ってください。出ましたか？

……出ましたね、今回は。

あれれ～じゃあこれで終わりかな～？　いいえ、これじゃ駄目です。

次はボタンを押したら、すぐにポップアップを閉じてください。ポップアップの外をクリックすれば消えます。

そうすると、……お知らせが出てこなくなります。なんてこった！

### ポップアップのライフサイクル

ライフサイクルという表現で良いのかわからないんだけど、ポップアップの中身は普通のHTMLです。普通のHTMLなので、開いたらいろいろ始まって、閉じたら全て終わります。

普通のウェブページで `setTimeout()` を使って実装した場合を想像してほしいんですが、その場合、ページを閉じたらもうタイマーは動かないですよね。ポップアップも同様、閉じた時点でタイマーは消えてしまいます。

3分後にお知らせしようとしたら、3分間ずっとポップアップを開きっぱなしにしないといけなくなります。えー。

### ずっと動き続けるスクリプト

そこで使うのがバックグラウンドです。ブラウザー拡張の読み込みと同時に開始され、その後ずっと動き続けるスクリプトです。

書いてみましょう。まずは `manifest.json` です。ポップアップの設定のように、バックグラウンドの設定 `"background"` を記述します。

```json
{
  "manifest_version": 2,
  "name": "Hello World!",
  "version": "1.0.0",
  "author": "Ginpei",
  "permissions": [
    "notifications"
  ],
  "browser_action": {
    "default_icon": "icon-90.png",
    "default_title": "Hello World!",
    "default_popup": "index.html"
  },
  "background": {
    "scripts": [
      "background.js"
    ]
  }
}
```

久しぶりなので全部載せました。追加した `"background"` は最後です。

続いて `background.js` を新規作成します。

```js
const delay = 3 * 1000;  // 3秒
setTimeout(() => {
  chrome.notifications.create(null, {
    type: chrome.notifications.TemplateType.BASIC,
    iconUrl: '/icon-90.png',
    title: 'Hello World!',
    message: 'お元気ですか',
  });
}, delay);
```

こう書いて新規作成して、再読み込みして、3秒待つと……、ポップアップを触らなくてもお知らせが出てきます！　やった！

やってねえ！

起動の3秒後にお知らせしても仕方がないですね。ポップアップを閉じても動かせることはわかったので、次の課題は、こいつをポップアップから操作してタイマー起動することです。

### ポップアップからバックグラウンドへ通信

通信は `chrome.runtime.sendMessage()` と `chrome.runtime.onMessage` でやりとりできます。

まず送る方。これは `popup.js` です。

```js
const sugoiButton = document.querySelector('#sugoiButton');
sugoiButton.onclick = () => {
  const message = {
    delay: 3 * 1000,  // 3秒
    title: 'Hello World!',
    message: 'お元気ですか',
  };
  chrome.runtime.sendMessage(message);
};
```

続いて受ける方。こちらが `background.js` です。

```js
chrome.runtime.onMessage.addListener((message) => {
  setTimeout(() => {
    chrome.notifications.create({
      type: chrome.notifications.TemplateType.BASIC,
      iconUrl: '/icon-90.png',
      title: message.title,
      message: message.message,
    });
  }, message.delay);
});
```

さらっとやりましたが、 `message` オブジェクトを通じて情報を送ることができます。

さてバックグラウンドのスクリプトは、前述の通り動きっぱなしです。ので、変更したら一度ブラウザー拡張を再読み込みする必要があります。お忘れなく。

### というわけで

書き換えて、再読み込みして、ポップアップのボタンを押して、閉じて、3秒待つと、お知らせが出てくるはずです。

やったね！
