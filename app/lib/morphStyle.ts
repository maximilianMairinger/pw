import { delay } from "tiny-delay"
import "./../global"
import { latestLatent } from "more-proms"
import { cloneKeysAndMapProps } from "circ-clone"

export function morphComputed<R, P>(setFuture: () => P, setPast: () => void, animToFuture: (futureVal: P) => R) {
  const futureVal = setFuture()
  setPast()
  return animToFuture(futureVal)
}

export function assert(cond: boolean, msg: string) {
  if (!cond) throw new Error(msg)
}

export function morphComputedStyle(elem: Element | Element[], morphProp: string | string[], fixPropDuringMorph?: object | {elem: Element, css: object}[], delayMs = 0) {
  const elemMorphMap = [] as {elem: Element, morphProp: string, morphFromPropVal?: any, morphToPropVal?: any}[]
  if (elem instanceof Array) {
    if (morphProp instanceof Array) {
      assert(elem.length === morphProp.length, "elem and morphProp must have the same length")
      for (let i = 0; i < elem.length; i++) {
        elemMorphMap.push({elem: elem[i], morphProp: morphProp[i]})
      }
    }
    else {
      for (const e of elem) {
        elemMorphMap.push({elem: e, morphProp: morphProp as string})
      }
    }
  }
  else {
    if (morphProp instanceof Array) {
      for (const p of morphProp) {
        elemMorphMap.push({elem: elem, morphProp: p})
      }
    }
    else {
      elemMorphMap.push({elem: elem, morphProp: morphProp as string})
    }
  }

  let _setChange: () => void
  const animF = latestLatent(async () => {
    if (fixPropDuringMorph) {
      if (fixPropDuringMorph instanceof Array) for (const {elem, css} of fixPropDuringMorph) elem.css(css as any)
      else for (const { elem } of elemMorphMap) elem.css(fixPropDuringMorph as any)
    }

    for (const { elem, morphProp, morphFromPropVal } of elemMorphMap) elem.css({[morphProp]: morphFromPropVal} as any)  
    _setChange()
    await delay(delayMs)
  })
  .then(async () => {
    await Promise.all(elemMorphMap.map(({elem, morphProp, morphToPropVal}) => elem.anim({[morphProp]: morphToPropVal} as any)))
  })
  .then(() => {
    if (fixPropDuringMorph) {
      if (fixPropDuringMorph instanceof Array) for (const {elem, css} of fixPropDuringMorph) elem.css(cloneKeysAndMapProps(css, () => "") as any)
      else {
        const css = cloneKeysAndMapProps(fixPropDuringMorph, () => "") as any
        for (const { elem } of elemMorphMap) elem.css(css)
      }
    }

    for (const { elem, morphProp } of elemMorphMap) elem.css({[morphProp]: ""} as any)  
  })

  
  return (setChange: () => void, revertChange: () => void, setChangeWithAnim = setChange) => {
    _setChange = setChangeWithAnim
    return morphComputed(() => {
      for (const ob of elemMorphMap) ob.morphFromPropVal = ob.elem.css(ob.morphProp as any)
      setChange()
      for (const ob of elemMorphMap) ob.morphToPropVal = ob.elem.css(ob.morphProp as any)
    }, revertChange, animF)
  }
}

