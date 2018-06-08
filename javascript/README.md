# 簡単なJavaScriptを書いてみる

本格的な拡張の機能を作り始める前に、ポップアップ内で完結するごく簡単なスクリプトから始めたいと思います。わかる人はさらっと流してください。

## ボタンを押したら文字を表示

### 本章で学べること

- ポップアップHTMLでJSを読み込む

### 作るもの

何にしようかなー。やっぱり最初はボタンを押したら何かするやつからですかねー。

というわけで、ボタンを押したら "Hello World!" が出てくるやつにします。

### HTMLの用意

JSファイルもCSSと同様、ただHTMLから読み込むだけです。

`index.html` ちょっと書き換えて、さらに `<script>` を追加します。まだ読み込む先のJSファイルは作ってないけど。

```html
<!doctype html>
<html lang=en>
<title>Hello World!</title>
<link rel="stylesheet" href="/popup.css">
<div>
  <h1 id="yabaiMessage" style="display: none">Hello World!</h1>
  <button id="sugoiButton">Push me!</button>
</div>
<script src="/popup.js"></script>
```

### スクリプトを実装する

`hello` 配下に `popup.js` を作成します。さっきHTMLに追加した `<script>` で読み込むやつです。

```js
const sugoiButton = document.querySelector('#sugoiButton');
sugoiButton.addEventListener('click', () => {
  sugoiButton.style.display = 'none';
  yabaiMessage.style.display = '';
});
```

これでどうでしょうか。ポップアップを開くと "Push me!" のボタンが表示され、それを押すと "Hello World!" の文字に置き換わるはずです。

### よくできました

というわけで、ポップアップ内で完結するものを作る分には、普通のHTML、普通のCSS、そして普通のJavaScriptを書くだけだということがおわかり頂けたかと思います。

簡単でしょう？

といってもそれだけじゃ何も面白くはないので、もうちょっと何かしてみましょう。

### jQueryが恋しい？

ポップアップについては前述の通り「普通のHTML」なので、普通にjQueryを読み込んで使うこともできます。まあそちらが良ければそちらでも構いません。

もしjQueryから離れたコードを書き始めたいのでしたら、良い機会かもしれません。ただ、脱jQueryがゴールなのか、とにかくブラウザー拡張を作りたいのか、目標を決めておきましょう。勢い付けて二つ同時に目指すと、スッ転んだときに痛いです。

jQuery使うにしろ使わないにしろ、難しいところはそこら辺じゃないです。

## ブラウザー拡張のAPIをひとつ使ってみる

*※本章の内容はChromeとFirefoxで動きます。Edgeでは動きません。*

ポップアップは出てきたけれど、書いたのは普通のHTML、普通のCSS、そして普通のJavaScriptでした。次はブラウザー拡張だけの機能を使ってみましょう。

何にしようかな、雰囲気に慣れるための簡単なものが良いな。

**notifications API**を使ってみましょうか。

### 本章で学べること

- ブラウザー拡張用のAPIの概要
- [browser.notifications](https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/notifications)
- ブラウザー拡張用のパーミッションの設定
- `manifest.json` - [permissions](https://developer.mozilla.org/ja/Add-ons/WebExtensions/manifest.json/permissions)
- API仕様の調べ方
- API互換性の調べ方

### ブラウザー拡張用のAPI群 `chrome`

Chrome、Firefox共にグローバルの `chrome` オブジェクト以下にAPI群が用意されています。例えば今回利用するAPIだと `chrome.notifications.create()` というものを利用します。

Edgeは `browser` オブジェクトにそれが実装されているようです。なお `chrome` オブジェクトも存在していて、しかしこれは全く別物のようです。（すみません、詳細はよくわかりません。）　Edgeで動かしたい場合はコード例の `chrome` を `browser` に置き換えてください。もしかしたら動くかもしれません。動かないかもしれません。今回（notifications API）は動きません。

互換性は現時点ではまだ不完全で、標準化も完了していません。有用なAPIでも一部環境でしか使えないものがあったりします。

APIについてはもうちょっと、互換性とかFirefoxの `browser` オブジェクトとかの話もあるんだけど、後回しにします。

### お知らせAPIの使い方

とまあそういうわけでして、notification APIを使います。ウェブ標準の方の[Notification API](https://developer.mozilla.org/en-US/docs/Web/API/Notification)とは別物で、許可を求めるポップアップも表示されません。（ブラウザー拡張インストール時に情報は表示されます。）

<!-- TODO ウェブ標準Notification APIのスクリーンショット -->

- [notifications - Mozilla | MDN](https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/notifications)

さっそくこいつをポップアップで試してみましょう。コードは簡単です。 `hello` 内の `popup.js` を開いて、以下の内容に書き換えます。

```js
const sugoiButton = document.querySelector('sugoiButton');
sugoiButton.addEventListener('click', () => {
  chrome.notifications.create(null, {
    type: chrome.notifications.TemplateType.BASIC,
    iconUrl: '/icon-90.png',
    title: 'Hello World!',
    message: 'お元気ですか',
  });
});
```

<!-- TODO 日本語が化ける？ -->

このコードは正しいので、コピペで一度試してみて頂きたいのですが、実は、動きません。繰り返しますが、**このコードは正しい**けど、動かないんです。

つまり**このコードじゃないところが正しくない**ということですね。

ともあれ、うまく動かないときはすぐコンソールにエラーが出ていないか確認してみてください。（ポップアップの中で右クリック→要素の検証とかそういうので出てきます。）

<!-- ともあれ、うまく動かないときはすぐ[コンソールにエラーが出ていないか確認してみてください](/browsers/)。 -->

Chromeであればこんなエラーが出ているはずです。

> ```
> popup.js:3 Uncaught TypeError: Cannot read property 'create' of undefined
>     at HTMLButtonElement.sugoiButton.onclick (popup.js:3)
> ```

Firefoxならこう。

> ```
> TypeError: chrome.notifications is undefined [Learn More]  popup.js:3:5
> ```

謎ですね、正しいコードのなずなのに `chrome.notificatiions` が `undefined` だぞと言われています。

実はこのオブジェクトは、事前に**パーミッションの設定**をしておかないと使えないのです。

### パーミッションの設定

というわけで、設定します。

`manifest.json` を開いて、 `"permissions"` を追加します。

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
  }
}
```

作業としてはこれだけです。更新後、ブラウザーの方では拡張を再読み込みしてください。 `manifest.json` を更新したので、ポップアップを開きなおすだけじゃ足りないです。

上記のように `"permissions"` の設定を適切に行い、再読み込みして、もう一度ボタンを推せば、ほらちゃんと何かが出てくるはずです。

### APIの使い方を調べる

動いて良かった良かったというところですが、もうちょっとここをこうしたいなーとか思うかもしれません。今思わなくても、将来思うかもしれません。なので、APIの仕様を軽く調べておきましょう。

Firefoxの製造元であるMozillaが管理する、MDNというサイトにリファレンスがあります。全てではありませんが、そこそこ日本語版も用意されています。

- [ブラウザー拡張機能 - Mozilla | MDN](https://developer.mozilla.org/ja/Add-ons/WebExtensions)

今回のnotification APIについては、「JavaScript API 群」に並んでいるのを見つけられます。

- [notifications - Mozilla | MDN](https://developer.mozilla.org/ja/Add-ons/WebExtensions/API/notifications)
- [notifications.create() - Mozilla | MDN](https://developer.mozilla.org/ja/Add-ons/WebExtensions/API/notifications/create)

書式はこうなっているそうです。

> ```js
> var creating = browser.notifications.create(
>   id,                   // optional string
>   options               // NotificationOptions
> )
> ```

引数や戻り値がどうなってるのかわかりますね。良かった良かった。

ページの下の方には「ブラウザ互換性」の項があります。ここを見れば、自分で実装して試すことなく確認することができます。

どうやらEdgeでは実装されていないようです。[ウェブ標準のNotificationの方](https://developer.mozilla.org/en-US/docs/Web/API/Notification#Browser_compatibility)はある程度実装が進んでいるようなので、こちらでフォールバックする必要があるかもしれません。まあ対象外にしちゃっても良いんだろうけど。
