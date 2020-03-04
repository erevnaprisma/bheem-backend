const isAuth = async (
  resolve,
  parent,
  args,
  context,
  info
) => {
  console.log('sampe sini')
  return resolve(parent, args, context, info)
}

const authMiddleware = {
  // Mutation: {
  //   changeUsername: isAuth,
  //   signUp: isAuth
  //   // login: isAuth
  // },
  RootQueryType: {
    login: isAuth
  }
}

module.exports = authMiddleware
