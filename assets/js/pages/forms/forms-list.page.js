parasails.registerPage('forms-list', {
  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
  data: {

    // Main syncing/loading state for this page.
    syncing: false,

    // For tracking client-side validation errors in our form.
    // > Has property set to `true` for each invalid property in `todo`.
    formErrors: { /* … */ },

    // Server error state for the form
    cloudError: '',

    // Success state when form has been submitted
    cloudSuccess: false,

    //
    selectedRecord: undefined,
    editViewRecordModalOpen: false,
    confirmRemoveRecordModalOpen: false

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
    // tables
    $('#record-list-pending-validation-table').DataTable();
    $('#record-list-validated-table').DataTable();
  },

  //  ╦╔╗╔╔╦╗╔═╗╦═╗╔═╗╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
  //  ║║║║ ║ ║╣ ╠╦╝╠═╣║   ║ ║║ ║║║║╚═╗
  //  ╩╝╚╝ ╩ ╚═╝╩╚═╩ ╩╚═╝ ╩ ╩╚═╝╝╚╝╚═╝
  methods: {

    // add new record
    clickAddButton: function(){
      // new empty record
      this.selectedRecord = {}
      // Open the modal.
      this.editViewRecordModalOpen = true;
    },

    // view the record
    clickViewEditRecord: function(recordId) {
      this.selectedRecord = _.find(this.records, {id: recordId});
      // Open the modal.
      this.editViewRecordModalOpen = true;
      // add 'large-lg' class
      setTimeout(function(){
        $('.modal-dialog').addClass('modal-lg');
      }, 201);
    },

    // handle parsing update
    handleParsingUpdateRecordForm: function(){
      return true;
    },

    // handle submission
    submittedUpdateRecordForm: function(){
      // Show the success message.
      this.cloudSuccess = true;
      // Close the modal.
      this.selectedRecord = undefined;
      this.confirmRemoveRecordModalOpen = false;
    },


    /* REMOVE */

    // prompt to remove record
    clickRemoveRecord: function(recordId) {
      // set selected
      this.selectedRecord = _.find(this.records, {id: recordId});
      // Open the modal.
      this.confirmRemoveRecordModalOpen = true;
    },

    // handle parsing remove record
    handleParsingDeleteRecordForm: function(){
      return {
        form_name: this.form.form_name,
        record: this.selectedRecord
      }
    },

    // remove from UI
    submittedDeleteRecordForm: function(){
      // Remove the thing from the list
      _.remove(this.records, {id: this.selectedRecord.id});
      // alert
      $('.alert').fadeTo(6000, 500).slideUp(500, function() {
        $('.alert').slideUp(500);
      });
      // Show the success message.
      this.cloudSuccess = true;
      // Close the modal.
      this.selectedRecord = undefined;
      this.confirmRemoveRecordModalOpen = false;
    },

    // close modal
    closeModalOpen: function(){
      this.selectedRecord = undefined;
      this.editViewRecordModalOpen = false;
      this.confirmRemoveRecordModalOpen = false;
      this.cloudError = '';
    }

  }
});
