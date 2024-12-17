import { WikiError, Wiki, WikiErrorOpts } from "./Wiki.js"

type MenuElem = 'cover' | 'frame';
declare const iframeResize: (...args: any[]) => HTMLIFrameElement[];

export class Menu {
    wiki: Wiki;
    readonly _cover: string;
    cover?: HTMLDivElement | null;
    readonly _frame: string;
    frame?: HTMLIFrameElement | null;
    isGame: boolean;
    anim: boolean;
    frameLoaded: boolean;
    frameInited: boolean;
    constructor(wiki?: Wiki) {
        this.isGame = true;
        if (wiki) {
            this.wiki = wiki;
            this.wiki.menu = this;
        } else {
            // @ts-ignore
            this.wiki = new Wiki(this);
        }
        this._cover = 'div#cover';
        this.cover = document.querySelector(this._cover);
        this._frame = 'iframe#wiki';
        this.frame = document.querySelector(this._frame);
        // TODO: add animation option in ui
        this.anim = true;
        this.frameLoaded = false;
        this.frameInited = false;
    }
    static _isIFrame(e: Element): e is HTMLIFrameElement {
        return e.tagName.toLowerCase() === 'iframe';
    }
    _elems<P extends MenuElem[]>(...e: P): this is { [K in P[number]]: HTMLElement } {
        for (const _el of e) {
            if (this[_el]) continue;
            try {
                this[_el] = <any>document.querySelector(this[`_${_el}`]);
                if (!this[_el]) throw new Error();
            } catch (err) {
                const werr = new WikiError(err, <WikiErrorOpts>{
                    simple: `Element "${e}" not found`,
                    long: `Element "${e}" not found. Try reloading the page or enabling embeds.`,
                    info: 'This can be due to the page not being fully loaded, or because of aggresive browser security blocking certain elements like iframes.'
                });
                werr.send();
                return false;
            }
        }
        return true;
    }
    setFrameUrl(url: string | URL) {
        if (!this._elems('frame')) return;
        this.initFrame();
        console.error(new Error());
        if (url instanceof URL) this.frame.src = url.href;
        else this.frame.src = url;
    }
    initFrame() {
        if (!this._elems('frame')) return;
        this.frameLoaded = false;
        iframeResize({
            license: 'GPLv3',
            waitForLoad: true,
        }, this.frame);
        this.frame.addEventListener('load', this.loaded.bind(this), {
            once: true
        });
    }
    unloaded() {
        if (!this._elems('frame')) return;
    }
    loaded() {
        if (!this._elems('cover')) return;
        if (this.frameLoaded) return;
        this.frameLoaded = true;
        console.log('loaded');
        this.cover.style.animation = 'loaded 1s forwards ease-in-out';
    }
    error(err: WikiError) {
        
    }
}