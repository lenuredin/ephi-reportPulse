parasails.registerPage('signup', {
  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
  data: {

    // Form data
    formData: { /* … */ },

    // For tracking client-side validation errors in our form.
    // > Has property set to `true` for each invalid property in `formData`.
    formErrors: { /* … */ },

    // Syncing / loading state
    syncing: false,

    // Server error state
    cloudError: '',

    // Success state when form has been submitted
    cloudSuccess: false,

  },

  //  ╦  ╦╔═╗╔═╗╔═╗╦ ╦╔═╗╦  ╔═╗
  //  ║  ║╠╣ ║╣ ║  ╚╦╝║  ║  ║╣
  //  ╩═╝╩╚  ╚═╝╚═╝ ╩ ╚═╝╩═╝╚═╝
  beforeMount: function() {
    // Attach any initial data from the server.
    _.extend(this, SAILS_LOCALS);
  },
  mounted: function() {
    this.$focus('[autofocus]');
    // select 1st values
    $('select').val($('select option:first').val());
  },

  //  ╦╔╗╔╔╦╗╔═╗╦═╗╔═╗╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
  //  ║║║║ ║ ║╣ ╠╦╝╠═╣║   ║ ║║ ║║║║╚═╗
  //  ╩╝╚╝ ╩ ╚═╝╩╚═╩ ╩╚═╝ ╩ ╩╚═╝╝╚╝╚═╝
  methods: {

    submittedForm: function() {

      if(this.isEmailVerificationRequired) {
        // If email confirmation is enabled, show the success message.
        this.cloudSuccess = true;
      }
      else {
        // Otherwise, redirect to the logged-in dashboard.
        // > (Note that we re-enable the syncing state here.  This is on purpose--
        // > to make sure the spinner stays there until the page navigation finishes.)
        this.syncing = true;
        window.location = '/';
      }
    },

    // filter admin lists on select
    adminChange: function( level ) {

      var argins = this.formData;

      // admin1
      if ( level === 'admin1' ) {

        // clear admin2
        delete this.formData.admin2pcode;
        delete this.formData.admin2name;

        // clear admin3
        delete this.formData.admin3pcode;
        delete this.formData.admin3name;
        this.admin3ListFilter = [];

        // filter admin2
        this.admin2ListFilter = _.filter(this.admin2List, function(item) {
          return argins.admin1pcode === item.admin1pcode;
        });
      }

      // admin2
      if ( level === 'admin2' ) {

        // clear admin2
        delete this.formData.admin3pcode;
        delete this.formData.admin3name;

        // filter admin3
        this.admin3ListFilter = _.filter(this.admin3List, function(item) {
          return argins.admin2pcode === item.admin2pcode;
        });
      }

      // set select display admin2
      // if ( !this.formData.admin2pcode ) {
      //   console.log('admin2 empty');
      //   console.log('Select ' + this.admin2List[0].admin2type_name + '...');
      //   $('#admin2pcode').val('Select ' + this.admin2List[0].admin2type_name + '...');
      //   // $('#admin2pcode').prop('selectedIndex', 0);
      // }

      // // set select display admin3
      // if ( !this.formData.admin3pcode ) {
      //   console.log('admin3 empty');
      //   $('#admin3pcode').val('Select ' + this.admin3List[0].admin3type_name + '...');
      //   // $('#admin3pcode').prop('selectedIndex', 0);
      // }

      // force state refresh
      this.$forceUpdate();
    },

    handleParsingForm: function() {

      // Clear out any pre-existing error messages.
      this.formErrors = {};

      var argins = this.formData;

      // Validate full name:
      if(!argins.fullName) {
        this.formErrors.fullName = true;
      }

      // Validate full name:
      if(!argins.phoneNumber) {
        this.formErrors.phoneNumber = true;
      }

      // Validate email:
      var isValidEmailAddress = parasails.require('isValidEmailAddress');
      if(!argins.emailAddress || !isValidEmailAddress(argins.emailAddress)) {
        this.formErrors.emailAddress = true;
      }

      // Validate position:
      // if(!argins.position) {
      //   this.formErrors.position = true;
      // }

      // Validate password:
      if(!argins.password) {
        this.formErrors.password = true;
      }

      // Validate password confirmation:
      if(argins.password && argins.password !== argins.confirmPassword) {
        this.formErrors.confirmPassword = true;
      }

      // Set admin1name
      if (argins.admin1pcode) {
        var admin1 = _.find(this.admin1List, function(item) {
          return argins.admin1pcode === item.admin1pcode;
        });
        argins.admin1name = admin1.admin1name;
      }

      // Set admin2name
      if (argins.admin2pcode) {
        var admin2 = _.find(this.admin2List, function(item) {
          return argins.admin2pcode === item.admin2pcode;
        });
        argins.admin2name = admin2.admin2name;
      }

      // Set admin3name
      if (argins.admin3pcode) {
        var admin3 = _.find(this.admin3List, function(item) {
          return argins.admin3pcode === item.admin3pcode;
        });
        argins.admin3name = admin3.admin3name;
      }

      // Validate ToS agreement:
      // if(!argins.agreed) {
      //   this.formErrors.agreed = true;
      // }

      // If there were any issues, they've already now been communicated to the user,
      // so simply return undefined.  (This signifies that the submission should be
      // cancelled.)
      if (Object.keys(this.formErrors).length > 0) {
        return;
      }

      return argins;
    }

  }
});
