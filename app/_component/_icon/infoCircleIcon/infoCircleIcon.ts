import Icon from "../icon";
import declareComponent from "../../../lib/declareComponent";

export default class InfoCircleIcon extends Icon {
  pug() {
    return require("./infoCircleIcon.pug").default
  }
  stl() {
    return super.stl() + require("./infoCircleIcon.css").toString()
  }
}

declareComponent("info-circle-icon", InfoCircleIcon)
