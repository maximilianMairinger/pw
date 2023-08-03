import Icon from "../icon";
import declareComponent from "../../../lib/declareComponent";

export default class InfoIcon extends Icon {
  pug() {
    return require("./infoIcon.pug").default
  }
  stl() {
    return super.stl() + require("./infoIcon.css").toString()
  }
}

declareComponent("info-icon", InfoIcon)
