import Component from "../component"
import declareComponent from "../../lib/declareComponent"
import {editor} from "monaco-editor"

export default class Site extends Component {

  constructor() {
    super(undefined, undefined, false)

    // this.append(ce("style").apd(this.stl()), this.pug())

    editor.create(this.querySelector("editor-container") as HTMLElement, {
      automaticLayout: true,
      language: "typescript",

    })


  }

  stl() {
    return require("./site.csss").toString()
  }
  pug() {
    return require("./site.pug").default
  }
}

declareComponent("site", Site)
