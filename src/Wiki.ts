// @ts-ignore
const ky: typeof import('../node_modules/ky/distribution/index.d.ts').default = (await import('https://cdn.jsdelivr.net/npm/ky@1/+esm')).default;

class Wiki {

}

window.addEventListener('load', async () => {
    console.log(await ky.get('https://api.wikimedia.org/core/v1/wikipedia/en/search/page?q=seattle&limit=10').json());
});

export {};
