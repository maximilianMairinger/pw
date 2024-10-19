import delay from "tiny-delay";
import declareComponent from "../../lib/declareComponent"
import Component from "../component"
import { BodyTypes } from "./pugBody.gen"; import "./pugBody.gen"
import { Data } from "josm";
import Input from "../_themeAble/_focusAble/_formUi/_editAble/input/input";
import { morphComputedStyle } from "../../lib/morphStyle";
import { latestLatent } from "more-proms";
import sanitize, { ensure, numberLikePattern, regex, AND } from "sanitize-against";
import { site } from "../../main";
import { Head } from "fast-linked-list";





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





    this.body.username.validation.set(sanitize(
      new AND(
        regex(/^.{1,}$/, "Username must be non empty"),
        regex(/^.{0,35}$/, "Username must shorter than 36 characters"), 
        regex(/^[0-9A-Za-z\-\_]*$/, "Username can only contain letters or number"),
        (username) => {
          if (this.falseUserNamePwIndex.has(JSON.stringify([username, this.body.password.value.get()]))) {
            throw new Error("Username or password is wrong")
          }
          return username
        }
      )
    ))

    this.body.password.validation.set(sanitize(
      new AND(
        String,
        (password) => {
          if (this.falseUserNamePwIndex.has(JSON.stringify([this.body.username.value.get(), password]))){
            throw new Error("Username or password is wrong")
          }
          return password
        }
      )
    ))


    this.pwConfirmInput.validation.set(sanitize(ensure((pw) => pw === this.body.password.value.get(), "Passwords don't match")) as any)

  }

  private falseUserNamePwIndex = new Set()
  private falseUserNameIndex = new Set()

  query(check: (mode: "login" | "register", credentials: {username: string, password: string}) => (boolean | {ok: boolean, msg: Body | [Header, Body]} | Promise<boolean | {ok: boolean, msg: Body | [Header, Body]}>)) {
    this.pwConfirmInput.value.set("")
    this.body.password.value.set("")
    this.body.username.value.set("")
    this.mode.set("login")
    type Username = string
    return new Promise<Username>((res) => {
      const cb = this.body.form.submit(async (creds) => {
        const checkResP = check(this.mode.get(), creds)
        const checkRes = checkResP instanceof Promise ? await checkResP : checkResP
        const ok = typeof checkRes === "object" ? checkRes.ok : checkRes
        const msg = typeof checkRes === "object" ? checkRes.msg : null

        if (!ok) {
          if (this.mode.get() === "register") {
            this.falseUserNameIndex.add(creds.username)
            this.body.username.recalculateValidation()
          }
          else if (this.mode.get() === "login") {
            this.falseUserNamePwIndex.add(JSON.stringify([creds.username, creds.password]))
            this.body.username.recalculateValidation()
            this.body.password.recalculateValidation()
            this.body.username.on("input", () => {this.body.password.recalculateValidation()}, {once: true})
            this.body.password.on("input", () => {this.body.username.recalculateValidation()}, {once: true})
          }
          
          if (msg !== null) site.notification.error(...((msg instanceof Array ? msg : [msg]) as [string, string?]))
          else {
            if (this.mode.get() === "register") site.notification.error("Failed to register", "Your username might already be taken")
            else site.notification.error("Failed to authenticate", "Please check your username and password")
          }
          throw new Error()
        }
        else {
          if (msg !== null) site.notification.success(...((msg instanceof Array ? msg : [msg]) as [string, string?]))
          else {
            if (this.mode.get() === "register") site.notification.success("Successfully registered")
            else site.notification.success("Successfully authenticated")
          }

          res(creds.username)
          cb.remove()
        }
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


type Header = string
type Body = string