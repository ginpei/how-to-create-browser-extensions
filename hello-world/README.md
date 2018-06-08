# Hello Worldから始める

[[toc]]

## 概要

- すごいかんたん！
- ビルドシステム類のない牧歌的構成でもいける
- API互換性はそこそこ。ポリフィル入れてFirefoxに寄せて作るのが吉か
- Edgeは闇を感じた
- Safariは未調査

### 基本的な作り方

1. フォルダを作る
2. `manifest.json` を用意
3. それに合わせて各種スクリプト等を用意
4. ブラウザーで開発中のものを読み込み開発
5. 公開

### 動く場所

- ツールバーのボタン
- 任意のサイト内
- バックグラウンド
- 独自ページ

他に開発者ツールにタブを追加したり、Firefoxならサイドバーを作ったりすることもできます。

<!-- TODO 念のため、開発者ツールとサイドバーを試す -->

### できること

- [いろいろ](https://developer.mozilla.org/ja/Add-ons/WebExtensions)

拡張用のAPIがいっぱいあるのでそれらを駆使する。

もちろん普通のウェブ開発の知見も再利用できるよ。

### 最新のJavaScriptを書ける

IE対応の必要がない（し、たぶんEdgeも無視されるだろう）ので、Chromeだけ、あるいはChromeとFirefoxだけが対象になります。すると最新のJavaScriptの書き方をがんがん使えます。

`class` とか `async`/`await` とか、関数引数の初期値とか分割代入とか。

そこら辺の勉強を兼ねて挑戦してみるのはきっと良い選択だと思います。

## Hello Worldをインストールしてみる

最初のブラウザー拡張を自作するまえに、一度サンプルをインストールしてみましょう。どうせ自作したらやる作業です。

サンプルはこちら。zipファイルの中身をどこかに展開しておいてください。

- [hello-world.zip](/hello-world.zip)

<!-- TODO Windows Defenderが反応する？ -->

インストールは環境ごとに異なります。以下から「インストール」の項をご覧ください。

- [Chrome](/browsers/chrome/) → [インストール](/browsers/chrome/#インストール)
- [Firefox](/browsers/firefox/) → [インストール](/browsers/firefox/#インストール)
- [Edge](/browsers/edge/) → [インストール](/browsers/edge/#インストール)

## Hello Worldを作る

自作のもののインストールのやり方がわかったところで、安心して自分のHello Worldを作り始めます。

あ、作り始める前に、さっきインストールしたサンプルはもう消しちゃってください。やり方は前項で紹介した各環境ごとの説明を参照。

サンプルと同じもの、ボタンを押すとハローするやつから始めましょう。以下のように `hello` ディレクトリと、その下にファイルを作ります。

- `hello/`
    - `manifest.json`
    - `popup.html`

### 本章で学べること

- ブラウザー拡張の基本的な作り方
- `manifest.json`
- ポップアップ

### `manifest.json` の用意

```json
{
  "manifest_version": 2,
  "name": "Hello World!",
  "version": "1.0.0",
  "author": "Ginpei",
  "browser_action": {
    "default_popup": "popup.html"
  }
}
```

### HTMLの用意

限界HTMLです。お好みでちゃんとしたやつに書き換えてくださって結構。

```html
<!doctype html>
<html lang=en>
<title>Hello World!</title>
<h1>Hello World!</h1>
```

### できあがり

とりあえずここまででできあがり。さあインストールしましょう。

## Hello Worldにもうちょっと足す

インストールできました？　動きましたね？

とりあえず動いたら、少しずつ足していきましょう。

### 本章で学べること

- ポップアップ関係の設定を少々
- ポップアップHTMLでCSSを読み込む
- ブラウザー拡張でのパスの扱い

### アイコンを足す

まずは簡単なところから。ボタンのアイコンを設定します。

`manifest.json` に、以下のように `"default_icon"` を足します。アイコン画像は適当にご用意ください。

<!-- TODO サイズは？ -->

```json
"browser_action": {
  "default_icon": "icon-90.png",
  "default_popup": "index.html"
}
```

書き足して上書き保存したら、ブラウザーの方で拡張を再読み込みします。しないと反映されません、当然。

### タイトルを足す

同様に `"default_title"` を足します。

マウスカーソルをボタンに乗せた際にツールチップとして表示されるようです。

```json
"browser_action": {
  "default_icon": "icon-90.png",
  "default_title": "Hello World!",
  "default_popup": "index.html"
}
```

### CSSを足す

ただHTMLから読み込むだけです。かーんたーん。

まず、今いる `hello` 配下に `popup.css` を以下の内容で作成します。

```css
body {
  align-items: center;
  display: flex;
  justify-content: center;
  margin: 0;
  min-height: 300px;
  min-width: 300px;
}
```

そいつを読み込むよう、既存の `index.html` に `<link>` を足します。

```html
<!doctype html>
<html lang=en>
<title>Hello World!</title>
<link rel="stylesheet" href="/popup.css">
<h1>Hello World!</h1>
```

ポップアップを開きなおすと、見た目も変わっているはずです。

ちなみに今回変更したのはポップアップの中身だけなので、再読み込みは不要です。（不安ならしてください。）

### パスについて

`manifest.json` のある位置がルートになります。なので `/` から始めることができる。

`../../../../../` とか書いても、プロジェクトのディレクトリより上が見えたりはしないみたい。

（仕様は調べていない。）

<!-- TODO 仕様があれば -->
