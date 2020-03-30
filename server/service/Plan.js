const _ = require('lodash')

const Plan = require('../models').Plan

class PlanService {

    async findAll(planType) {
        return Plan.find({ planType })
    }

    async create(planBody, planType) {
        const plan = new Plan({ ...planBody, planType })
        return plan.save()
    }

    async remove(planId) {
        return Plan.remove({ _id: ObjectId(planId) })
    }

    async update(planId, planBody) {
        const newPlan = _.omit(planBody, ['_id'])
        const plan = await Plan.findOne({ _id: ObjectId(planId) })
        plan.entries = []
        Object.assign(plan, newPlan)
        return plan.save()
    }

}

module.exports = PlanService