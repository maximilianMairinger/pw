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


    this.body.button.click(async () => {
      const height = this.height()
      this.componentBody.anim({rotateX: "-90deg", scale: .5}, 550)
      this.componentBody.anim({opacity: 0}, 350)
      console.log(400 * (height + 150) / 200)
      delay(50).then(() => this.anim({marginBottom: -height}, {
        duration: 300 * (height + 150) / 200,
      })).then(() => this.remove())
    })

    
  
  }

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
