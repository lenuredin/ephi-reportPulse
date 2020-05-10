module.exports = {


  friendlyName: 'View forms',


  description: 'Display "Forms" page.',


  exits: {

    forbidden: {
      responseType: 'forbidden'
    },

    success: {
      viewTemplatePath: 'pages/forms/forms'
    }

  },


  fn: async function () {

    // check valid user
    if (this.req.me.emailStatus !== 'confirmed') {
      throw 'forbidden';
    }

    // fetch all users
    var forms = await _form_info.find({}).meta({ schemaName: 'phem' });

    // Respond with view.
    return {
      currentSection: 'forms',
      forms: forms
    };

  }


};
