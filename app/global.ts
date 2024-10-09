import polyfill from "extended-dom"
import "xrray"


export default async function() {
  await polyfill()
  //@ts-ignore
  global.log = console.log
  //@ts-ignore
  global.ce = function(name: string, attrbs?: any) {
    const el = document.createElement(name)
    if (attrbs) {
      for (const key in attrbs) {
        el.setAttribute(key, attrbs[key])
      }
    }
    return el
  }
}

declare global {
  function log(...msg: any[]): void
  
  function ce<K extends keyof HTMLElementTagNameMap>(tagName: K, attrbs?: { [key: string]: string }): HTMLElementTagNameMap[K];
  function ce(name: string) : HTMLElement;
}



