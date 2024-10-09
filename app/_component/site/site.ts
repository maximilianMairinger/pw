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


export const notification = new NotificationBar()

export default class Site extends Component {
  protected body: BodyTypes


  constructor() {
    super()



    this.apd(notification)


    
    editor.create(this.body.editor as HTMLElement, {
      automaticLayout: true,
      language: "plaintext",
      minimap: {enabled: false}
    })


    // @ts-ignore
    window.popup = this.body.popup

  }
  loginOrRegister() {
    
  }

  stl() {
    return require("../../../node_modules/monaco-editor/min/vs/editor/editor.main.css").toString() + require("./site.css").toString()
  }
  pug() {
    return require("./site.pug").default
  }
}

declareComponent("site", Site)

