import Component from "../component"
import declareComponent from "../../lib/declareComponent"
import Notification, { NotificationLevel } from "../notification/notification"
import { Data } from "josm"
import { BodyTypes } from "./pugBody.gen"; import "./pugBody.gen"




type txt = string | Data<string>



export default class NotificationBar extends Component<false> {
  protected body: BodyTypes
  
  constructor() {
    super(false)


    let lastCloseAllBtnHolder: Notification | undefined
    this.currentCloseAllBtnHolder.get((noti: Notification | undefined) => {
      if (lastCloseAllBtnHolder !== undefined) lastCloseAllBtnHolder.showCloseAllButtonData.set(false)
      if (noti !== undefined) noti.showCloseAllButtonData.set(true)
      lastCloseAllBtnHolder = noti
    }, false)
    
  }

  log(heading: txt, body?: txt) {
    this.apdNoti(heading, body, "log")
  }

  // warn(heading: txt, body?: txt) {
  //   this.apdNoti(heading, body, "warn")
  // }

  error(heading: txt, body?: txt) {
    this.apdNoti(heading, body, "error")
  }

  success(heading: txt, body?: txt) {
    this.apdNoti(heading, body, "success")
  }

  private closeAll() {
    for (let i = 0; i < this.children.length; i++) {
      const elem = this.children[i] as Notification;
      elem.close(true)
    }
  }

  private currentCloseAllBtnHolder = new Data<Notification>(undefined)

  private apdNoti(heading: txt, body?: txt, lvl?: NotificationLevel | Data<NotificationLevel>) {
    const noti = new Notification(heading, body, lvl)
    this.prepend(noti)
    noti.show()
    noti.addCloseAllBtnCb(this.closeAll.bind(this));
    this.currentCloseAllBtnHolder.set(this.children.length > 1 ? noti : undefined)
    noti.xPressed.then(() => {
      this.currentCloseAllBtnHolder.set(this.children.length > 2 ? this.children[this.children[0] === noti ? 1 : 0] as Notification : undefined)
      noti.close()
    })
  }

  

  stl() {
    return require("./notificationBar.css").toString()
  }
  pug() {
    return require("./notificationBar.pug").default
  }
}

declareComponent("notification-bar", NotificationBar)

