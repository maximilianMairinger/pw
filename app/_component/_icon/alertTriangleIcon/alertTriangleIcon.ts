import Icon from "../icon";
import declareComponent from "../../../lib/declareComponent";

export default class AlertTriangleIcon extends Icon {
  pug() {
    return require("./alertTriangleIcon.pug").default
  }
  stl() {
    return super.stl() + require("./alertTriangleIcon.css").toString()
  }
}

declareComponent("alert-triangle-icon", AlertTriangleIcon)
