/// <reference path="../node_modules/notifs/notifs.d.ts" />

import { Menu } from './Menu.js';

declare const menu: Menu;

declare const ky: typeof import('ky').default;

export interface WikiErrorOpts {
    simple: string;
    long: string;
    info?: string;
    menu?: Menu;
}
export type Wiki_class = typeof Wiki;

export interface SearchOptions {
    limit?: number;
    language?: string;
    project?: string;
}

export interface MenuRefClass {
    menu: Menu;
}

export class WikiError extends Error {
    long: string;
    _simple: string;
    get simple() {
        return `${this._simple} (see menu bar for info)`;
    }
    set simple(str: string) {
        this._simple = str;
    }
    info?: string;
    menu!: Menu;
    constructor(err: WikiError)
    constructor(opts: WikiErrorOpts)
    constructor(err: Error | unknown, opts: WikiErrorOpts)
    constructor(err: Error | WikiError | unknown, opts?: WikiErrorOpts) {
        super();
        if (err instanceof WikiError) {
            // set values for typescript
            this._simple = '';
            this.long = '';
            this.menu = <Menu>{};
            Object.assign(this, err);
            return;
        }
        if (WikiError._isWikiErrorOpts(err)) {
            opts = err;
            err = new Error(err.simple);
        }
        if (!WikiError._isWikiErrorOpts(opts, this.menu)) throw new AggregateError('No options provided for WikiError');
        this._simple = opts.simple;
        this.long = opts.long;
        if (opts.info) this.info = opts.info;
        if (!this.menu) {
            if (opts.menu) this.menu = opts.menu;
            else throw new Error('No menu provided for WikiError');
        }
        if (!(err instanceof Error)) err = new Error(err?.toString() || this.simple);
        if (!(err instanceof WikiError)) Object.assign(this, err);
    }
    static _isWikiErrorOpts(_e: any, menu?: Menu): _e is WikiErrorOpts {
        let r = true;
        const e = <WikiErrorOpts>_e;
        if (menu && !e.menu) e.menu = menu;
        if (typeof e !== 'object') r = false;
        if (typeof e.simple !== 'string') r = false;
        if (typeof e.long !== 'string') r = false;
        // @ts-ignore
        if (!e.menu?.error) r = false;
        return r;
    }
    reinit() {
        return WikiError.bind(this);
    }
    send() {
        // eslint-disable-next-line
        if (notifs) notifs.error(this.simple);
        else alert(this.simple);
        this.menu.error(this);
    }
}

export class Wiki {
    menu: Menu;
    lang?: string;
    error: typeof WikiError;
    #boundMsgHandle?: (msg: MessageEvent) => void;
    constructor(menu: Menu) {
        this.menu = menu;
        this.error = new WikiError({
            simple: '',
            long: '',
            menu: this.menu
        }).reinit();
    }
    fetchArticle(page: string, opts?: Record<string, string>) {
        let url = new URL(`https://en.wikipedia.org/api/rest_v1/page/html/${page}`);
        if (opts) url = this._opts(url, opts);
        return ky.get(url.href, {
            headers: {
                "Api-User-Agent": "w1kirace (https://github.com/r0wanda/w1kirace)"
            }
        }).text();
    }
    _opts(url: URL, opts: Record<string, string>) {
        if (opts && typeof opts === 'object') {
            try {
                for (const k in opts) {
                    url.searchParams.set(k, opts[k])
                }
            } catch { void 0; }
        }
        return url;
    }
    search(q: string, opts?: SearchOptions) {
        const project = opts?.project ?? 'wikipedia';
        const limit = opts?.limit ?? 10;
        const lang = opts?.language ?? this.lang ?? 'en';
        return ky.get(`https://api.wikimedia.org/core/v1/${project}/${lang}/search/page?q=${q}${limit === undefined ? '' : `&limit=${limit}`}`);
    }
    frame(html: string) {
        const b = new Blob([html], {
            type: 'text/html',
            endings: 'native'
        });
        const url = URL.createObjectURL(b);
        this.menu.setFrameUrl(url);
    }
    async inject(html: string) {
        const arr = html.split('</head>');
        const js = await ky.get('/inject.js').text();
        const resizer = await ky.get('https://cdn.jsdelivr.net/npm/@iframe-resizer/child@5').text();
        arr[0] += `<script>${resizer}</script><script>${js}</script>`;
        arr[0] = arr[0].replace(/\/w\/load\.php/g, 'https://en.wikipedia.org/w/load.php');
        return arr.join('</head>');
    }
    async loadFrame(article: string) {
        let art;
        try {
            art = await this.fetchArticle(article);
        } catch (err) {
            new this.error(err, {
                simple: 'Couldn\'t find article',
                long: 'Couldn\'t find article, try clicking the search result or link again',
                info: 'Some error occured while trying to retrieve the article from Wikipedia'
            }).send();
            return;
        }
        try {
            art = await this.inject(art);
        } catch (err) {
            new this.error(err, {
                simple: 'Error injecting script',
                long: 'Error injecting script, try clicking the search result or link again',
                info: 'The script injection monitors which Wikipedia page is open'
            }).send();
            return;
        }
        try {
            this.frame(art);
        } catch (err) {
            new this.error(err, {
                simple: 'Error loading iframe',
                long: 'Error loading iframe, try clicking the search result or link again',
                info: 'The iframe displays the Wikipedia page'
            }).send();
            return;
        }
    }
    initMsgHandle() {
        this.#boundMsgHandle = this.msgHandle.bind(this);
        window.addEventListener('message', this.#boundMsgHandle);
    }
    removeMsgHandle() {
        if (!this.#boundMsgHandle) return;
        window.addEventListener('message', this.#boundMsgHandle);
        this.#boundMsgHandle = undefined;
    }
    msgHandle(msg: MessageEvent) {
        console.log(msg)
    }
}
