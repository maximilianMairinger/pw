import Icon from "../icon";
import declareComponent from "../../../lib/declareComponent";

export default class DoubleCheckIcon extends Icon {
  pug() {
    return require("./doubleCheck.pug").default
  }
  stl() {
    return super.stl() + require("./doubleCheck.css").toString()
  }
}

declareComponent("double-check-icon", DoubleCheckIcon)
