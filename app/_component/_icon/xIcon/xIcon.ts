import Icon from "../icon";
import declareComponent from "../../../lib/declareComponent";

export default class XIcon extends Icon {
  pug() {
    return require("./x.pug").default
  }
  stl() {
    return super.stl() + require("./x.css").toString()
  }
}

declareComponent("x-icon", XIcon)
