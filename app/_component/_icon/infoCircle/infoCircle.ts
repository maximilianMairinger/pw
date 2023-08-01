import Icon from "../icon";
import declareComponent from "../../../lib/declareComponent";

export default class InfoCircleIcon extends Icon {
  pug() {
    return require("./infoCircle.pug").default
  }
  stl() {
    return super.stl() + require("./infoCircle.css").toString()
  }
}

declareComponent("info-circle-icon", InfoCircleIcon)
