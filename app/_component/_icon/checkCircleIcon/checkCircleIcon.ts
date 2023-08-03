import Icon from "../icon";
import declareComponent from "../../../lib/declareComponent";

export default class CheckCircleIcon extends Icon {
  pug() {
    return require("./checkCircleIcon.pug").default
  }
  stl() {
    return super.stl() + require("./checkCircleIcon.css").toString()
  }
}

declareComponent("check-circle-icon", CheckCircleIcon)
