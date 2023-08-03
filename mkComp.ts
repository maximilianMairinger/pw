// deno-lint-ignore-file 
import path from "node:path"
import { paramCase } from "change-case"


async function makeComponent(parentDir: string, name: string) {
  await Deno.mkdir(path.join(parentDir, name), { recursive: true })

  let parentCompName = path.basename(parentDir)
  if (parentCompName.startsWith("_")) parentCompName = parentCompName.slice(1)


  const tsContent = 
`import declareComponent from "./${path.relative(path.join(parentDir, name), "app/lib/declareComponent")}"
import ${capitalize(parentCompName)} from "../${parentCompName}"
import { BodyTypes } from "./${name}.types"; import "./${name}.types"

export default class ${capitalize(name)} extends ${capitalize(parentCompName)} {
  protected body: BodyTypes

  constructor() {
    super()

  }

  stl() {
    return super.stl() + require("./${name}.css").toString()
  }
  pug() {
    return require("./${name}.pug").default
  }
}

declareComponent("${paramCase(name)}", ${capitalize(name)})
`

  await Promise.all([
    Deno.writeTextFile(path.join(parentDir, name, `${name}.ts`), tsContent),
    Deno.writeTextFile(path.join(parentDir, name, `${name}.pug`), ""),
    Deno.writeTextFile(path.join(parentDir, name, `${name}.css`), ""),
  ])

}

makeComponent("app/_component", "workShop")


function capitalize(s: string) {
  return s[0].toUpperCase() + s.slice(1)
}
