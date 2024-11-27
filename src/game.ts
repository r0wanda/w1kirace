declare const Peer: typeof import('../node_modules/peerjs/dist/types.d.ts').default;

interface Meta {
    peerServer?: string;
    discord: boolean;
    public: boolean;
    joining: boolean;
    id: string;
}
class Game extends Peer {
    constructor() {
        super();
    }
    static meta(): Meta {
        const url = new URL(window.location.href);
        let meta: Meta;
        try {
            meta = JSON.parse(url.searchParams.get('meta') || '{}');
        } catch (err) {
            //redir
            throw new Error(); // TODO: replace
        }
        return meta;
    }
}