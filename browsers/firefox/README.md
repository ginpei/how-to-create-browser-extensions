# Firefoxで自作のブラウザー拡張を開発

## インストール

普通の拡張機能一覧 (`about:addons`) とは違う場所で操作します。

1. [`about:debugging`](about:debugging) を開く（アドレスバーに入力）
2. 右上 "Load Temporary Add-on" 的なボタンから `manifest.json` を開く

 その後一覧に表示されるカードから以下の操作が可能です

- 再読み込み
- 削除
- 拡張機能用コンソールを開く

開発者ツールは、ポップアップで尋ねられる "Incoming Connection" を受け入れる必要があります。

それとポップアップをデバッグする場合、開発者ツール右上の、四角が四つ並んだ "Disable popup auto hide" をオンにします。

### 次回ブラウザー起動時

開発用に読み込んだ拡張機能は、次回ブラウザー起動時には削除されるため、都度同じ手順で読み込む必要があります。