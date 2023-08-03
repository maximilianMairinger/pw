import Icon from "../icon";
import declareComponent from "../../../lib/declareComponent";

export default class DoubleCheckIcon extends Icon {
  pug() {
    return require("./doubleCheckIcon.pug").default
  }
  stl() {
    return super.stl() + require("./doubleCheckIcon.css").toString()
  }
}

declareComponent("double-check-icon", DoubleCheckIcon)
