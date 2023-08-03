import Icon from "../icon";
import declareComponent from "../../../lib/declareComponent";

export default class WarnIcon extends Icon {
  pug() {
    return require("./warnIcon.pug").default
  }
  stl() {
    return super.stl() + require("./warnIcon.css").toString()
  }
}

declareComponent("warn-icon", WarnIcon)
