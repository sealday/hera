const express = require('express')
const multer = require('multer')
const upload = multer({ dest: 'public/uploads/'})
const product = require('./product')
const file = require('./file')

const middleware = require('./middleware')
const user = require('./user')
const project = require('./project')
const price = require('./price')
const weight = require('./weight')
const repair = require('./repair')
const compensation = require('./compensation')
const workercheckin = require('./worker')
const record = require('./record')
const payable = require('./payable')
const operation = require('./operation')
const status = require('./status')

const router = express.Router()

const store = require('./store')
const settings = require('./settings')

router.get('/operation/top_k', operation.topK)
router.get('/operation/next_k', operation.nextK)
router.use(middleware.user)
router.post('/login', user.login)
router.post('/logout', user.logout)
router.get('/is_login', user.isLogin)
router.get('/load', user.load)

router.get('/user', user.list)
router.post('/user', user.create)
router.post('/user/:id', user.update)
router.post('/user/:id/profile', user.saveProfile)
router.post('/user/:id/delete', user.remove)

router.get('/product', product.list)
router.post('/product', product.create)
router.post('/product/:number', product.update)
router.post('/product/:number/delete', product.delete)
// 合同方案、租金方案
router.get('/price', price.list)
router.post('/price', price.create)
router.post('/price/:id', price.update)
router.post('/price/:id/delete', price.delete)
// 计重方案
router.get('/weight', weight.list)
router.post('/weight', weight.create)
router.post('/weight/:id', weight.update)
router.post('/weight/:id/delete', weight.delete)
// 维修方案
router.get('/repair', repair.list)
router.post('/repair', repair.create)
router.post('/repair/:id', repair.update)
router.post('/repair/:id/delete', repair.delete)
// 赔偿方案
router.get('/compensation', compensation.list)
router.post('/compensation', compensation.create)
router.post('/compensation/:id', compensation.update)
router.post('/compensation/:id/delete', compensation.delete)

router.get('/project', project.list)
router.post('/project', project.create)
router.get('/project/:id', project.detail)
router.post('/project/:id', project.update)
router.post('/project/:id/delete', project.doDelete) // 删除项目
router.post('/project/:id/status', project.doStatus) // 改变项目状态
router.post('/project/:id/add_item', project.addItem)
router.get('/project/:id/item/:itemId', project.itemDetail)
router.post('/project/:id/item/:itemId/delete', project.deleteItem)

router.post('/workercheckin',workercheckin.create)
router.post('/workercheckin/:id/edit',workercheckin.update)
router.get('/workercheckin',workercheckin.list)
router.post('/workercheckin/:id/delete',workercheckin.delete)
router.post('/workercheckin/:id/signin',workercheckin.signin)
router.post('/workercheckin/:id/signout',workercheckin.signout)

router.get('/payable_search',payable.paycheckSearch)

router.get('/record', record.list)
router.get('/record/all_payer', record.findAllPayer)
router.get('/record/:id', record.detail)
router.post('/record/:id', record.update)
router.post('/record/:id/transport', record.updateTransport)
router.post('/record/:id/transport_paid', record.updateTransportPaidStatus)
router.post('/record/:id/transport_checked', record.updateTransportCheckedStatus)
router.post('/record', record.create)

router.get('/file', file.list)
router.post('/file', upload.single('file'), file.post)
router.get('/file/:filename', file.download)

router.get('/store/search', store.search)
router.get('/store/simple_search', store.simpleSearch)
router.get('/store/rent', store.rent)
router.get('/store/:id', store.queryAll)

router.get('/status/new_in_records', status.newInRecords)
router.get('/status/new_out_records', status.newOutRecords)
router.get('/status/update_records', status.updateRecords)

router.post('/system/settings', settings.update)

module.exports = router
