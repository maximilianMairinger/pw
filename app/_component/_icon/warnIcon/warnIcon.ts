import Icon from "../icon";
import declareComponent from "../../../lib/declareComponent";

export default class WarnIcon extends Icon {
  pug() {
    return require("./warn.pug").default
  }
  stl() {
    return super.stl() + require("./warn.css").toString()
  }
}

declareComponent("warn-icon", WarnIcon)
