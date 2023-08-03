import Icon from "../icon";
import declareComponent from "../../../lib/declareComponent";

export default class Fire1OutlineIcon extends Icon {
  pug() {
    return require("./fire1OutlineIcon.pug").default
  }
  stl() {
    return super.stl() + require("./fire1OutlineIcon.css").toString()
  }
}

declareComponent("fire1-outline-icon", Fire1OutlineIcon)
