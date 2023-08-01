import Icon from "../icon";
import declareComponent from "../../../lib/declareComponent";

export default class CheckIcon extends Icon {
  pug() {
    return require("./check.pug").default
  }
  stl() {
    return super.stl() + require("./check.css").toString()
  }
}

declareComponent("check-icon", CheckIcon)
