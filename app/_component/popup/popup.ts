import { ResablePromise } from "more-proms";
import blurEverythingInBackground from "../../lib/blurBackground";
import declareComponent from "../../lib/declareComponent"
import Component from "../component"
import { BodyTypes } from "./pugBody.gen"; import "./pugBody.gen"

export default class Popup extends Component {
  protected body: BodyTypes

  constructor() {
    super()


  }

  popup() {
    const doneProm = new ResablePromise()
    const blur = blurEverythingInBackground(this.componentBody, doneProm)
    if (!blur.canOpen) return
    const { done } = blur
    this.componentBody.anim([{opacity: 1, translateY: -20, offset: 0}, {opacity: 1, translateY: 0}])
    this.componentBody.css({pointerEvents: "all"})

    done.then((e) => {
      this.componentBody.css({pointerEvents: "none"})
      const velDef = e instanceof Event && e.type === "scroll" && (e as any).velocity !== undefined
      if (velDef) {
        if ((e as any).velocity.y !== 0) this.componentBody.anim({opacity: 0, translateY: Math.sign((e as any).velocity.y) * -20})
        else if ((e as any).velocity.y !== 0) this.componentBody.anim({opacity: 0, translateX: Math.sign((e as any).velocity.x) * -20})
      }
      else this.componentBody.anim({opacity: 0, translateY: -20})
    })

    return () => {
      doneProm.res()
    }
  }

  stl() {
    return super.stl() + require("./popup.css").toString()
  }
  pug() {
    return require("./popup.pug").default
  }
}

declareComponent("c-popup", Popup)
