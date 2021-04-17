import { createHistory, useBasename as asBasename } from 'history'

export const history = asBasename(createHistory)({
  basename: '/system'
})