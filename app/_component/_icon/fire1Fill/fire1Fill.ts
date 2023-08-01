import Icon from "../icon";
import declareComponent from "../../../lib/declareComponent";


export default declareComponent("fire1-fill-icon", class FireFillIcon extends Icon {
  pug() {
    return require("./fire1Fill.pug").default
  }
  stl() {
    return super.stl() + require("./fire1Fill.css").toString()
  }
})
