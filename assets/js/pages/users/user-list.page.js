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

    // update message
    userUpdatestatus: 'Removed',

    // open confirm delete modal
    confirmVerifyUserModalOpen: false,
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

    /* VIEW USER */

    // navigate to user
    clickViewUser: function(userId){
      window.location = '/account/' + userId;
    },

    /* VERIFIY USER */

    // prompt remove user
    clickVerifyUser: function(userId) {
      // update message
      this.userUpdatestatus = 'Verified';
      // select
      this.selectedUser = _.find(this.userList, {id: userId});
      // Open the modal.
      this.confirmVerifyUserModalOpen = true;
    },

    // send user to server
    handleParsingVerifyUserForm: function(){
      this.selectedUser.emailStatus = 'confirmed';
      return this.selectedUser;
    },

    // user submitted
    submittedVerifyUserForm: function(){
      // Show the success message.
      this.cloudSuccess = true;
      // alert
      $('.alert').fadeTo(6000, 500).slideUp(500, function() {
        $('.alert').slideUp(500);
      });
      // Close the modal.
      this.selectedUser = undefined;
      this.confirmVerifyUserModalOpen = false;
    },

    /* REMOVE USER */

    // prompt remove user
    clickRemoveUser: function(userId) {
      // update message
      this.userUpdatestatus = 'Removed';
      // select user
      this.selectedUser = _.find(this.userList, {id: userId});
      // Open the modal.
      this.confirmRemoveUserModalOpen = true;
    },

    // handle parsing
    handleParsingRemoveUserForm: function(){
      return {
        user: this.selectedUser
      }
    },

    // user submitted
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
    closeUserModal: function(){
      // reset
      this.selectedUser = undefined;
      this.confirmVerifyUserModalOpen = false;
      this.confirmRemoveUserModalOpen = false;
      this.cloudError = '';
    }

  }
});
