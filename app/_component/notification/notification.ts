import Component from "../component"
import declareComponent from "../../lib/declareComponent"
import { Data, DataBase } from "josm"




export type NotificationLevel = "log" | "warn" | "error" | "success"


export default class Notification extends Component {

  public level = new Data() as Data<NotificationLevel>
  public bodyText: Data<string>
  public headingText: Data<string>


  constructor(heading: string | Data<string> = "", body: string | Data<string> = "", level: NotificationLevel = "log") {
    super()


    this.headingText = heading instanceof Data ? heading : new Data(heading)
    this.bodyText = body instanceof Data ? body : new Data(body)

    const onlyOneText = this.bodyText.tunnel(txt => txt === "")

    onlyOneText.get((onlyOne) => {
      if (onlyOne) this.componentBody.addClass("onlyOneText")
      else this.componentBody.removeClass("onlyOneText")
    })



    this.body.header.txt(this.headingText)
    this.body.body.txt(this.bodyText)

    
    this.level.set(level)

    this.level.get((level) => {
      this.componentBody.setAttribute("level", level)
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

