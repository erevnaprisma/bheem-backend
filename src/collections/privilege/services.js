const jwt = require('jsonwebtoken')
const config = require('config')
const _ = require('lodash')
const Privilege = require('./Model')
const User = require('../user/Model')
const Role = require('../role/Model')
const Roleprivilege = require('../role_privilege/Model')
const { doCreateRoleprivilege, doDeleteRoleprivilegeByPrivilegeId } = require('../role_privilege/services')
const fetchAllPrivileges = async (args, context) => {
  console.log('fetchAllPrivileges invoked')
  try {
    const filter = {}
    const { accesstoken } = context.req.headers
    const bodyAt = await jwt.verify(accesstoken, config.get('privateKey'))
    const { user_id: userId } = bodyAt
    // filter.$and = [{ created_by: userId }]
    if (!_.isEmpty(args.string_to_search)) {
      filter.$and = []
      filter.$and.push({
        $or: [
          { title: { $regex: args.string_to_search, $options: 'i' } }
        ]
      })
    }
    console.log('filter======', filter)
    const result = await Privilege.find(filter).sort({ updated_at: 'desc' }).skip(args.page_index * args.page_size).limit(args.page_size).populate({ path: 'created_by' }).populate({ path: 'updated_by' })
    const count = await Privilege.countDocuments(filter)
    const pageCount = await Math.ceil(count / args.page_size)
    return { status: 200, success: 'Successfully get all Data', list_data: result, count, page_count: pageCount }
  } catch (err) {
    console.log('err=> ', err)
    return { status: 400, error: err }
  }
}
const fetchDetailPrivilege = async (args, context) => {
  console.log('fetchDetailPrivilege invoked')
  try {
    const { accesstoken } = context.req.headers
    const bodyAt = await jwt.verify(accesstoken, config.get('privateKey'))
    const { user_id: userId } = bodyAt
    const result = await Privilege.findOne({ _id: args.id }).populate({ path: 'created_by' }).populate({ path: 'updated_by' })
    if (args.role_id) {

    }
    return { status: 200, success: 'Successfully get Data', data_detail: result }
  } catch (err) {
    return { status: 400, error: err }
  }
}
const doPrivilegeCheckboxSubmit = async (args, context) => {
  const session = await Privilege.db.startSession()
  session.startTransaction()
  try {
    const opts = { session }
    const now = Date.now()
    const { accesstoken } = context.req.headers
    const bodyAt = await jwt.verify(accesstoken, config.get('privateKey'))
    const { user_id: userId } = bodyAt
    const userDetail = await User.findById(userId)

    let privilegesIdsFlag = JSON.parse(JSON.stringify(args.privilege_ids_flag))
    console.log('privilegesIdsFlag==>', privilegesIdsFlag)
    const roleId = args.role_id
    console.log('roleId====>', roleId)

    // validate list privilege_ids
    const existedPrivilegeIds = await Privilege.find({ _id: { $in: _.map(privilegesIdsFlag, v => v.privilege_id) } }).session(session)
    privilegesIdsFlag = _.filter(privilegesIdsFlag, (v) => _.find(existedPrivilegeIds, (v1) => '' + v1._id === v.privilege_id))
    console.log('existedPrivilegeIds====>', privilegesIdsFlag)

    // checked privileges
    // privilegesIdsFlag
    const checkedPrivilegeIds = _.map(_.filter(privilegesIdsFlag, { flag: true }), v => v.privilege_id)
    console.log('checkedPrivilegeIds====>', checkedPrivilegeIds)

    if (!_.isEmpty(checkedPrivilegeIds)) {
      const existingRolePrivIds = await Roleprivilege.find({ privilege_id: { $in: checkedPrivilegeIds } })
      console.log('existingRolePrivIds===>', existingRolePrivIds)
      const notExistRolePrivIds = _.difference(checkedPrivilegeIds, _.map(existingRolePrivIds, v => '' + v.privilege_id))
      console.log('notExistRolePrivIds', notExistRolePrivIds)
      if (!_.isEmpty(notExistRolePrivIds)) {
        // create role privilege
        const RoleprivilegeCreateResp = await Roleprivilege.create(notExistRolePrivIds.map(v => ({
          role_id: args.role_id,
          privilege_id: v,
          updated_by: userDetail._id,
          created_by: userDetail._id,
          created_at: now,
          updated_at: now
        })), opts)
        console.log('RoleprivilegeCreateResp===>', RoleprivilegeCreateResp)
      }
      // update many priviliges push one role_id
      const privilegeUpdateResp = await Privilege.updateMany({ _id: { $in: checkedPrivilegeIds } }, { $addToSet: { role_id: args.role_id } }, { multi: true }).session(session)
      console.log('update many priviliges push one role_id privilegeUpdateResp===>', privilegeUpdateResp)
      // update one role push many privilege_ids
      const updateRoleResp = await Role.updateOne({ _id: args.role_id }, { $addToSet: { privilege_id: { $each: checkedPrivilegeIds } } }).session(session)
      console.log('update one role push many privilege_ids updateRoleResp===>', updateRoleResp)
    }
    // unchecked privileges
    // privilegesIdsFlag
    const uncheckedPrivilegeIds = _.map(_.filter(privilegesIdsFlag, { flag: false }), v => v.privilege_id)
    console.log('uncheckedPrivilegeIds====>', uncheckedPrivilegeIds)
    if (!_.isEmpty(uncheckedPrivilegeIds)) {
      // delete role privilege
      const RoleprivilegeDeleteResp = await Roleprivilege.deleteMany({ role_id: args.role_id, privilege_id: { $in: uncheckedPrivilegeIds } }).session(session)
      console.log('RoleprivilegeDeleteResp===>', RoleprivilegeDeleteResp)

      // update many privileges pull role_id
      const privilegeUpdateResp = await Privilege.updateMany({ _id: { $in: uncheckedPrivilegeIds } }, { $pull: { role_id: args.role_id } }, { multi: true }).session(session)
      console.log('update many privileges pull role_id privilegeUpdateResp===>', privilegeUpdateResp)

      // update one role pull privilege_ids
      const updateRoleResp = await Role.updateOne({ _id: args.role_id }, { $pull: { privilege_id: { $in: uncheckedPrivilegeIds } } }).session(session)
      console.log('update one role pull privilege_ids updateRoleResp===>', updateRoleResp)
    }

    await session.commitTransaction()
    session.endSession()
    return { status: 200, success: 'Successfully save Data', detail_data: {} }
  } catch (err) {
    await session.abortTransaction()
    session.endSession()
    console.log('errorrr====>', err)
    return { status: 400, error: err }
  }
}
const doCreatePrivilege = async (args, context) => {
  const session = await Privilege.db.startSession()
  session.startTransaction()
  try {
    const opts = { session }
    const now = Date.now()
    const { accesstoken } = context.req.headers
    const bodyAt = await jwt.verify(accesstoken, config.get('privateKey'))
    const { user_id: userId } = bodyAt
    const userDetail = await User.findById(userId)
    const data = args
    data.created_by = userDetail._id
    data.updated_by = userDetail._id
    data.created_at = now
    data.updated_at = now
    data.role_id = [args.role_id]
    const priv = (await Privilege.create([data], opts))[0]
    console.log('priv====>', priv)
    if (args.role_id && priv) {
      // create role privilege
      const RoleprivilegeCreateResp = await Roleprivilege.create({
        role_id: args.role_id,
        privilege_id: priv._id,
        updated_by: userDetail._id,
        created_by: userDetail._id,
        created_at: now,
        updated_at: now
      })
      console.log('RoleprivilegeCreateResp===>', RoleprivilegeCreateResp)
      // const doCreateRoleprivilegeResp = await doCreateRoleprivilege({ role_id: args.role_id, privilege_id: priv._id }, context, { opts })
      // if (doCreateRoleprivilegeResp.status === 400) throw new Error('failed doCreateRoleprivilege')
      // push to role.privilege_id
      const updateRoleResp = await Role.updateOne({ _id: args.role_id }, { $addToSet: { privilege_id: { $each: ['' + priv._id] } } }).session(session)
      console.log('update one role push many privilege_ids updateRoleResp===>', updateRoleResp)
    }
    await session.commitTransaction()
    session.endSession()
    return { status: 200, success: 'Successfully save Data', detail_data: priv }
  } catch (err) {
    console.log('errorrr====>', err)
    await session.abortTransaction()
    session.endSession()
    return { status: 400, error: err }
  }
}
const doUpdatePrivilege = async (args, context) => {
  try {
    const now = Date.now()
    const { accesstoken } = context.req.headers
    const bodyAt = await jwt.verify(accesstoken, config.get('privateKey'))
    const { user_id: userId } = bodyAt
    const userDetail = await User.findById(userId)
    const data = args
    // data.created_by = userDetail._id
    data.updated_by = userDetail._id
    // data.created_at = now
    data.updated_at = now
    console.log('update=> ', data)
    return { status: 200, success: 'Successfully save Data', detail_data: await Privilege.findOneAndUpdate({ _id: args._id }, data).populate({ path: 'created_by' }).populate({ path: 'updated_by' }) }
  } catch (err) {
    console.log('errorrr====>', err)
    return { status: 400, error: err }
  }
}
const doDeletePrivilege = async (args, context) => {
  const session = await Privilege.db.startSession()
  session.startTransaction()
  const opts = { session }
  try {
    const { accesstoken } = context.req.headers
    const bodyAt = await jwt.verify(accesstoken, config.get('privateKey'))
    const { user_id: userId } = bodyAt
    console.log('delete invoked args=', args)
    // delete privilege
    const privilegeDetail = await Privilege.findById(args._id).session(session)
    await privilegeDetail.deleteOne()
    // await Privilege.remove({ _id: args._id }).session(session)
    // delete role privilege
    const doDeleteRoleprivilegeByPrivilegeIdResp = await doDeleteRoleprivilegeByPrivilegeId({ args: { privilege_id: args._id }, opts })
    if (doDeleteRoleprivilegeByPrivilegeIdResp.status === 400) throw new Error('failed doDeleteRoleprivilegeByPrivilegeId')
    // pop to role.privilege_id
    console.log('privilegeDetail.role_id===>', privilegeDetail.role_id)
    console.log('args._id===>', args._id)
    const updateRoleResp = await Role.update({ _id: { $in: privilegeDetail.role_id } }, { $pull: { privilege_id: args._id } }, { multi: true }).session(session)
    console.log('updateRoleResp===>', updateRoleResp)
    await session.commitTransaction()
    session.endSession()
    return { status: 200, success: 'Successfully delete Data', detail_data: {} }
  } catch (err) {
    await session.abortTransaction()
    session.endSession()
    console.log('errorrr====>', err)
    return { status: 400, error: err }
  }
}

module.exports = {
  doPrivilegeCheckboxSubmit,
  fetchAllPrivileges,
  fetchDetailPrivilege,
  doCreatePrivilege,
  doUpdatePrivilege,
  doDeletePrivilege
}
