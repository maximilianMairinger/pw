import Component from "../component"


export default abstract class Icon extends Component<false> {
  constructor(strength?: "weak" | "strong" | null) {
    super(false)
    if (strength === undefined) strength = "strong"
    if (strength !== null) this.addClass(strength)
  }
  stl() {
    return require("./icon.css").toString()
  }
}
