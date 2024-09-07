
namespace NV {
    export class Player {
        private readonly playerId: number;
        readonly events: PlayerOption.Events;
        constructor(targetElementId: string, playerOption: PlayerOption.Option) {
            this.playerId = !!playerOption.playerId ? playerOption.playerId : 1;
            this.events = playerOption.events || {} as PlayerOption.Events;
            this.createVideoIframe(targetElementId, playerOption.videoId, playerOption.width, playerOption.height);
            window.addEventListener('message', this.onMessage.bind(this));
        }

        private isExistElemId(elemId: string) {
            return document.getElementById(elemId) != null;
        }

        private createVideoIframe(targetElemId: string, videoId: string, width: number, height: number) {
            if (!this.isExistElemId(targetElemId)) {
                console.error('[NV-Iframe] 指定されたIDの要素が存在しません');
                return;
            }
            const embedUrl = `https://embed.nicovideo.jp/watch/${videoId}?w=${width}px&h=${height}&jsapi=1&playerId=${this.playerId}`
            const newIframe = document.createElement('iframe')
            newIframe.src = embedUrl;
            newIframe.id = 'nicovideoPlayer' + (this.playerId > 1 ? this.playerId : '');
            newIframe.width = `${width}px`;
            newIframe.height = `${height}px`;
            newIframe.frameBorder = '0';
            newIframe.allow = "autoplay; encrypted-media; fullscreen; picture-in-picture";
            document.getElementById(targetElemId)?.appendChild(newIframe);
            // iframeがロードされたときに処理を実行する
            newIframe.onload = () => {
                this.events.onReady?.();
            };

        }

        private onMessage(event: MessageEvent) {
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
                const data = event.data.data as PlayerMessage.LoadComplete;
                this.events.onLoadComplete?.(data);
            } else if (event.data.eventName == 'playerStatusChange') {
                const data: PlayerMessage.PlayerStatusChange = event.data.data as PlayerMessage.PlayerStatusChange;
                data.playerStatus = data.playerStatus as PlayerStatus;
                this.events.onPlayerStatusChange?.(data);
            } else if (event.data.eventName == 'statusChange') {
                const data: PlayerMessage.StatusChange = event.data.data as PlayerMessage.StatusChange;
                data.playerStatus = data.playerStatus as PlayerStatus;
                data.seekStatus = data.seekStatus as SeekStatus;
                this.events.onStatusChange?.(data);
            } else if (event.data.eventName == 'playerMetadataChange') {
                const data: PlayerMessage.PlayerMetadataChange = event.data.data as PlayerMessage.PlayerMetadataChange;
                this.events.onPlayerMetadataChange?.(data);
            } else if (event.data.eventName == 'seekStatusChange') {
                const data = event.data.data as PlayerMessage.SeekStatusChange;
                data.seekStatus = data.seekStatus as SeekStatus;
                this.events.onSeekStatusChange?.(data);
            } else if (event.data.eventName == 'enterProgrammaticFullScreen') {
                this.events.onEnterProgrammaticFullScreen?.();
            } else if (event.data.eventName == 'exitProgrammaticFullScreen') {
                this.events.onExitProgrammaticFullScreen?.();
            } else {
                console.error('[NV-Iframe] 不明なイベントが発生しました');
                this.events.onError?.(event.data);
            }

        }

        private _postMessage(eventName: string, data?: object) {
            const iframe = document.getElementById('nicovideoPlayer' + (this.playerId > 1 ? this.playerId.toString() : '')) as HTMLIFrameElement;
            if (!iframe) {
                console.error('[NV-Iframe] プレイヤーが存在しません');
                return;
            }
            let messageData: object = {
                eventName: eventName,
                playerId: this.playerId.toString(),
                sourceConnectorType: SourceConnectorType.WEBSITE
            }
            if (!!data) {
                messageData = { ...messageData, data: data };
            }
            if (iframe.contentWindow) {
                iframe.contentWindow.postMessage(messageData, 'https://embed.nicovideo.jp');
            } else {
                console.error('[NV-Iframe] iframe.contentWindowが存在しません');
            }
        }

        public seek(time: number) {
            this._postMessage('seek', { time: time });
        }

        public play() {
            this._postMessage('play');
        }


        public pause() {
            this._postMessage('pause');
        }

        public volumeChange(volume: number) {
            this._postMessage('volumeChange', { volume: volume });
        }

        public commentVisibilityChange(isVisible: boolean) {
            this._postMessage('commentVisibilityChange', { commentVisibility: isVisible });
        }

        public incrementViewCount() {
            this._postMessage('incrementViewCount');
        }
    }

    namespace PlayerMessage {
        export interface LoadComplete {
            videoInfo: {
                videoId: string,
                watchId: string,
                title: string,
                thumbnailUrl: string,
                commentCount: number,
                viewCount: number,
                mylistCount: number,
                description: string,
                lengthInSeconds: number,
                postedAt: Date,
            }
        }

        export interface PlayerStatusChange {
            playerStatus: PlayerStatus
        }

        export interface StatusChange {
            seekStatus: SeekStatus,
            playerStatus: PlayerStatus
        }

        export interface PlayerMetadataChange {
            currentTime: number
            duration: number
            isVideoMetaDataLoaded: boolean
            maximumBuffered: number
            muted: boolean
            showComment: boolean
            volume: number
        }

        export interface SeekStatusChange {
            seekStatus: SeekStatus
        }

        export interface Error {
            eventName: string,
            playerId: number,
            sourceConnectorType: SourceConnectorType,
            data: {
                code: string,
                message: string
                raw: any
            }
        }
    }

    namespace PlayerOption {
        export interface Option {
            height: number,
            width: number,
            videoId: string,
            playerId?: number,
            events?: Events
        }

        export interface Events {
            onReady?: Function,
            onLoadComplete?: Function,
            onPlayerStatusChange?: Function,
            onStatusChange?: Function,
            onPlayerMetadataChange?: Function,
            onSeekStatusChange?: Function,
            onEnterProgrammaticFullScreen?: Function,
            onExitProgrammaticFullScreen?: Function,
            onError?: Function
        }
    }

    export enum PlayerStatus {
        LOADING = 1,
        PLAYING = 2,
        PAUSE = 3,
        END = 4
    }

    export enum SeekStatus {
        NOT_SEEK = 0,
        SEEK_DRAGGING = 1,
        SEEKING = 2
    }

    export enum SourceConnectorType {
        NICOVIDEO = 0,
        WEBSITE= 1
    }
}

// スクリプト読み込みが完了したときに関数呼び出し
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
if (typeof onNicoVideoIframeAPIReady == 'function') {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    onNicoVideoIframeAPIReady();
}