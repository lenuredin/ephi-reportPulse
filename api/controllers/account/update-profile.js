module.exports = {


  friendlyName: 'Update profile',


  description: 'Update the profile for the logged-in user.',


  inputs: {

    id: {
      type: 'number'
    },

    fullName: {
      type: 'string'
    },

    emailAddress: {
      type: 'string'
    },

    phoneNumber: {
      required: true,
      type: 'string',
      description: 'The phone numner for the new account, e.g. +251112758622.',
      extendedDescription: 'Must be a valid phone number.',
    },

    position:  {
      required: true,
      type: 'string',
      example: 'Surveillance Officer',
      description: 'The role of the user in the surveillance system.',
    },

    admin0administrator: {
      type: 'boolean',
      description: 'Federal administrator',
      example: true
    },

    admin1pcode: {
      type: 'string',
      description: 'Region Name',
      example: 'Somali'
    },

    admin1name: {
      type: 'string',
      description: 'Region Pcode',
      example: 'ET05'
    },

    admin1administrator: {
      type: 'boolean',
      description: 'Region administrator',
      example: true
    },

    admin2pcode: {
      type: 'string',
      description: 'Zone Name',
      example: 'Jaffar'
    },

    admin2name: {
      type: 'string',
      description: 'Zone Pcode',
      example: 'ET0503'
    },

    admin2administrator: {
      type: 'boolean',
      description: 'Zone administrator',
      example: true
    },

    admin3pcode: {
      type: 'string',
      description: 'Woreda Name',
      example: 'Ararso'
    },

    admin3name: {
      type: 'string',
      description: 'Woreda Pcode',
      example: 'ET050395'
    },

    admin3administrator: {
      type: 'boolean',
      description: 'Woreda administrator',
      example: true
    },

  },


  exits: {

    emailAlreadyInUse: {
      statusCode: 409,
      description: 'The provided email address is already in use.',
    },

  },


  fn: async function (inputs) {

    var newEmailAddress = inputs.emailAddress;
    if (newEmailAddress !== undefined) {
      newEmailAddress = newEmailAddress.toLowerCase();
    }

    // fetch user
    var user = await User.findOne({id: inputs.id});

    // Determine if this request wants to change the current user's email address,
    // revert her pending email address change, modify her pending email address
    // change, or if the email address won't be affected at all.
    var desiredEmailEffect;// ('change-immediately', 'begin-change', 'cancel-pending-change', 'modify-pending-change', or '')
    if (
      newEmailAddress === undefined ||
      (user.emailStatus !== 'change-requested' && newEmailAddress === user.emailAddress) ||
      (user.emailStatus === 'change-requested' && newEmailAddress === user.emailChangeCandidate)
    ) {
      desiredEmailEffect = '';
    } else if (user.emailStatus === 'change-requested' && newEmailAddress === user.emailAddress) {
      desiredEmailEffect = 'cancel-pending-change';
    } else if (user.emailStatus === 'change-requested' && newEmailAddress !== user.emailAddress) {
      desiredEmailEffect = 'modify-pending-change';
    } else if (!sails.config.custom.verifyEmailAddresses || user.emailStatus === 'unconfirmed') {
      desiredEmailEffect = 'change-immediately';
    } else {
      desiredEmailEffect = 'begin-change';
    }


    // If the email address is changing, make sure it is not already being used.
    if (_.contains(['begin-change', 'change-immediately', 'modify-pending-change'], desiredEmailEffect)) {
      let conflictingUser = await User.findOne({
        or: [
          { emailAddress: newEmailAddress },
          { emailChangeCandidate: newEmailAddress }
        ]
      });
      if (conflictingUser) {
        throw 'emailAlreadyInUse';
      }
    }


    // Start building the values to set in the db.
    // (We always set the fullName if provided.)
    var valuesToSet = {
      fullName: inputs.fullName,
      phoneNumber: inputs.phoneNumber,
      position: inputs.position,
      admin0administrator: inputs.admin0administrator,
      admin1pcode: inputs.admin1pcode,
      admin1name: inputs.admin1name,
      admin1administrator: inputs.admin1administrator,
      admin2pcode: inputs.admin2pcode,
      admin2name: inputs.admin2name,
      admin2administrator: inputs.admin2administrator,
      admin3pcode: inputs.admin3pcode,
      admin3name: inputs.admin3name,
      admin3administrator: inputs.admin3administrator
    };

    switch (desiredEmailEffect) {

      // Change now
      case 'change-immediately':
        _.extend(valuesToSet, {
          emailAddress: newEmailAddress,
          emailChangeCandidate: '',
          emailProofToken: '',
          emailProofTokenExpiresAt: 0,
          emailStatus: user.emailStatus === 'unconfirmed' ? 'unconfirmed' : 'confirmed'
        });
        break;

      // Begin new email change, or modify a pending email change
      case 'begin-change':
      case 'modify-pending-change':
        _.extend(valuesToSet, {
          emailChangeCandidate: newEmailAddress,
          emailProofToken: await sails.helpers.strings.random('url-friendly'),
          emailProofTokenExpiresAt: Date.now() + sails.config.custom.emailProofTokenTTL,
          emailStatus: 'change-requested'
        });
        break;

      // Cancel pending email change
      case 'cancel-pending-change':
        _.extend(valuesToSet, {
          emailChangeCandidate: '',
          emailProofToken: '',
          emailProofTokenExpiresAt: 0,
          emailStatus: 'confirmed'
        });
        break;

      // Otherwise, do nothing re: email
    }

    // Save to the db
    await User.updateOne({id: user.id })
    .set(valuesToSet);

    // If this is an immediate change, and billing features are enabled,
    // then also update the billing email for this user's linked customer entry
    // in the Stripe API to make sure they receive email receipts.
    // > Note: If there was not already a Stripe customer entry for this user,
    // > then one will be set up implicitly, so we'll need to persist it to our
    // > database.  (This could happen if Stripe credentials were not configured
    // > at the time this user was originally created.)
    if(desiredEmailEffect === 'change-immediately' && sails.config.custom.enableBillingFeatures) {
      let didNotAlreadyHaveCustomerId = (! user.stripeCustomerId);
      let stripeCustomerId = await sails.helpers.stripe.saveBillingInfo.with({
        stripeCustomerId: user.stripeCustomerId,
        emailAddress: newEmailAddress
      }).timeout(5000).retry();
      if (didNotAlreadyHaveCustomerId){
        await User.updateOne({ id: user.id })
        .set({
          stripeCustomerId
        });
      }
    }

    // If an email address change was requested, and re-confirmation is required,
    // send the "confirm account" email.
    if (desiredEmailEffect === 'begin-change' || desiredEmailEffect === 'modify-pending-change') {
      await sails.helpers.sendTemplateEmail.with({
        to: newEmailAddress,
        subject: 'Your account has been updated',
        template: 'email-verify-new-email',
        templateData: {
          fullName: inputs.fullName||user.fullName,
          token: valuesToSet.emailProofToken
        }
      });
    }

  }


};
