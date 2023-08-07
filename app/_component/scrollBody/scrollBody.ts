import { memoize } from "key-index"
import { Data, DataBase } from "josm";
import declareComponent from "../../lib/declareComponent"
import Component from "../component"
import { BodyTypes } from "./pugBody.gen"; import "./pugBody.gen"
import { ScrollData, ElemScrollData, ScrollTrigger } from "extended-dom";
import LinkedList from "fast-linked-list";





export default class ScrollBody extends Component<false> {
  protected body: BodyTypes
  
  public scrollEnabled = {
    x: new Data(false),
    y: new Data(false)
  }


  constructor() {
    super(false)
  }

  connectedCallback() {
    const scrollLength = this.body.overflow.resizeDataBase()

    
    const atEnd = new DataBase({
      top: false,
      bot: false,
      left: false,
      right: false
    })


    
    atEnd((_, diff) => {
      for (const dir in diff) {
        this.q(`scroll-fade.${dir}`).anim({opacity: diff[dir] ? 0 : 1})
      }
    })


    for (const dir of ["x", "y"] as const) {
      this.scrollEnabled[dir].get((x) => {
        if (x) this.setAttribute(dir, "")
        else this.removeAttribute(dir)
      })
    }


    const margin = 5

    for (const { dir, len } of [{dir: "y", len: "height"}, {dir: "x", len: "width"}] as const) {
      for (const { end } of [{end: false}, {end: true}] as const) {
        const side = dir === "y" ? !end ? "top" : "bot" : !end ? "left" : "right" as const

        const scrollTrigger = memoize(() => this.scrollData(end, dir).scrollTrigger(!end ? margin : scrollLength[len].tunnel(e => e - margin)))
        
        

        for (let {wards, bool} of [{wards: "forward", bool: false}, {wards: "backward", bool: true}] as const) {
          bool = end ? !bool : bool
          const func = () => {
            atEnd[side].set(bool)
          }
          
          this.scrollEnabled[dir].get((enabled) => {
            if (enabled) scrollTrigger().on(wards, func)
            else scrollTrigger().off(wards, func)
          }, this.scrollEnabled[dir].get())
        }
      }
    }
  }
  x(x: string) {
    this.scrollEnabled.x.set(x !== null)
  }
  y(y: string) {
    this.scrollEnabled.y.set(y !== null)
  }

  stl() {
    return super.stl() + require("./scrollBody.css").toString()
  }
  pug() {
    return require("./scrollBody.pug").default
  }
}

declareComponent("c-scroll-body", ScrollBody)





