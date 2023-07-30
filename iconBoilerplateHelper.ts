// deno-lint-ignore-file 
import chokidar from "chokidar"
import { outlineSvg as _outlineSvg } from '@davestewart/outliner'
import path from "node:path"
import svgo, { Config } from "svgo"
import { paramCase } from "change-case"

type outlineSvg = (content: string) => string
const outlineSvg = _outlineSvg as outlineSvg


const iconPath = "app/_component/_icon"

chokidar.watch(iconPath, { ignoreInitial: true }).on("change", (path: string) => changeFunc(path, true))
chokidar.watch(iconPath, { ignoreInitial: true }).on("add", (path: string) => changeFunc(path, false))

console.log("Running iconBoilerplateHelper")


async function changeFunc(pth: string, change: boolean) {
  const stat = await Deno.stat(pth)
  if (stat.isFile) {
    const content = await Deno.readTextFile(pth)
    if (content === "") return
    if (!pth.endsWith(".svg")) return
  
    const nameAr = pth.split("/").pop()?.split(".")
    if (nameAr === undefined) return
    nameAr.pop()
    let name = nameAr.join(".")
    if (name === undefined) return

    const fillifyVerb = nameAr.pop()
    const fillify = fillifyVerb === "fillify"

    if (fillify) {
      name = nameAr.join(".")
    }

    console.log(`Running ${name}` + (fillify ? ` and fillifying` : ""))
    
    
    type Input = string
    type Output = string
    const decorators = [
      parseSvgDecorators.minimize({ assumeWithoutStroke: false, pretty: true }),
    ] as ((content: Input) => Output)[]

    if (fillify) decorators.unshift(parseSvgDecorators.outline())


    const parsedSvg = decorators.reduce((acc, decorator) => decorator(acc), content)
    

    await Deno.mkdir(path.join(iconPath, name), { recursive: true })
    await Promise.all([
      Deno.writeTextFile(path.join(iconPath, name, `${name}.pug`), parsedSvg, { createNew: true }),
      Deno.writeTextFile(path.join(iconPath, name, `${name}.ts`), indexTsTemplate(name), { createNew: true }),
      Deno.remove(pth)
    ])
    
    
    

  }
}


function capitalize(s: string) {
  return s[0].toUpperCase() + s.slice(1)
}

const indexTsTemplate = (name: string) => 
`import Icon from "../icon";
import declareComponent from "../../../lib/declareComponent";

export default class ${capitalize(name)}Icon extends Icon {
  pug() {
    return require("./${name}.pug").default
  }
}

declareComponent("${paramCase(name)}-icon", ${capitalize(name)}Icon)
`



const parseSvgDecorators = {
  minimize: ({assumeWithoutStroke = false, pretty = true}: {assumeWithoutStroke?: boolean, pretty?: boolean}) => (content: string) => {
    try {
      const config = {
        multipass: true,
        plugins: [
          'preset-default'
        ]
      } as Config

      if (pretty) config.js2svg = {
        indent: 2,
        pretty: true
      }

      config.plugins?.push(...(assumeWithoutStroke ? [
        {
          name: "removeAttrs",
          params: {
            attrs: "(width|height|stroke|stroke-width|stroke-linejoin|class|id|stroke-opacity|stroke-linecap|stroke-miterlimit)"
          }
        }
      ] : [
        {
          name: "removeAttrs",
          params: {
            attrs: "(width|height|class|id|name)"
          }
        }
      ]))



      const result = svgo.optimize(content, config)
    
    

      const out = result?.data ?? content

      return out
    }
    catch(e) {
      console.log("error parsing svg")
      return content
    }
  },
  outline: () => outlineSvg




}


