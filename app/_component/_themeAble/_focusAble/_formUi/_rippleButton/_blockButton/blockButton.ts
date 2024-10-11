import RippleButton from "../rippleButton";
import declareComponent from "../../../../../../lib/declareComponent";
import { Data } from "josm";
import { latestLatent } from "more-proms";
import delay from "tiny-delay";
import { morphComputedStyle } from "../../../../../../lib/morphStyle";


export default class BlockButton extends RippleButton {
  protected textElem = ce("button-text")
  constructor(content: string = "", onClick?: ((e?: MouseEvent | KeyboardEvent) => any)) {
    super();

    if (onClick) this.click(onClick)
    this.content(content);
    this.moveBody.apd(this.textElem)
  }

  public animWithOnTxtChange = morphComputedStyle(this.textElem, "width", { whiteSpace: "nowrap" }, 200)

  content(to: string | Data<string>, morph = true) {
    const prevTxt = this.textElem.txt()
    if (morph && prevTxt !== to && prevTxt !== "") {
      this.animWithOnTxtChange(
        () => this.textElem.txt(to as any, false, false), 
        () => this.textElem.txt(prevTxt as any, false, false),
        () => this.textElem.txt(to as any)
      )
    }
    else this.textElem.text(to as any)
  }
  stl() {
    return super.stl() + require('./blockButton.css').toString();
  }
  pug() {
    return super.pug() + require("./blockButton.pug").default
  }
}

declareComponent("block-button", BlockButton)