const graphql = require('graphql')

// Anonymous Meeting type
const {
  AnonymousRequestToJoinType
} = require('../type/anonymousMeetingType')

// Anonymous Meeting service
const {
  anonymousRequestToJoinMeetingService
} = require('../../services/AnonymousMeeting')

const {
  GraphQLString,
  GraphQLNonNull
} = graphql

const anonymousRequestTojoinMeeting = {
  type: AnonymousRequestToJoinType,
  args: {
    meetingId: { type: new GraphQLNonNull(GraphQLString) },
    name: { type: new GraphQLNonNull(GraphQLString) }
  },
  resolve (parent, args) {
    return anonymousRequestToJoinMeetingService(args.meetingId, args.name)
  }
}

module.exports = {
  anonymousRequestTojoinMeeting
}
