parasails.registerPage('user-list', {
  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
  data: {

    // Main syncing/loading state for this page.
    syncing: false,

    // Server error state for the form
    cloudError: '',

    // Success state when form has been submitted
    cloudSuccess: false,

    // selected user
    selectedUser: false,

    // open confirm delete modal
    confirmRemoveUserModalOpen: false
  },

  //  ╦  ╦╔═╗╔═╗╔═╗╦ ╦╔═╗╦  ╔═╗
  //  ║  ║╠╣ ║╣ ║  ╚╦╝║  ║  ║╣
  //  ╩═╝╩╚  ╚═╝╚═╝ ╩ ╚═╝╩═╝╚═╝
  beforeMount: function() {
    // Attach any initial data from the server.
    _.extend(this, SAILS_LOCALS);
  },
  mounted: async function() {
    // hide alert
    $('.alert').hide();
    // datatable
    $('#user-list-table').DataTable();
  },

  //  ╦╔╗╔╔╦╗╔═╗╦═╗╔═╗╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
  //  ║║║║ ║ ║╣ ╠╦╝╠═╣║   ║ ║║ ║║║║╚═╗
  //  ╩╝╚╝ ╩ ╚═╝╩╚═╩ ╩╚═╝ ╩ ╩╚═╝╝╚╝╚═╝
  methods: {

    // for disabled for current user
    isDisabled: function(userId){

      // disabled
      var disabled = true;

      // get user
      var user = _.find(this.userList, {id: userId});

      // if this is current users account
      if (this.me.id === user.id) {
        disabled = false;
      }
      // if super admin
      if (this.me.isSuperAdmin) {
        disabled = false;
      }
      // if federal admin
      if (this.me.admin0administrator) {
        disabled = false;
      }
      // if regional admin
      if (this.me.admin1administrator &&
            user.admin1pcode !== 'all' &&
            this.me.admin1pcode === user.admin1pcode) {
        disabled = false;
      }
      // if zonal admin
      if (this.me.admin2administrator &&
            user.admin2pcode !== 'all' &&
            this.me.admin2pcode === user.admin2pcode) {
        disabled = false;
      }
      // if woreda admin
      if (this.me.admin3administrator &&
            user.admin3pcode !== 'all' &&
            this.me.admin3pcode === user.admin3pcode) {
        disabled = false;
      }

      return disabled;
    },

    // navigate to user
    clickViewUser: function(userId){
      window.location = '/account/' + userId;
    },

    // prompt remove user
    clickRemoveUser: function(userId) {
      this.selectedUser = _.find(this.userList, {id: userId});
      // Open the modal.
      this.confirmRemoveUserModalOpen = true;
    },

    // handle parsing
    handleParsingRemoveUserForm: function(){
      return {
        form: 'user',
        user: this.selectedUser
      }
    },

    submittedRemoveUserForm: function(){
      // Show the success message.
      this.cloudSuccess = true;
      // Remove the thing from the list
      _.remove(this.userList, {id: this.selectedUser.id});
      // alert
      $('.alert').fadeTo(6000, 500).slideUp(500, function() {
        $('.alert').slideUp(500);
      });
      // Close the modal.
      this.selectedUser = undefined;
      this.confirmRemoveUserModalOpen = false;
    },

    // close modal
    closeRemoveUserModal: function(){
      // reset
      this.selectedUser = undefined;
      this.confirmRemoveUserModalOpen = false;
      this.cloudError = '';
    }

  }
});
