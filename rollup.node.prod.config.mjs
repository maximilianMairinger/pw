import { merge } from "webpack-merge"
import commonMod from "./rollup.node.common.config.mjs"


export default merge(commonMod, {
  input: 'app/src/tinyClone.ts',
  output: {
    file: 'app/dist/cjs/tinyClone.js',
    format: 'cjs'
  },
})