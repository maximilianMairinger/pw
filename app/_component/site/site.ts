import Component from "../component"
import declareComponent from "../../lib/declareComponent"
import {editor} from "monaco-editor"
import sodium from 'libsodium-wrappers';
import Notification from "../notification/notification";
import NotificationBar from "../notificationBar/notificationBar";
import * as crypto from "./../../lib/crypt"
import Input from "../_themeAble/_focusAble/_formUi/_editAble/input/input";
import BlockButton from "../_themeAble/_focusAble/_formUi/_rippleButton/_blockButton/blockButton";
import Form from "../form/form";
import { BodyTypes } from "./pugBody.gen"; import "./pugBody.gen"
import delay from "tiny-delay";
import * as client from "../../lib/msgpackClient";
import { DataBase } from "josm";


const userData = new DataBase({
  username: ""
})

export default class Site extends Component {
  protected body: BodyTypes
  public notification = new NotificationBar()


  constructor() {
    super()



    this.apd(this.notification)


    
    editor.create(this.body.editor as HTMLElement, {
      automaticLayout: true,
      language: "plaintext",
      minimap: {enabled: false},
      suggestOnTriggerCharacters: false,
      quickSuggestions: false,
      autoIndent: "none",
    });

    (async () => {
      try {
        const res = await client.post("/checkAuth", {lel: "lelelele"}) as any
        if (!res.ok) throw new Error()
        userData.username.set(res.username)
      }
      catch(e) {
        this.loginOrRegister()
      }
    })()

  }
  loginOrRegister() {
    const closePopup = this.body.popup.popup()
    this.body.login.query(async (mode, creds) => {
      try {
        const resp = await client.post(modeToReqUrl[mode], creds) as any
        if (!resp.ok) throw new Error()
        closePopup()
        client.sessionToken.set(resp.sessionToken)
        debugger
        return {
          ok: true,
          msg: [`Successfully ${mode === "login" ? "Logged in" : "Registered"}!`, `You are now logged in as ${creds.username}.`]
        }
      }
      catch(e) {
        return false
      }
    })
  }

  stl() {
    return require("../../../node_modules/monaco-editor/min/vs/editor/editor.main.css").toString() + require("./site.css").toString()
  }
  pug() {
    return require("./site.pug").default
  }
}

const modeToReqUrl = {
  login: "/login",
  register: "/addUser"
}

declareComponent("site", Site)

