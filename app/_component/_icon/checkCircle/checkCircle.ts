import Icon from "../icon";
import declareComponent from "../../../lib/declareComponent";

export default class CheckCircleIcon extends Icon {
  pug() {
    return require("./checkCircle.pug").default
  }
  stl() {
    return super.stl() + require("./checkCircle.css").toString()
  }
}

declareComponent("check-circle-icon", CheckCircleIcon)
