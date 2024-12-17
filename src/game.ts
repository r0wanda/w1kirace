import { Wiki } from './Wiki.js';
import { Menu } from './Menu.js';

let menu: Menu;
let wiki: Wiki;

console.log('hi')

window.addEventListener('load', () => { void (async () => {
    console.log(Menu)
    menu = new Menu();
    wiki = menu.wiki;
    wiki.initMsgHandle();
    console.log(await wiki.search('seattle'));
    await wiki.loadFrame('Seattle');
})(); return; });