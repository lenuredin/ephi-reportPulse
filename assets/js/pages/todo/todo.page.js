parasails.registerPage('todo', {
    //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
    //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
    //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
    data: {

      // Form data
      todo: { /* … */ },

      // Main syncing/loading state for this page.
      syncing: false,

      // For tracking client-side validation errors in our form.
      // > Has property set to `true` for each invalid property in `todo`.
      formErrors: { /* … */ },

      // Server error state for the form
      cloudError: '',

      // Success state when form has been submitted
      cloudSuccess: false,

      // display modal popup for success to use
      confirmSuccessModalOpen: false,

    },

    //  ╦  ╦╔═╗╔═╗╔═╗╦ ╦╔═╗╦  ╔═╗
    //  ║  ║╠╣ ║╣ ║  ╚╦╝║  ║  ║╣
    //  ╩═╝╩╚  ╚═╝╚═╝ ╩ ╚═╝╩═╝╚═╝
    beforeMount: function() {
      // Attach any initial data from the server.
      _.extend(this, SAILS_LOCALS);
    },

    mounted: async function() {
      // autofocus on first input
      // this.$focus('[autofocus]');
      $('.alert').hide();
    },

    //  ╦╔╗╔╔╦╗╔═╗╦═╗╔═╗╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ║║║║ ║ ║╣ ╠╦╝╠═╣║   ║ ║║ ║║║║╚═╗
    //  ╩╝╚╝ ╩ ╚═╝╩╚═╩ ╩╚═╝ ╩ ╩╚═╝╝╚╝╚═╝
    methods: {

      clickCancelButton: function(){
        // why is this not working?
        // this.goto('/todo');
        window.location.href = '/todo';
      },

      handleParsingForm: function() {

        // Clear out any pre-existing error messages.
        this.formErrors = {};

        var argins = this.todo;

        // Validate email:
        if(!argins.topic) {
          this.formErrors.topic = true;
        }

        // Validate name:
        if(!argins.description) {
          this.formErrors.description = true;
        }

        // If there were any issues, they've already now been communicated to the user,
        // so simply return undefined.  (This signifies that the submission should be
        // cancelled.)
        if (Object.keys(this.formErrors).length > 0) {
          return;
        }

        return argins;
      },

      submittedForm: function() {

        // Show the success message.
        this.cloudSuccess = true;

        // alerts
        this.confirmSuccessModalOpen = true;

        // set timeout and redirect
        setTimeout(function(){
          // why is this not working?
          // this.goto('/todo');
          window.location.href = '/todo';
        }, 2000 );

      }
    }
  });
