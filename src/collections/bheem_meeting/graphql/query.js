const graphql = require('graphql')

const { getCurrentMeetingListService, meetingHistoryService } = require('../services/Meeting')

const { GetCurrentMeetingListType, MeetingHistoryType } = require('../graphql/type/meetingType')

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

const meetingHistory = {
  type: MeetingHistoryType,
  args: {
    userId: { type: new GraphQLNonNull(GraphQLString) }
  },
  resolve (parent, args) {
    return meetingHistoryService(args.userId)
  }
}

module.exports = {
  getCurrentMeetingList,
  meetingHistory
}
