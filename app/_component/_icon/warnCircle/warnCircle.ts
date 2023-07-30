import Icon from "../icon";
import declareComponent from "../../../lib/declareComponent";


export default declareComponent("warn-circle-icon", class WarnCircleIcon extends Icon {
  pug() {
    return require("./warnCircle.pug").default
  }
})
