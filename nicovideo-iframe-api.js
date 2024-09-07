"use strict";
var NV;
(function (NV) {
    class Player {
        constructor(targetElementId, playerOption) {
            this.playerId = !!playerOption.playerId ? playerOption.playerId : 1;
            this.events = playerOption.events || {};
            this.createVideoIframe(targetElementId, playerOption.videoId, playerOption.width, playerOption.height);
            window.addEventListener('message', this.onMessage.bind(this));
        }
        isExistElemId(elemId) {
            return document.getElementById(elemId) != null;
        }
        createVideoIframe(targetElemId, videoId, width, height) {
            var _a;
            if (!this.isExistElemId(targetElemId)) {
                console.error('[NV-Iframe] 指定されたIDの要素が存在しません');
                return;
            }
            const embedUrl = `https://embed.nicovideo.jp/watch/${videoId}?w=${width}px&h=${height}&jsapi=1&playerId=${this.playerId}`;
            const newIframe = document.createElement('iframe');
            newIframe.src = embedUrl;
            newIframe.id = 'nicovideoPlayer' + (this.playerId > 1 ? this.playerId : '');
            newIframe.frameBorder = "0";
            newIframe.width = `${width}px`;
            newIframe.height = `${height}px`;
            newIframe.allowFullscreen = true;
            newIframe.allow = "autoplay; encrypted-media";
            (_a = document.getElementById(targetElemId)) === null || _a === void 0 ? void 0 : _a.appendChild(newIframe);
            // iframeがロードされたときに処理を実行する
            newIframe.onload = () => {
                var _a, _b;
                (_b = (_a = this.events).onReady) === null || _b === void 0 ? void 0 : _b.call(_a);
            };
        }
        onMessage(event) {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
            // メッセージの送信元がニコ動以外の場合破棄
            if (event.origin !== 'https://embed.nicovideo.jp') {
                return;
            }
            // メッセージの送信先が別のプレイヤーの場合破棄
            if (event.data.playerId !== this.playerId.toString()) {
                return;
            }
            // メッセージのイベント名によって処理を分岐
            if (event.data.eventName == 'loadComplete') {
                (_b = (_a = this.events).onLoadComplete) === null || _b === void 0 ? void 0 : _b.call(_a, event.data.data);
            }
            else if (event.data.eventName == 'playerStatusChange') {
                (_d = (_c = this.events).onPlayerStatusChange) === null || _d === void 0 ? void 0 : _d.call(_c, event.data.data);
            }
            else if (event.data.eventName == 'statusChange') {
                (_f = (_e = this.events).onStatusChange) === null || _f === void 0 ? void 0 : _f.call(_e, event.data.data);
            }
            else if (event.data.eventName == 'playerMetadataChange') {
                (_h = (_g = this.events).onPlayerMetadataChange) === null || _h === void 0 ? void 0 : _h.call(_g, event.data.data);
            }
            else if (event.data.eventName == 'seekStatusChange') {
                (_k = (_j = this.events).onSeekStatusChange) === null || _k === void 0 ? void 0 : _k.call(_j, event.data.data);
            }
            else if (event.data.eventName == 'enterProgrammaticFullScreen') {
                (_m = (_l = this.events).onEnterProgrammaticFullScreen) === null || _m === void 0 ? void 0 : _m.call(_l, event.data.data);
            }
            else if (event.data.eventName == 'exitProgrammaticFullScreen') {
                (_p = (_o = this.events).onExitProgrammaticFullScreen) === null || _p === void 0 ? void 0 : _p.call(_o, event.data.data);
            }
        }
        _postMessage(eventName, data) {
            const iframe = document.getElementById('nicovideoPlayer' + (this.playerId > 1 ? this.playerId.toString() : ''));
            if (!iframe) {
                console.error('[NV-Iframe] プレイヤーが存在しません');
                return;
            }
            let messageData = {
                eventName: eventName,
                playerId: this.playerId.toString(),
                sourceConnectorType: SourceConnectorType.WEBSITE
            };
            if (!!data) {
                messageData = Object.assign(Object.assign({}, messageData), { data: data });
            }
            if (iframe.contentWindow) {
                iframe.contentWindow.postMessage(messageData, 'https://embed.nicovideo.jp');
            }
            else {
                console.error('[NV-Iframe] iframe.contentWindowが存在しません');
            }
        }
        seek(time) {
            this._postMessage('seek', { time: time });
        }
        play() {
            this._postMessage('play');
        }
        pause() {
            this._postMessage('pause');
        }
        volumeChange(volume) {
            this._postMessage('volumeChange', { volume: volume });
        }
        commentVisibilityChange(isVisible) {
            this._postMessage('commentVisibilityChange', { commentVisibility: isVisible });
        }
        incrementViewCount() {
            this._postMessage('incrementViewCount');
        }
    }
    NV.Player = Player;
    let PlayerStatus;
    (function (PlayerStatus) {
        PlayerStatus[PlayerStatus["LOADING"] = 1] = "LOADING";
        PlayerStatus[PlayerStatus["PLAYING"] = 2] = "PLAYING";
        PlayerStatus[PlayerStatus["PAUSE"] = 3] = "PAUSE";
        PlayerStatus[PlayerStatus["END"] = 4] = "END";
    })(PlayerStatus = NV.PlayerStatus || (NV.PlayerStatus = {}));
    let SeekStatus;
    (function (SeekStatus) {
        SeekStatus[SeekStatus["NOT_SEEK"] = 0] = "NOT_SEEK";
        SeekStatus[SeekStatus["SEEKING"] = 1] = "SEEKING";
    })(SeekStatus = NV.SeekStatus || (NV.SeekStatus = {}));
    let SourceConnectorType;
    (function (SourceConnectorType) {
        SourceConnectorType[SourceConnectorType["NICOVIDEO"] = 0] = "NICOVIDEO";
        SourceConnectorType[SourceConnectorType["WEBSITE"] = 1] = "WEBSITE";
    })(SourceConnectorType = NV.SourceConnectorType || (NV.SourceConnectorType = {}));
})(NV || (NV = {}));
// スクリプト読み込みが完了したときに関数呼び出し
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
if (typeof onNicoVideoIframeAPIReady == 'function') {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    onNicoVideoIframeAPIReady();
}
