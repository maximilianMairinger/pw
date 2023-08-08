import Component from "../component"
import declareComponent from "../../lib/declareComponent"
import { Data, DataBase } from "josm"
import { BodyTypes } from "./pugBody.gen"; import "./pugBody.gen"
import Easing from "waapi-easing"
import delay from "tiny-delay"


const iconImportIndex = {
  log: () => import("../_icon/infoIcon/infoIcon"),
  warn: () => import("../_icon/warnIcon/warnIcon"),
  error: () => import("../_icon/fire2FillIcon/fire2FillIcon"),
  success: () => import("./../_icon/checkIcon/checkIcon")
}


export type NotificationLevel = "log" | "warn" | "error" | "success"

export default class Notification extends Component {
  protected body: BodyTypes

  public level: Data<NotificationLevel>
  public bodyText: Data<string>
  public headingText: Data<string>


  constructor(heading: string | Data<string> = "", body: string | Data<string> = "", level: NotificationLevel | Data<NotificationLevel> = "log") {
    super()

    this.headingText = heading instanceof Data ? heading : new Data(heading)
    this.bodyText = body instanceof Data ? body : new Data(body)
    this.level = level instanceof Data ? level : new Data(level)

    const onlyOneText = this.bodyText.tunnel(txt => txt === "")

    onlyOneText.get((onlyOne) => {
      if (onlyOne) this.componentBody.addClass("onlyOneText")
      else this.componentBody.removeClass("onlyOneText")
    })

    this.body.header.txt(this.headingText)
    this.body.body.txt(this.bodyText)


    const setIcon = latestLatentRequest(async (icon: NotificationLevel) => (await iconImportIndex[icon]()).default, (Icon) => {
      const icon = new Icon()
      this.body.icon.html(icon)
    })

    this.level.get((level) => {
      this.componentBody.setAttribute("level", level)
      setIcon(level)
    })


    this.xPressed = new Promise((res) => {
      this.body.button.click(async () => {
        res()
      })
    })
    

    this.showCloseAllButtonData.get(latestLatentRequest(async (show) => {
      if (!show) await delay(10)
      return show
    }, (show) => {
      if (!this.closing) this.componentBody[show ? "addClass" : "removeClass"]("showCloseAllButton")
    }), false)

    
    this.showCloseAllButtonData.get(latestLatentRequest(async (show) => {
      if (show) await this.body.closeAllBtnContainer.css("display", "flex").anim({opacity: 1})
      else await this.body.closeAllBtnContainer.anim({opacity: 0})
      return show
    }, (show) => {
      if (!show) this.body.closeAllBtnContainer.hide()
    }))

  }

  private closing = false
  public close(allAtOnce = false) {
    this.closing = true
    if (allAtOnce) {
      this.componentBody.anim({scale: .9, rotateX: "-30deg"}, 550)
      this.componentBody.anim({opacity: 0}, 350)
    }
    else {
      const height = this.height()
      this.componentBody.anim({rotateX: "-90deg", scale: .5}, 550)
      this.componentBody.anim({opacity: 0}, 350)
      delay(50).then(() => this.anim({marginBottom: -height}, 300 * (height + 150) / 200))
      .then(() => this.remove())
    }
  }

  show() {
    const height = this.height()
    const marginBot = this.css("marginBottom")
    this.css({marginBottom: -height}).anim({marginBottom: marginBot}, 300 * (height + 150) / 200)
    this.componentBody.anim({opacity: 1}, 350)
    this.componentBody.css({rotateX: "-60deg", scale: .5}).anim({rotateX: "0deg", scale: 1}, 350)
    return this
  }

  public showCloseAllButtonData = new Data(false)
  public addCloseAllBtnCb(cb: () => void) {
    this.body.closeAllBtn.click(cb)
  }

  public xPressed: Promise<void>

  stl() {
    return super.stl() + require("./notification.css").toString()
  }
  pug() {
    return require("./notification.pug").default
  }
}

declareComponent("notification", Notification)

function latestLatentRequest<Args extends unknown[], Ret>(cb: (...args: Args) => Promise<Ret>, then: (ret: Ret) => void) {
  let globalRecent = Symbol()
  return async function request(...args: Args) {
    const recent = globalRecent = Symbol()
    const ret = await cb(...args)
    if (globalRecent === recent) then(ret)
  }
}
