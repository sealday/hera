import ContractEditModal from './ContractEditModal'
import ContractAddItemModal from './ContractAddItemModal'
import ContractAddCalcModal from './ContractAddCalcModal'
import Contract from './Contract'
import { createModal } from '../../../utils'

export const edit = createModal(ContractEditModal) 
export const addItem = createModal(ContractAddItemModal)
export const addCalc = createModal(ContractAddCalcModal)
export default Contract