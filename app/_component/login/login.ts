import delay from "tiny-delay";
import declareComponent from "../../lib/declareComponent"
import Component from "../component"
import { BodyTypes } from "./pugBody.gen"; import "./pugBody.gen"

export default class Login extends Component {
  protected body: BodyTypes

  constructor() {
    super()
    this.body.form.submitElement(this.body.submit);
  }

  headingText(txt: string) {
    this.body.heading.txt(txt)
  }

  query() {
    return new Promise<{username: string, password: string}>((res) => {
      const cb = this.body.form.submit(async (e) => {
        res(e)
        cb.remove()
      })
    })
  }

  stl() {
    return super.stl() + require("./login.css").toString()
  }
  pug() {
    return require("./login.pug").default
  }
}

declareComponent("c-login", Login)
