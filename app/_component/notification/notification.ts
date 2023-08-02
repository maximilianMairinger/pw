import Component from "../component"
import declareComponent from "../../lib/declareComponent"
import { Data, DataBase } from "josm"
import "./../_icon/x/x"

const iconImportIndex = {
  log: () => import("./../_icon/info/info"),
  warn: () => import("./../_icon/warn/warn"),
  error: () => import("./../_icon/fire2Fill/fire2Fill"),
  success: () => import("./../_icon/check/check")
}


export type NotificationLevel = "log" | "warn" | "error" | "success"

export default class Notification extends Component {

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

    
  
  }

  stl() {
    return require("./notification.css").toString()
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
