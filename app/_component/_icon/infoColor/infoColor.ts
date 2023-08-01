import Icon from "../icon";
import declareComponent from "../../../lib/declareComponent";

export default class InfoColorIcon extends Icon {
  pug() {
    return require("./infoColor.pug").default
  }
  stl() {
    return super.stl() + require("./infoColor.css").toString()
  }
}

declareComponent("info-color-icon", InfoColorIcon)
