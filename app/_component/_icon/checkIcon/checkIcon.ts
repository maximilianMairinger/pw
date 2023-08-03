import Icon from "../icon";
import declareComponent from "../../../lib/declareComponent";

export default class CheckIcon extends Icon {
  pug() {
    return require("./checkIcon.pug").default
  }
  stl() {
    return super.stl() + require("./checkIcon.css").toString()
  }
}

declareComponent("check-icon", CheckIcon)
