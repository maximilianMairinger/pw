import Icon from "../icon";
import declareComponent from "../../../lib/declareComponent";

export default class Fire2OutlineIcon extends Icon {
  pug() {
    return require("./fire2OutlineIcon.pug").default
  }
  stl() {
    return super.stl() + require("./fire2OutlineIcon.css").toString()
  }
}

declareComponent("fire2-outline-icon", Fire2OutlineIcon)
