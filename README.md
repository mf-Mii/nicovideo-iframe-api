# NicoVideo Iframe API

ニコニコ動画の動画を埋め込み、操作するためのAPIです。

## 概要

ニコニコ動画では、YouTube Player APIのように、動画を埋め込み、操作するためのAPIが公式に提供されていません。
しかし、ニコニコ動画の埋め込みプレイヤーは、YouTubeの埋め込みプレイヤーと同じように、JavaScriptで操作することができます。
このライブラリは、ニコニコ動画の埋め込みプレイヤーを操作するためのAPIを提供します。
ライブラリを使用することで、YouTube Player APIのように、ニコニコ動画の埋め込みプレイヤーを操作することができます。

## 要件

- 実行環境であるブラウザはHTML5の`postMessage`をサポートするブラウザを使用する必要があります。最新のブラウザはサポートしていますが、Internet Explorer 8以下はサポートしていません。
- このAPIを使用するためには、以下のJavaScript関数も実装する必要があります。
  - `onNicoVideoIframeAPIReady`: ページでAPIが使用可能になったときに呼び出される関数

## 使用例
    
```html
<!DOCTYPE html>
<html>
<head>
    <title>NicoVideo Iframe API Example</title>
</head>
<body>
    <div id="player"></div>
    <script>
        var player;
        function onNicoVideoIframeAPIReady() {
            player = new NV.Player('player', {
                width: 640,
                height: 360,
                videoId: 'sm9',
                events: {
                    onReady: onReady
                }
            });
        }
        function onReady() {
            player.play();
        }
    </script>
    <script src="https://cdn.jsdelivr.net/gh/mf-Mii/nicovideo-iframe-api@latest/nicovideo-iframe-api.js" defer></script>
</body>
</html>
```
このサンプルコードは、ニコニコ動画の動画IDが`sm9`の動画を埋め込み、再生するサンプルコードです。
以下に、このサンプルコードの説明を記載します。
1. このコード内の`<div id="player"></div>`は、APIが動画プレイヤーを配置する場所を示しています。
2. このコード内の`onNicoVideoIframeAPIReady`関数は、APIが使用可能になったときに呼び出される関数です。
3. `NV.Player('player', { ... })`は、動画プレイヤーを作成する関数です。
   1. `'player'`は、動画プレイヤーを配置する場所を、要素のIDで指定しています。
4. プレイヤーの準備ができたときに、`onReady`関数が呼び出されます。
5. `player.play()`は、動画を再生する関数です。


## 使い方

### APIの読み込み
```html
<script src="https://cdn.jsdelivr.net/gh/mf-Mii/nicovideo-iframe-api@latest/nicovideo-iframe-api.js" defer>
```

### 動画プレイヤーの読み込み
```javascript
var player = new NV.Player('<HTML_ID>', {
    width: 640,
    height: 360,
    videoId: 'sm9',
    events: {
        onReady: onReady
    }
});
```
動画プレイヤーのコンストラクタは次の引数を取ります。
- 1: `<HTML_ID>`は動画プレイヤーを配置する場所を指定します。HTMLの要素のIDを指定します。
- 2: `NV.PlayerOption.Option`を指定します。このオブジェクトには以下のプロパティを指定します。
  - *`width`(number): プレイヤーの幅を指定します。
  - *`height`(number): プレイヤーの高さを指定します。
  - *`videoId`(string): 動画IDを指定します。
  - `playerId`(number): プレイヤーのID(数字)を指定します。デフォルトは`1`です。
  - `events`: イベントハンドラを指定します。このオブジェクトには以下のプロパティを指定します。
    - `onReady`:(Function): プレイヤーが動画を再生する準備ができたときに呼び出される関数を指定します。
    - `onLoadComplete`:(Function): プレイヤーの読み込みが完了したときに呼び出される関数を指定します。
    - `onPlayerStatusChange`:(Function): プレイヤーの状態が変更されたときに呼び出される関数を指定します。
    - `onStatusChange`:(Function): 動画の状態が変更されたときに呼び出される関数を指定します。
    - `onSeekStatusChange`:(Function): 動画のシーク状態が変更されたときに呼び出される関数を指定します。
    - `onEnterProgrammaticFullScreen`:(Function): プログラムでフルスクリーンモードに入ったときに呼び出される関数を指定します。
    - `onExitProgrammaticFullScreen`:(Function): プログラムでフルスクリーンモードから出たときに呼び出される関数を指定します。

### 関数

#### `play()`
動画を再生します。
##### 引数
- なし

#### `pause()`
動画を一時停止します。
##### 引数
- なし

#### `seek(time: number)`
動画を指定した時間にシークします。
##### 引数
- `time`(number): シークする時間(秒)を指定します。

#### `volumeChange(volume: number)`
動画の音量を変更します。
##### 引数
- `volume`(number): 動画の音量(0.0~1.0)を指定します。

#### `commentVisibilityChange(isVisible: boolean)`
コメントの表示を切り替えます。
##### 引数
- `isVisible`(boolean): コメントの表示有無を指定します。

### イベント
動画プレイヤーに変化が生じたとき、APIはアプリケーションに通知するためにイベントを発火させます。
イベントは、`events`プロパティに指定した関数で処理できます。

#### `onReady`
プレイヤーが動画を再生する準備ができたときに呼び出される関数です。
##### 引数
- なし

#### `onLoadComplete`
プレイヤーの読み込みが完了したときに呼び出される関数です。
##### 引数
- なし

#### `onPlayerStatusChange`
プレイヤーの状態が変更されたときに呼び出される関数です。
##### 引数
- `status`(NV.PlayerStatus): プレイヤーの状態を示す列挙型です。

#### `onStatusChange`
動画の状態が変更されたときに呼び出される関数です。
##### 引数
- `status`(NV.PlayerStatus): 動画の状態を示す列挙型です。

#### `onSeekStatusChange`
動画のシーク状態が変更されたときに呼び出される関数です。
##### 引数
- `status`(NV.SeekStatus): 動画のシーク状態を示す列挙型です。

#### `onEnterProgrammaticFullScreen`
プログラムでフルスクリーンモードに入ったときに呼び出される関数です。
##### 引数
- なし

#### `onExitProgrammaticFullScreen`
プログラムでフルスクリーンモードから出たときに呼び出される関数です。
##### 引数
- なし

### 列挙型

#### `NV.PlayerStatus`
プレイヤーの状態を示す列挙型です。
- `NV.PlayerStatus.LOADING`: 未再生
- `NV.PlayerStatus.ENDED`: 再生終了
- `NV.PlayerStatus.PLAYING`: 再生中
- `NV.PlayerStatus.PAUSED`: 一時停止

#### `NV.SeekStatus`
動画のシーク状態を示す列挙型です。
- `NV.SeekStatus.NOT_SEEKING`: シークしていない

## ライセンス

MIT