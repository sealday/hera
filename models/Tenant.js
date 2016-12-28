/**
 * Created by seal on 26/12/2016.
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tenantSchema = new Schema({
  name: String,
  fullName: String
});

const Tenant = mongoose.model('Tenant', tenantSchema);

module.exports = Tenant;

