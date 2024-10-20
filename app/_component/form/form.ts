import Component from "../component"
import FormUi from "../_themeAble/_focusAble/_formUi/formUi"
import EditAble from "../_themeAble/_focusAble/_formUi/_editAble/editAble"
import SelectButton from "../_themeAble/_focusAble/_formUi/_rippleButton/_blockButton/selectButton/selectButton"
import declareComponent from "./../../lib/declareComponent"
import GUIButton from "./../_themeAble/_focusAble/_formUi/_rippleButton/rippleButton"
import NButton from "./../_themeAble/_focusAble/_button/button"
import { ElementList } from "extended-dom"
import TextArea from "../_themeAble/_focusAble/_formUi/_editAble/textArea/textArea"
import { ReadonlyData } from "josm"
import { site } from "../../main"
type Button = GUIButton | NButton
type SelectorToButton = string


export default class Form extends Component<false> {
  private slotElem = ce("slot")
  constructor(submitElement?: SelectorToButton | Button) {
    super(false)
    this.apd(this.slotElem)
    if (submitElement) {
      this.submitElement(submitElement)
    }

    this.on("keydown", async (e) => {
      if (e.key === "Enter") {
        if (!((e.target instanceof TextArea && !e.shiftKey) || e.target instanceof NButton || e.target instanceof GUIButton)) {
          if (this._submitElement) (this._submitElement as Button).click()
          else {
            const res = await this.submitCall()
            for (const f of res) {
              if (f instanceof Function) f()
              else console.warn("Is this state needed. Dunno atm")
            }
          }
        }
      }
    })
  }
  private unsubFromLastSubmitElement = () => {}
  private _submitElement: SelectorToButton | Button
  submitElement(submitElement: SelectorToButton | Button) {
    if (typeof submitElement === "string") {
      submitElement = this.childs(submitElement) as any
    }
    this._submitElement = submitElement

    const localUnsub = this.unsubFromLastSubmitElement
    setTimeout(() => {
      if (localUnsub !== this.unsubFromLastSubmitElement) return

      this.unsubFromLastSubmitElement();
      const cb = (submitElement as Button).addActivationCallback(async () => {
        return this.submitCall()
      })
      this.unsubFromLastSubmitElement = () => {
        (submitElement as Button).removeActivationCallback(cb)
      }
    })
    


  }

  private async submitCall() {
    for (const elem of this.getAllFormUiChilds()) {
      if ("checkIfValid" in elem && elem.checkIfValid instanceof Function) {
        if (elem.checkIfValid()) {
          // elem.focus()
          site.notification.error("Unable to submit", "Please check all fields for errors")
          return
        }
      }
    }
    if (this._submitElement) this.disableChilds(this._submitElement as Button)
    else this.disableChilds()
    try {
      const res = await this.submit()
      res.push(() => {
        if (this._submitElement) this.enableChilds(this._submitElement as Button)
        else this.enableChilds() 
      })
      
      return res
    }
    catch(e) {
      if (this._submitElement) this.enableChilds(this._submitElement as Button)
      else this.enableChilds()
      throw e
    }
  }

  public disableChilds(...except: (FormUi | Button)[]) {
    this.getAllFormUiChilds().forEach((e) => {
      if (!except.includes(e)) e.enabled.set(false)
    })
  }
  public enableChilds(...except: (FormUi | Button)[]) {
    this.formUiChildsCache.forEach((e) => {
      if (!except.includes(e)) e.enabled.set(true)
    })
    this.formUiChildsCache = undefined
  }

  private formUiChildsCache: ElementList<FormUi>
  private getAllFormUiChilds() {
    return this.formUiChildsCache = this.childs(Infinity, true).filter(elem => elem instanceof FormUi) as ElementList<FormUi>
  }
  private callbacks: Function[] = []

  submit(callback: (fullData: any) => (Promise<any> | void)): {remove: () => void}
  submit(): Promise<any[]> & {data: {[key: string]: any}}
  submit(callback?: (fullData: any) => (Promise<any> | void)) {
    if (callback) {
      this.callbacks.push(callback)
      return {
        remove: () => {
          this.callbacks.splice(this.callbacks.indexOf(callback), 1)
        }
      }
    } else {
      const ob = {} as {[key: string]: any}
      let prevWasSelect = false
      let curSelValOb: {[key: string]: any}
      (this.formUiChildsCache !== undefined ? this.formUiChildsCache : this.getAllFormUiChilds()).forEach((elem) => {
        if (elem instanceof FormUi) {
          if (elem instanceof SelectButton) {
            if (!prevWasSelect) {
              let name = elem.parent(true).getAttribute("name")
              if (name === null) name = elem.getAttribute("name")
              ob[name] = curSelValOb = {}
            }
            curSelValOb[elem.getAttribute("name")] = elem.selected.get()
            prevWasSelect = true
          }
          else {
            prevWasSelect = false
            if (elem instanceof EditAble) ob[elem.getAttribute("name")] = elem.value.get()
          }
        }
      })


      const prom = Promise.all(this.callbacks.map(async cb => cb(ob))) as Promise<any[]> & {data: {[key: string]: any}}
      prom.data = ob

      return prom
    }
  }


  stl() {
    return ""
  }

  pug() {
    return ""
  }

}

declareComponent("form", Form)