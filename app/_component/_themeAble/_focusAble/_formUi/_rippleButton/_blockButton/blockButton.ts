import RippleButton from "../rippleButton";
import declareComponent from "../../../../../../lib/declareComponent";
import { Data } from "josm";
import { latestLatent } from "more-proms";
import delay from "tiny-delay";


export default class BlockButton extends RippleButton {
  protected textElem = ce("button-text")
  constructor(content: string = "", onClick?: ((e?: MouseEvent | KeyboardEvent) => any)) {
    super();

    if (onClick) this.click(onClick)
    this.content(content);
    this.moveBody.apd(this.textElem)
  }

  public animWithOnTxtChange = latestLatent(async (width: number) => {
    this.textElem.css({ whiteSpace: "nowrap" })
    await delay(200)
    await this.textElem.anim({ width })
  }).then(() => {
    this.textElem.css({ whiteSpace: "" })
    this.textElem.css({ width: "" })
  })

  content(to: string | Data<string>, morph = true) {
    if (morph) {
      const curTxt = this.textElem.txt()
      this.textElem.text(to as any, false, false)
      const toWidth = this.textElem.width()
      this.textElem.text(curTxt as any, false, false)
      this.animWithOnTxtChange(toWidth)
    }
    this.textElem.text(to as any)
  }
  stl() {
    return super.stl() + require('./blockButton.css').toString();
  }
  pug() {
    return super.pug() + require("./blockButton.pug").default
  }
}

declareComponent("block-button", BlockButton)