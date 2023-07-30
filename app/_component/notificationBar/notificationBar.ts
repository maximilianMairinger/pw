import Component from "../component"
import declareComponent from "../../lib/declareComponent"
import Notification from "../notification/notification"
import { Data } from "josm"




type txt = string | Data<string>



export default class NotificationBar extends Component {

  constructor() {
    super()

  }

  log(heading: txt, body?: txt) {
    const noti = new Notification(heading, body, "log")
    this.apd(noti)
  }

  // warn(heading: txt, body?: txt) {
  //   const noti = new Notification(heading, body, "warn")
  //   this.apd(noti)
  // }

  error(heading: txt, body?: txt) {
    const noti = new Notification(heading, body, "error")
    this.apd(noti)
  }

  success(heading: txt, body?: txt) {
    const noti = new Notification(heading, body, "success")
    this.apd(noti)
  }

  stl() {
    return require("./notificationBar.css").toString()
  }
  pug() {
    return require("./notificationBar.pug").default
  }
}

declareComponent("notification-bar", NotificationBar)

