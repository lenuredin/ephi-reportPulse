module.exports = {


  friendlyName: 'View home',


  description: 'Display "Home" page.',


  exits: {

    forbidden: {
      responseType: 'forbidden'
    },

    success: {
      viewTemplatePath: 'pages/home/home'
    }

  },


  fn: async function () {

    // check valid user
    if (this.req.me.emailStatus !== 'confirmed') {
      throw 'forbidden';
    }

    // Respond with view.
    return {
      currentSection: 'home'
    };

  }


};
