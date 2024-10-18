import tippy from "tippy.js"
document.head.insertAdjacentHTML("beforeend", `<style name="tippyStyles">${require("tippy.js/dist/tippy.css").toString() + require('tippy.js/animations/shift-away-subtle.css').toString()}</style>`)
import { Data, ReadonlyData, instanceTypeSym } from "josm"


/**
 * https://atomiks.github.io/tippyjs/
 */
export const makeTippy = ((root: HTMLElement, optionalProps?: any) => {
  if (optionalProps.content === undefined) throw new Error("content is required")
  if (typeof optionalProps.content === "object" && optionalProps.content[instanceTypeSym] === "Data") {
    const data = optionalProps.content
    optionalProps.content = data.get()
    data.get((s: string) => {
      tip.setContent(s)
    }, false)
  }
  if (!("animation" in optionalProps)) optionalProps.animation = 'shift-away-subtle' 

  const tip = tippy(root, optionalProps)
  return tip
}) as any as ((root: HTMLElement, optionalProps?: Omit<Parameters<typeof tippy>[1], "content"> & {content: string | ReadonlyData<string>}) => Omit<ReturnType<typeof tippy>[number], "setContent">)
export default makeTippy
