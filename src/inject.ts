function post(action: string, val?: any) {
    window.parent.postMessage({
        action,
        // eslint-disable-next-line
        val
    }, '*');
}

window.addEventListener('load', () => {
    for (const a of document.querySelectorAll('a')) {
        a.addEventListener('click', function(ev) {
            ev.preventDefault();
            post('link', this.href);
        });
    }
});