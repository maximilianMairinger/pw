import Component from "../component"
import declareComponent from "../../lib/declareComponent"
// import "../../../node_modules"
import {editor} from "monaco-editor"

export default class Site extends Component {

  constructor() {
    super()

    // this.append(ce("style").apd(this.stl()), this.pug())

    
    editor.create(this.body.editor as HTMLElement, {
      automaticLayout: true,
      // language: "text",
      minimap: {enabled: false}
    })


  }

  stl() {
    return require("../../../node_modules/monaco-editor/min/vs/editor/editor.main.css").toString() + require("./site.css").toString()
  }
  pug() {
    return require("./site.pug").default
  }
}

declareComponent("site", Site)

