import { memoize } from "key-index"
import { Data, DataBase, DataCollection, ReadonlyData } from "josm";
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

  public isScrollAble: {
    x: ReadonlyData<boolean>,
    y: ReadonlyData<boolean>
  }


  constructor() {
    super(false)
  }

  connectedCallback() {
    const scrollLength = this.body.overflow.resizeDataBase()
    const containerLen = this.resizeDataBase()


    for (const dir of ["x", "y"] as const) {
      const lenVerb = dirToLenIndex[dir]
      containerLen[lenVerb].get((len) => {
        this.css(`--gen-1-percent-of-${lenVerb}` as any, `${len * .01}px`)
      })
    }

    
    const atEnd = new DataBase({
      top: false,
      bot: false,
      left: false,
      right: false
    })



    
    atEnd((_, diff) => {
      for (const dir in diff) {
        this[diff[dir] ? "addClass" : "removeClass"](`at${capitalize(dir)}End`)
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
            // This timeout is a quickfix. Currently subscribing to another data inside a data.get callback will cause the callback cause the inner callback to not actually subscribe, but instead only work once. We have such a situation here, as the scrollTrigger memoisation calls the tunnel function which subscribes.
            setTimeout(() => {
              if (enabled) scrollTrigger().on(wards, func)
              else scrollTrigger().off(wards, func)
            })
          }, this.scrollEnabled[dir].get())
        }
      }
    }


    this.isScrollAble = {} as any
    for (const dir of ["x", "y"] as const) {
      const scrollAble = this.isScrollAble[dir] = new Data(false)
      new DataCollection(this.scrollEnabled[dir], scrollLength[dirToLenIndex[dir]], containerLen[dirToLenIndex[dir]]).get((enabled, scrollLength, containerLen) => {
        if (enabled) scrollAble.set(scrollLength > containerLen)
        else scrollAble.set(false)
      })

      scrollAble.get((scrollAble) => {
        this[scrollAble ? "addClass" : "removeClass"](`scrollAble${dir.toUpperCase()}`)
      })
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



const dirToLenIndex = {
  x: "width",
  y: "height"
} as const


function capitalize(s: string) {
  return s[0].toUpperCase() + s.slice(1)
}
