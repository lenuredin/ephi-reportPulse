module.exports = {


  friendlyName: 'View homepage or redirect',


  description: 'Display or redirect to the appropriate homepage, depending on login status.',


  exits: {

    success: {
      statusCode: 200,
      description: 'Requesting user is a guest, so show the public landing page.',
      viewTemplatePath: 'pages/homepage.ejs'
    },

    redirect: {
      responseType: 'redirect',
      description: 'Requesting user is logged in, so redirect to an internal page depending on that user\'s account status.'
    },

  },


  fn: async function ({}) {

    // if confirmed, go to home, else go to account
    if (this.req.me&&this.req.me.emailStatus!=='unconfirmed') {
      throw {redirect:'/home'};
    } else {
      throw {redirect:'/account'};
    }

  }

};
