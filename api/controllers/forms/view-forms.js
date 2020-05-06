module.exports = {


  friendlyName: 'View forms',


  description: 'Display "Forms" page.',


  exits: {

    success: {
      viewTemplatePath: 'pages/forms/forms'
    }

  },


  fn: async function () {

    // fetch all users
    var forms = await _form_info.find({}).meta({ schemaName: 'phem' });

    // Respond with view.
    return {
      currentSection: 'forms',
      forms: forms
    };

  }


};
