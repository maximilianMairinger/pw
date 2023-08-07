import Component from "../component"
import declareComponent from "../../lib/declareComponent"
import Notification from "../notification/notification"
import { Data } from "josm"
import { BodyTypes } from "./pugBody.gen"; import "./pugBody.gen"




type txt = string | Data<string>



export default class NotificationBar extends Component<false> {
  protected body: BodyTypes
  
  constructor() {
    super(false)

  }

  log(heading: txt, body?: txt) {
    const noti = new Notification(heading, body, "log")
    this.append(noti)
  }

  // warn(heading: txt, body?: txt) {
  //   const noti = new Notification(heading, body, "warn")
  //   this.apd(noti)
  // }

  error(heading: txt, body?: txt) {
    const noti = new Notification(heading, body, "error")
    this.append(noti)
  }

  success(heading: txt, body?: txt) {
    const noti = new Notification(heading, body, "success")
    this.append(noti)
  }

  stl() {
    return require("./notificationBar.css").toString()
  }
  pug() {
    return require("./notificationBar.pug").default
  }
}

declareComponent("notification-bar", NotificationBar)

