import Icon from "../icon";
import declareComponent from "../../../lib/declareComponent";

export default class WarnCircleIcon extends Icon {
  pug() {
    return require("./warnCircleIcon.pug").default
  }
  stl() {
    return super.stl() + require("./warnCircleIcon.css").toString()
  }
}

declareComponent("warn-circle-icon", WarnCircleIcon)
