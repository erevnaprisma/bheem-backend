const Plan = require('./Model')

const createPlanService = async (name, participants, minutes) => {
  try {
    const { error } = await Plan.validate({ name, participants, minutes })
    if (error) throw new Error(error.details[0].message)

    const plan = new Plan({
      name,
      participants,
      // change minutes to milisecond
      minutes: (parseInt(minutes) * 60000).toString(),
      createdAt: new Date().getTime(),
      updatedAt: new Date().getTime()
    })

    await plan.save()

    return { status: 200, success: 'Successfully create plan' }
  } catch (err) {
    return { status: 400, error: err.message || 'Failed create plan' }
  }
}

const deletePlanService = async (name) => {
  try {
    if (!name) throw new Error('Invalid plan')

    const plan = await Plan.findOne({ name })
    if (!plan) throw new Error('Invalid plan')

    await Plan.findOneAndDelete({ name })

    return { status: 200, success: 'Successfully delete plan' }
  } catch (err) {
    return { status: 400, error: err.message || 'Failed delete plan' }
  }
}

const getAllPlanService = async () => {
  try {
    const plans = await Plan.find()

    return { status: 200, success: 'Successfully get all plan', plans }
  } catch (err) {
    return { status: 400, error: err.message || 'Failed get all plan' }
  }
}

const getSelectedPlanService = async (name) => {
  try {
    if (!name) throw new Error('Invalid plan')

    const plan = await Plan.findOne({ name })
    if (!plan) throw new Error('Invalid plan')

    return { status: 200, success: 'Successfully get selected plan', plan }
  } catch (err) {
    return { status: 400, error: err.message || 'Failed get selected plan' }
  }
}

module.exports = {
  createPlanService,
  deletePlanService,
  getSelectedPlanService,
  getAllPlanService
}
