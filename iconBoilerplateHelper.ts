// deno-lint-ignore-file 
import chokidar from "chokidar"
import { outlineSvg as _outlineSvg } from '@davestewart/outliner'
import path from "node:path"
import svgo, { Config } from "svgo"
import { paramCase } from "change-case"
import { load as cheerioHTML, Element } from "cheerio"

type outlineSvg = (content: string) => string
const outlineSvg = _outlineSvg as outlineSvg


const iconPath = "app/_component/_icon"

chokidar.watch(iconPath, { ignoreInitial: true }).on("change", (path: string) => changeFunc(path, true))
chokidar.watch(iconPath, { ignoreInitial: true }).on("add", (path: string) => changeFunc(path, false))

console.log("Running iconBoilerplateHelper")

function unifyColorIfPossible($: ReturnType<typeof cheerioHTML>, attrb: "stroke" | "fill"): ColorProps {
  const allElems = [...$(`[${attrb}]`)].filter((el) => !notReallyColors.includes(el.attribs[attrb].toLowerCase()))

  const nonEmpty = allElems.length > 0

  const colors = new Set()
  allElems.forEach((el) => {
    colors.add(el.attribs[attrb])
  })
  const onlyOneColor = colors.size === 1

  
  return {
    allElems,
    nonEmpty,
    colors, 
    onlyOneColor
  }
}


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




    const $ = cheerioHTML(content)

    const colorProps = {
      fill: unifyColorIfPossible($, "fill"),
      stroke: unifyColorIfPossible($, "stroke")
    }
    
    
    type Input = string
    type Output = string
    const decorators = [
      parseSvgDecorators.colorify(),
      parseSvgDecorators.minimize({ assumeWithoutStroke: false, pretty: true }),
    ] as ((content: Input) => Output)[]

    if (fillify) decorators.unshift(parseSvgDecorators.outline())


    const parsedSvg = decorators.reduce((acc, decorator) => decorator(acc), content)

    let color = colorProps.fill.onlyOneColor ? colorProps.fill.colors.values().next().value : undefined
    let strokeColor = colorProps.stroke.onlyOneColor ? colorProps.stroke.colors.values().next().value : undefined
    if (color === undefined && strokeColor !== undefined) {
      color = strokeColor
      strokeColor = undefined
    }

    await Deno.mkdir(path.join(iconPath, name), { recursive: true })
    await Promise.all([
      Deno.writeTextFile(path.join(iconPath, name, `${name}.pug`), parsedSvg, { createNew: true }),
      Deno.writeTextFile(path.join(iconPath, name, `${name}.ts`), tsTemplate({name}), { createNew: true }),
      Deno.writeTextFile(path.join(iconPath, name, `${name}.css`), cssTemplate({ color, strokeColor }), { createNew: true }),
      Deno.remove(pth)
    ])
    
    
    

  }
}


function capitalize(s: string) {
  return s[0].toUpperCase() + s.slice(1)
}

const tsTemplate = ({name}: {name: string}) => 
`import Icon from "../icon";
import declareComponent from "../../../lib/declareComponent";

export default class ${capitalize(name)}Icon extends Icon {
  pug() {
    return require("./${name}.pug").default
  }
  stl() {
    return super.stl() + require("./${name}.css").toString()
  }
}

declareComponent("${paramCase(name)}-icon", ${capitalize(name)}Icon)
`

const cssTemplate = ({color, strokeColor}: {color?: string, strokeColor?: string}) => color !== undefined || strokeColor !== undefined ?
`:host {${color === undefined ? "" : `
  --color: ${color};`}${strokeColor === undefined ? "" : `
  --stroke-color: ${strokeColor};`}
}
` : ""

const removeAttrs = [
  "width",
  "height",
  "class",
  "id",
  "name"
]

const strokeAttributes = [
  "stroke",
  "stroke-dasharray",
  "stroke-dashoffset",
  "stroke-width",
  "stroke-linejoin",
  "stroke-opacity",
  "stroke-linecap",
  "stroke-miterlimit"
]

const fillAttributes = [
  "fill",
  "fill-opacity",
  "fill-rule"
]

const notReallyColors = [
  "none",
  "unset",
  "transparent",
  "initial",
  "inherit",
  "currentColor"
]


type ColorProps = {
  allElems: Element[];
  nonEmpty: boolean;
  // @ts-ignore
  colors: Set<unknown>;
  onlyOneColor: boolean;
}
const parseSvgDecorators = {
  colorify: () => (content: string) => {
    const $ = cheerioHTML(content)
    const {fill, stroke} = {
      fill: unifyColorIfPossible($, "fill"),
      stroke: unifyColorIfPossible($, "stroke")
    }
    
    if (fill.nonEmpty && !stroke.nonEmpty) {
      if (fill.onlyOneColor) {
        fill.allElems.forEach((el) => {
          $(el).attr("fill", "var(--color)")
        })
      }
    }
    if (stroke.nonEmpty && !fill.nonEmpty) {
      if (stroke.onlyOneColor) {
        stroke.allElems.forEach((el) => {
          console.log("setting stroke to color")
          $(el).attr("stroke", "var(--color)")
        })
      }
    }
    if (stroke.nonEmpty && fill.nonEmpty) {
      if (fill.onlyOneColor) {
        fill.allElems.forEach((el) => {
          $(el).attr("fill", "var(--color)")
        })
      }
      if (stroke.onlyOneColor) {
        stroke.allElems.forEach((el) => {
          $(el).attr("stroke", "var(--stroke-color)")
        })
      }
    };

    return $("body").html()
  },
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


      if (assumeWithoutStroke) removeAttrs.push(...strokeAttributes)
      config.plugins?.push({
        name: "removeAttrs",
        params: {
          attrs: `(${removeAttrs.join("|")})`
        }
      })

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


