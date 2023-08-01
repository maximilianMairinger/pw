import Icon from "../icon";
import declareComponent from "../../../lib/declareComponent";


export default declareComponent("fire-fill-icon", class FireFillIcon extends Icon {
  pug() {
    return require("./fireFill.pug").default
  }
  stl() {
    return super.stl() + require("./fireFill.css").toString()
  }
})
