import { createContext } from "react"

export const SettingContext = createContext({
  price: false,
  project: true,
  originalOrder: true,
  carNumber: true,
})