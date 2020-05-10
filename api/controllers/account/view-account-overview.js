module.exports = {


  friendlyName: 'View account overview',


  description: 'Display "Account Overview" page.',

  inputs: {

    id: {
      description: 'The user id.',
      example: '1'
    }

  },

  exits: {

    success: {
      viewTemplatePath: 'pages/account/account-overview',
    }

  },


  fn: async function ({id}) {

    // get id
    var userId = id ? id : this.req.me.id;

    // get user
    var user = await User.findOne({ id: userId });

    // return
    return {
      currentSection: 'users',
      user: user
    }

    // If billing features are enabled, include our configured Stripe.js
    // public key in the view locals.  Otherwise, leave it as undefined.
    // return {
    //   stripePublishableKey: sails.config.custom.enableBillingFeatures? sails.config.custom.stripePublishableKey : undefined,
    // };

  }


};
