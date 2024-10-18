import delay from "tiny-delay";
import declareComponent from "../../lib/declareComponent"
import Component from "../component"
import { BodyTypes } from "./pugBody.gen"; import "./pugBody.gen"
import { Data } from "josm";
import Input from "../_themeAble/_focusAble/_formUi/_editAble/input/input";
import { morphComputedStyle } from "../../lib/morphStyle";
import { latestLatent } from "more-proms";
import sanitize, { ensure, numberLikePattern, regex } from "sanitize-against";





export default class Login extends Component {
  protected body: BodyTypes
  private pwConfirmInput = new Input("Confirm password").css("opacity", 0).addClass("pw2")
  private mode = new Data("login" as "login" | "register")

  constructor() {
    super()
    this.body.form.submitElement(this.body.submit);


    const mode = this.mode
    this.body.switchMode.click(() => {
      mode.set(mode.get() === "login" ? "register" : "login")
    })

    const pwConfirmInput = this.pwConfirmInput
    pwConfirmInput.setAttribute("type", "password")



    const addPwConfirmInput = () => {
      this.body.form.insertAfter(pwConfirmInput, this.body.password)
    }
    const rmPwConfirmInput = () => {
      pwConfirmInput.remove()
    }

    const morphPwConfirm = morphComputedStyle([this.body.form, pwConfirmInput], "height", undefined, 0)
    mode.get((mode) => {
      if (mode === "login") {
        this.body.submit.content("Login")
        this.body.switchMode.content("Register instead")
        this.body.heading.txt("Login")
      } else {
        this.body.submit.content("Register")
        this.body.switchMode.content("Login instead")
        this.body.heading.txt("Register")
      }
    })

    const animInPwConf = async () => {
      addPwConfirmInput()
      await pwConfirmInput.anim({opacity: 1})
    }

    const animOutPwConf = latestLatent(async () => {
      await pwConfirmInput.anim({opacity: 0})
    }).then(() => {
      rmPwConfirmInput()
    })

    // @ts-ignore
    window.login = this

    mode.get((mode) => {
      if (mode === "login") morphPwConfirm(rmPwConfirmInput, addPwConfirmInput, animOutPwConf)
      else morphPwConfirm(addPwConfirmInput, rmPwConfirmInput, animInPwConf)
    }, false)





    this.body.username.validate = sanitize(regex(/^[0-9A-Za-z\-\_]{1,32}$/)) as any
    this.pwConfirmInput.validate = sanitize(ensure((pw) => pw === this.body.password.value.get(), "Passwords don't match")) as any

  }

  query() {
    this.pwConfirmInput.value.set("")
    this.body.password.value.set("")
    this.body.username.value.set("")
    this.mode.set("login")
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
