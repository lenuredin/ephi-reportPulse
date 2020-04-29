module.exports = {


  friendlyName: 'View user list',


  description: 'Display "User list" page.',


  exits: {

    success: {
      viewTemplatePath: 'pages/users/user-list'
    }

  },


  fn: async function () {

    // fetch all users
    var users = await User.find({});

    // Respond with view.
    return {
      currentSection: 'users',
      userList: users
    };

  }


};
