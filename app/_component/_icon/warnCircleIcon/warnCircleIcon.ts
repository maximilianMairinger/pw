import Icon from "../icon";
import declareComponent from "../../../lib/declareComponent";

export default class WarnCircleIcon extends Icon {
  pug() {
    return require("./warnCircle.pug").default
  }
  stl() {
    return super.stl() + require("./warnCircle.css").toString()
  }
}

declareComponent("warn-circle-icon", WarnCircleIcon)
