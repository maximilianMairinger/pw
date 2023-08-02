import Icon from "../icon";
import declareComponent from "../../../lib/declareComponent";

export default class AlertTriangleIcon extends Icon {
  pug() {
    return require("./alertTriangle.pug").default
  }
  stl() {
    return super.stl() + require("./alertTriangle.css").toString()
  }
}

declareComponent("alert-triangle-icon", AlertTriangleIcon)
