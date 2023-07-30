import Icon from "../icon";
import declareComponent from "../../../lib/declareComponent";


export default declareComponent("fire-icon", class FireIcon extends Icon {
  pug() {
    return require("./fire.pug").default
  }
})
