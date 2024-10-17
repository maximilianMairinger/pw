import { Data, DataCollection, DataSubscription, ReadonlyData } from "josm";
import FormUi from "../formUi";
import { josmEditAbleReflection, josmEventReflection } from "josm-adapter"
import sani from "sanitize-against"

function toggleClass(elem: Element, data: ReadonlyData<boolean>, className: string) {
  data.get((bool) => {
    if (bool) elem.addClass(className)
    else elem.removeClass(className)
  })

}

export default class EditAble<T = string> extends FormUi<HTMLElement> {

  
  private _value = josmEditAbleReflection(this.inputElem, "");
  public value: Data<T>
  public isEmpty: ReadonlyData<boolean>

  public validate: (inp: string) => T = (a) => a as T
  public currentErrorMsg: ReadonlyData<string | null>
  public currentlyInvalid: ReadonlyData<boolean>


  protected placeholderContainer = ce("placeholder-container")
  
  protected placeholderText = ce("placeholder-text")

  protected placeholderUp: Data<boolean>
  constructor(protected inputElem: HTMLInputElement | HTMLTextAreaElement, placeholder = "") {
    super()
    inputElem.id = "editAble"
    this.moveBody.apd(this.placeholderContainer.apd(this.placeholderText))
    this.moveBody.apd(inputElem as any)
    

    this.userFeedbackMode.ripple.set(false)

    this.placeholder(placeholder)

    this.enabled.get((enabled) => {
      if (enabled) {
        this.inputElem.tabIndex = 0
        clickListener.activate()
      }
      else {
        this.inputElem.tabIndex = -1
        clickListener.deactivate()
      }
    }, false)


    toggleClass(this, this.enabled, "enabled")

    const currentlyInvalid = this.currentlyInvalid = new Data(false)
    toggleClass(this, currentlyInvalid, "invalid")

    const currentlyWriting = new Data(false)
    toggleClass(this, currentlyWriting, "writing")

    this.on("blur", () => {
      currentlyWriting.set(false)
    })
    this.inputElem.on("keydown", ({ key, shiftKey }) => {
      if (key === "Enter" && !shiftKey) {
        currentlyWriting.set(false)
      }
    })


    this.value = new Data()
    const sub1 = this.value.get((v) => {
      sub2.setToData(v + "")
    }, false)

    
    const currentErrorMsg = this.currentErrorMsg = new Data(null) as any
    const sub2 = this._value.get((s) => {
      currentlyWriting.set(true)
      try {
        sub1.setToData(this.validate(s))
        currentlyInvalid.set(false)
        currentErrorMsg.set(null)
      }
      catch(e) {
        currentlyInvalid.set(true)
        currentErrorMsg.set(e.message)
      }
    })

    currentlyInvalid.get((e) => {
      console.log("invalid", e)
    })

    
    
    const isEmpty = (this as any).isEmpty = this._value.tunnel((v) => v === "")

    this.placeholderUp = new Data(false) as any
    new DataCollection(this.isFocused as Data<boolean>, isEmpty).get((isFocused, isEmpty) => {
      this.placeholderUp.set(!isEmpty || isFocused)
    })

    
    


    let globalAnimDone: Symbol
    this.placeholderUp.get((up) => {
      

      let localAnimDone = globalAnimDone = Symbol()
      this.componentBody.removeClass("animDone")
      this.placeholderText.anim(up ? {paddingTop: 7, fontSize: 12} : {paddingTop: 14, fontSize: 14}, 200).then(() => {
        if (localAnimDone === globalAnimDone) this.componentBody.addClass("animDone")
      })
    })

    isEmpty.get((isEmpty) => {
      this.placeholderText.css({fontWeight: isEmpty ? "normal" : "bold"})
    })

    const clickListener = this.on("click", () => {
      inputElem.focus()
    })
  }
  focus() {
    this.inputElem.focus()
  }
  placeholder(to: string) {
    this.placeholderText.text(to)
  }
  public pug(): string {
    return super.pug() + require("./editAble.pug").default
  }
  stl() {
    return super.stl() + require("./editAble.css").toString()
  }
  
}

