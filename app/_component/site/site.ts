import Component from "../component"
import declareComponent from "../../lib/declareComponent"
import {editor} from "monaco-editor"
import sodium from 'libsodium-wrappers';
import Notification from "../notification/notification";
import NotificationBar from "../notificationBar/notificationBar";





sodium.ready.then(() => {
  console.log(sodium.crypto_secretbox_keygen())
})


const allSites = []


export default class Site extends Component {



  constructor() {
    super()

    allSites.push(this)


    const n = new NotificationBar()
    this.apd(n)

    n.error("test")
    n.success("test", "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum?")
    n.log("test", "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum?")
    n.log("Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum?")
    n.success("Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum?")
    n.error("Lorem ipsum dolor sitttttt amet consectetur adipisicing elit. Quisquam, voluptatum?")
    n.error("test", "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum?")
    n.error("test")
    n.success("test", "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum?")
    n.log("test", "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum?")
    n.log("Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum?")
    // n.success("Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum?")
    // n.error("Lorem ipsum dolor sitttttt amet consectetur adipisicing elit. Quisquam, voluptatum?")
    // n.error("test", "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum?")
    
    // @ts-ignore
    window.n = n

    
    editor.create(this.body.editor as HTMLElement, {
      automaticLayout: true,
      language: "typescript",
      minimap: {enabled: false}
    })


  }

  stl() {
    return require("dom-notifications/style") + require("../../../node_modules/monaco-editor/min/vs/editor/editor.main.css").toString() + require("./site.css").toString()
  }
  pug() {
    return require("./site.pug").default
  }
}

declareComponent("site", Site)

