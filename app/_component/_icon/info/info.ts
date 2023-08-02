import Icon from "../icon";
import declareComponent from "../../../lib/declareComponent";

export default class InfoIcon extends Icon {
  pug() {
    return require("./info.pug").default
  }
  stl() {
    return super.stl() + require("./info.css").toString()
  }
}

declareComponent("info-icon", InfoIcon)
