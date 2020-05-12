![ephiPulse](https://github.com/pfitzpaddy/ephi-reportPulse/blob/master/assets/images/ephiPulse_120px.png)
# ephiPulse
Report. Validate. Protect.
> To ensure rapid detection of public health threats, a robust early warning, preparedness and recovery system is required. To achieve this mission, the Ethiopian Public Health Institute (EPHI) established a fully integrated, adaptable, all-hazards approach called the Public Health Emergency Management (PHEM) system, adopting International Health Regulations (2005). Emergency preparedness, early detection, response and recovery from public health emergencies can minimize economic and environmental impacts. Real-time data is the key to this success.


# ephiPulse Framework

The ephiPulse Full Stack JavaScript Framework is build on [Sailsjs](https://sailsjs.com/) and follows the patterns and implementation detailed in the Platzi SailsJS [course](https://courses.platzi.com/courses/sails-js/).

Reference Libraries

1. [Sailsjs](https://sailsjs.com/)
> For details on backend - ORM, models, controllers and APIs

2. [Bootstrap4](https://getbootstrap.com/)
> For HTML snippets and front-end components used in ejs templates

3. [EJS](https://ejs.co/)
> SailsJs default HTML templating engine

4. [VueJS](https://vuejs.org/)
> VueJS for front-end interaction and rendering


# Running ephiPulse

Steps

1. In the terminal, clone this repository and navigate into ``ephi-reportPulse``

2. Install dependecies; run ``sudo npm install``

3. Start server; run ``sudo sails lift``

# Sails Comamnds

The following commands are run from the command line in the folder of the repository.

### Generate a new page

Steps

``sails generate page things/available-things``

Generates the following files
```
  - views/pages/things/available-things.ejs
  - api/controllers/things/view-available-things.ejs
  - assets/styles/pages/things/available-things.less
  - assets/js/pages/things/available-things.page.js
```
```
    A few reminders:
     (1)  These files were generated assuming your Sails app is using
          Vue.js as its front-end framework.  (If you're unsure,
          head over to https://sailsjs.com/support)

     (2)  You'll need to manually add a route for this new page's
          action in your `config/routes.js` file; e.g.
              'GET /todo/todo': { action: 'todo/view-todo' },

     (3)  You'll need to manually import the new LESS stylesheet
          from your `assets/styles/importer.less` file; e.g.
              @import 'pages/todo/todo.less';

     (4)  Last but not least, since some of the above are backend changes,
          don't forget to re-lift the server before testing!
```
          
### Generate a new model

Steps

``sails generate model Thing``

    Generates the following files
    - api/models/Things.js

### Generate a new action

Steps

``sails generate action things/destroy-one-thing``

    Generates the following files
    - api/controllers/things/destroy-one-thing.js

    Udpate config/routes.js
    ``DELETE /api/v1/destroy-one-thing { action: 'things/destroy-one-thing' }``

    Usage
    ``<ajax-form action="destroyOneThing"></ajax-form>``

### Build SailsJS cloud SDK

Dont forget to build the SDK after generating the new action

    ``sudo sails run scripts/rebuild-cloud-sdk.js``


# Adding a new ODK Form

The following updates are required for each new form added to ODK Aggregate.

Steps

1. Add a new model to 'api/models/forms/' based on the new ODK Aggregate form.
> The name of the model should match the name of the ODK Aggreate table in PHEM schema

2. Add a new partial HTML snippet to 'views/pages/forms/partials/tables' to display ODK form specific attributes in the table.
> The name of the table partial should match the name of the ODK Aggreate 'FORM_ID' column of the PHEM._form_info table

3. Add a new partial HTML snippet to 'views/pages/forms/partials/modals/delete' to display a custom warning messgage when deleting a record from the new ODK form.
> The name of the delete partial should match the name of the ODK Aggreate 'FORM_ID' column of the PHEM._form_info table

4. Add a new partial HTML snippet to 'views/pages/forms/partials/modals/add-update' to display a custom form for the new ODK Aggreate form for CRUD operations from the SailsJS Web App.
> The name of the add-update partial should match the name of the ODK Aggreate 'FORM_ID' column of the PHEM._form_info table

5. Update 'assets/js/utilities/xls-form-choices.js' to include the options for fields of the new ODK Aggregate form in SailsJS Web App.
> This will need to be updated / kept up-to-date with changes in the ODK Aggregate form.

6. Update 'assets/js/utilities/xls-form-dates.js' to include the date fields of the new ODK Aggregate form.
> This will update the format of the date columns in the db for the UI and then once again before writing into the db.

7. Update 'assets/js/utilities/xls-form-validation.js' to include the fields of the new ODK Aggregate form.
> This will run form validation before each save / edit.


# PM2 Implementation for PROD

To ensure that the application restarts automatically on a server error, implement PM2 as follows (-i) should match the numner of cores of the server, i.e. 2;

``sudo pm2 start /home/ubuntu/nginx/www/ephi-reportPulse/app.js --node-args="--max_old_space_size=3584 --expose-gc" -i 2 -- --prod``
