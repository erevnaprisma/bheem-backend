const graphql = require('graphql')

const { getCurrentMeetingListService } = require('../services/Meeting')

const { GetCurrentMeetingListType } = require('../graphql/type/meetingType')

const {
  GraphQLString,
  GraphQLNonNull
} = graphql

const getCurrentMeetingList = {
  type: GetCurrentMeetingListType,
  args: {
    meetingId: { type: new GraphQLNonNull(GraphQLString) }
  },
  resolve (parent, args) {
    return getCurrentMeetingListService(args.meetingId)
  }
}

module.exports = {
  getCurrentMeetingList
}
