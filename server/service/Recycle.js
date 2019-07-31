const _ = require('lodash')

const Recycle = require('../models').Recycle

class RecycleService {

    async remove(src, obj, user) {
        const recycle = new Recycle({
            src,
            obj,
            user: _.pick(user, ['username', 'profile.name']),
        })
        await recycle.save()
    }
}

module.exports = RecycleService