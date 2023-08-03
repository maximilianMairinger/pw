import Icon from "../icon";
import declareComponent from "../../../lib/declareComponent";

export default class XIcon extends Icon {
  pug() {
    return require("./xIcon.pug").default
  }
  stl() {
    return super.stl() + require("./xIcon.css").toString()
  }
}

declareComponent("x-icon", XIcon)
