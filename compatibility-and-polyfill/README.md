# 互換性

ここいらで、ちょっと落ち着いて仕様の話をしたいと思います。各ブラウザーでAPIはある程度同じように使えて、先の例のタイマーも、同じコードでChromeとFirefoxの両方で動きます。

が、実装状況だけじゃなくて、実装方針もちょっとずつ違ってたりします。

Chromeではグローバルの `chrome` オブジェクト以下にAPIが用意されています。例えば今回利用したAPIだと `chrome.runtime.sendMessage()` というものを利用します。

Firefoxもグローバルに `chrome` オブジェクトが用意されており、これはChromeのAPIとある程度の互換性を持っています。さっきも `chrome.runtime.sendMessage()` が動きましたね。ただし完全ではなく、一部実装されていなかったり、あるいは逆にFirefoxにしかないものもあります。

加えて、Firefoxはグローバルに `browser` というオブジェクトも用意しています。これも `chrome` と同様の機能のAPI群なのですが、実はインターフェイス（書き方）がちょっと違っています。どう違うのかはいったん置いておきます。

最後にEdgeですが、ChromeのAPIと互換のものが、やはり不完全ながら `chrome` ではなく `browser` 配下に用意されています。 `chrome` も存在するんだけど、無関係の別物っぽい。何だろこれ。ともかくEdge用には `browser.runtime.sendMessage()` のように書く必要があります。

<!-- TODO send message できるか確認 -->

### 標準API

Firefoxが2種類のAPIを用意してる件について。ブラウザー拡張のAPIは各ベンダーがそれぞれ用意してる感じなんだけど、W3Cによる標準化も試みられているようです。

- [W3C and WebExtensions APIs - Add-ons / Announcements - Mozilla Discourse](https://discourse.mozilla.org/t/w3c-and-webextensions-apis/20421)

で、Firefoxの `browser` はそれに従っているようです。（どうかな違うかも？）

### Promise化されたインターフェイス

 `chrome` はコールバックが必要な場合に引数で受け取るのですが、 `browser` の方は代わりにPromiseオブジェクトを返して、そちらで制御するようになります。すると、ES2017の `async`/`await` を使った読みやすいコードにすることが可能です。

 例として、記憶した情報を読み出す処理を考えます。 `storage.local.get()` というものを使います。（これは `"storage"` を `manifest.json` の `"permissions"` で設定する必要があります。）

 まずはChromeで動くコード。

```js
chrome.storage.local.get(["item1", "item2"], (result) => {
  console.log('# result', result.item1, result.item2);
});
```

Firefoxもこれで動きます。

ではそのFirefoxの別の選択肢、 `browser` の方も見てみましょう。Promiseになります。

```js
browser.storage.local.get(["item1", "item2"]).then((result) => {
  console.log('# result', result.item1, result.item2);
});
```

まあこれ見るとそんなに変わってないね。でも、Promiseの場合は `async` な関数の中で `await` を使って、こう書けるんです。

```js
const result = await browser.storage.local.get(["item1", "item2"]);
console.log('# result', result.item1, result.item2);
```

これならまっすぐになって、だいぶ見やすいんじゃないでしょうか。見やすいよね。

### コードを共通化する

Promiseの方が使いやすいので、Firefoxに寄せる方針です。

最近こちらに書いたのでどうぞ。他にEdge対応とかも。

- [Chrome、Edge、Firefox互換のブラウザー拡張を作るポリフィル。 | Ginpen.com](https://ginpen.com/2018/04/22/browser-extension-polyfill/)

<!-- TODO 続き -->
