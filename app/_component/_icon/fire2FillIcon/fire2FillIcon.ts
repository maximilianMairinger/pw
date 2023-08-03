import Icon from "../icon";
import declareComponent from "../../../lib/declareComponent";

export default class Fire2FillIcon extends Icon {
  pug() {
    return require("./fire2FillIcon.pug").default
  }
  stl() {
    return super.stl() + require("./fire2FillIcon.css").toString()
  }
}

declareComponent("fire2-fill-icon", Fire2FillIcon)
