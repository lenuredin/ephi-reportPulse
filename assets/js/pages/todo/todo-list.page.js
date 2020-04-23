parasails.registerPage('todo-list', {
  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
  data: {
    //…
    todo:[],

    // show todo list
    todoItems: false,

    // show completed list
    completeItems: false,

    // nothing selected
    selectedTodo: undefined,

    // Main syncing/loading state for this page.
    syncing: false,

    // For tracking client-side validation errors in our form.
    // > Has property set to `true` for each invalid property in `todo`.
    formErrors: { /* … */ },

    // Server error state for the form
    cloudError: '',

    // Success state when form has been submitted
    cloudSuccess: false,

    // confirm todo modal
    confirmDeleteTodoModalOpen: false,

  },

  //  ╦  ╦╔═╗╔═╗╔═╗╦ ╦╔═╗╦  ╔═╗
  //  ║  ║╠╣ ║╣ ║  ╚╦╝║  ║  ║╣
  //  ╩═╝╩╚  ╚═╝╚═╝ ╩ ╚═╝╩═╝╚═╝
  beforeMount: function() {
    // Attach any initial data from the server.
    _.extend(this, SAILS_LOCALS);
    this.todoItems = this._displayTodoList(this.todo);
    this.completeItems = this._displayCompleteList(this.todo);
  },
  mounted: async function() {
    // hide alert
    $('.alert').hide();
  },

  //  ╦╔╗╔╔╦╗╔═╗╦═╗╔═╗╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
  //  ║║║║ ║ ║╣ ╠╦╝╠═╣║   ║ ║║ ║║║║╚═╗
  //  ╩╝╚╝ ╩ ╚═╝╩╚═╩ ╩╚═╝ ╩ ╩╚═╝╝╚╝╚═╝
  methods: {

    // show / hide list
    _displayTodoList: function(todo) {
      var display = false;
      todo.forEach(function(d){
        if (!d.complete) {
          display = true;
        }
      });
      return display;
    },

    // show / hide list
    _displayCompleteList: function(todo) {
      var display = false;
      todo.forEach(function(d){
        if (d.complete) {
          display = true;
        }
      });
      return display;
    },

    // click add todo
    clickAddButton: function() {
      // why is this not working?
      // this.goto('/todo/new');
      window.location.href = '/todo/new';
    },

    // click to open delete confirmation
    clickDeleteTodo: function(todoId) {
      // select todo
      this.selectedTodo = _.find(this.todo, { id: todoId });
      // Open the modal.
      this.confirmDeleteTodoModalOpen = true;
    },

    // close / cancel model
    closeDeleteTodoModal: function() {
      this.selectedTodo = undefined;
      this.confirmDeleteTodoModalOpen = false;
      this.cloudError = '';
    },

    // ajax form action
    handleParsingDeleteTodoForm: function() {
      return {
        id: this.selectedTodo.id
      };
    },

    // sent todo delete
    submittedDeleteTodoForm: function(){
      // Remove the thing from the list
      _.remove(this.todo, { id: this.selectedTodo.id });

      // alert
      $('.alert').fadeTo(6000, 500).slideUp(500, function() {
        $('.alert').slideUp(500);
      });

      // Close the modal.
      this.selectedTodo = undefined;
      this.confirmDeleteTodoModalOpen = false;
    }
  }
});
