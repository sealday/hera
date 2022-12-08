import 'scroll-polyfill/auto'
import structuredClone from 'core-js-pure/actual/structured-clone'
import * as at from 'array.prototype.at'
at.shim()
window.structuredClone = structuredClone