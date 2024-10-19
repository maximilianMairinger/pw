import { Data, DataCollection, DataSubscription, ReadonlyData } from "josm";
import FormUi from "../formUi";
import { josmEditAbleReflection, josmEventReflection } from "josm-adapter"
import sani from "sanitize-against"
import makeTippy from "../../../../../lib/tippyFeedback";

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


  public validation: Data<(inp: string) => T> = new Data((a) => a as T)
  public currentErrorMsg: ReadonlyData<string | null>
  public currentlyInvalid: ReadonlyData<boolean>

  private inInitState = new Data(true)


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
      }
      else {
        this.inputElem.tabIndex = -1
      }
    }, false)


    

    const currentlyInvalid = this.currentlyInvalid = new Data(false)
    const currentlyWriting = new Data(false)

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
      valueSub1.deactivate()
      valueSub2.deactivate()
      this._value.set(v + "")
      valueSub1.activate()
      valueSub2.activate()
    }, false)

    const showInvalidationIfNotInInitState = new Data(false)
    currentlyInvalid.get((invalid) => {
      if (invalid) showInvalidationIfNotInInitState.set(!currentlyWriting.get())
      else showInvalidationIfNotInInitState.set(false)
    }, false)
    currentlyWriting.get((writing) => {
      if (writing) showInvalidationIfNotInInitState.set(currentlyInvalid.get())
      else showInvalidationIfNotInInitState.set(currentlyInvalid.get())
    }, false)
    

    const showInvalidation = new Data<boolean>()
    new DataCollection(this.inInitState, showInvalidationIfNotInInitState).get((inInitState, showInvalidationIfNotInInitState) => {
      showInvalidation.set(showInvalidationIfNotInInitState && !inInitState)
    })
    toggleClass(this, showInvalidation, "showInvalidation")

    
    const currentErrorMsg = this.currentErrorMsg = new Data(null) as any
    const valueSub1 = new DataCollection(this._value, this.validation, this.recalcValidData).get((s, validate) => {
      try {
        sub1.setToData(validate(s))
        currentlyInvalid.set(false)
        currentErrorMsg.set(null)
      }
      catch(e) {
        currentlyInvalid.set(true)
        currentErrorMsg.set(e.message)
      }
    }, true)

    const valueSub2 = this._value.get(() => {
      currentlyWriting.set(true)
    }, false)

    const tip = makeTippy(this, {
      content: this.currentErrorMsg,
      placement: "right"
    })

    showInvalidation.get((invalid) => {
      if (!invalid) tip.setProps({trigger: "manual"})
      else tip.setProps({trigger: "mouseenter focus"})
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
      this.placeholderText.anim(up ? {paddingTop: 7, fontSize: 12} : {paddingTop: 15, fontSize: 14}, 200).then(() => {
        if (localAnimDone === globalAnimDone) this.componentBody.addClass("animDone")
      })
    })

    isEmpty.get((isEmpty) => {
      this.placeholderText.css({fontWeight: isEmpty ? "normal" : "bold"})
    })

  }

  private recalcValidData = new Data(false)
  recalculateValidation() {
    this.recalcValidData.set(!this.recalcValidData.get())
  }

  checkIfValid() {
    this.inInitState.set(false)
    return this.currentlyInvalid.get()
  }
  focus() {
    this.inputElem.focus()
  }
  placeholder(to: string) {
    this.placeholderText.text(to)
  }
  type(type: string) {
    this.inputElem.setAttribute("type", type)
  }
  public pug(): string {
    return super.pug() + require("./editAble.pug").default
  }
  stl() {
    return super.stl() + require("./editAble.css").toString()
  }
  
}

