module.exports = {


  friendlyName: 'View user list',


  description: 'Display "User list" page.',


  exits: {

    forbidden: {
      responseType: 'forbidden'
    },

    success: {
      viewTemplatePath: 'pages/users/user-list'
    }

  },


  fn: async function () {

    // check valid user
    if (this.req.me.emailStatus !== 'confirmed') {
      throw 'forbidden';
    }

    // fetch all users
    var users = await User.find({});

    // Respond with view.
    return {
      currentSection: 'users',
      userList: users
    };

  }


};
