### BAM Nisky Hill Web Application (Web)

### Project Description
* This is the 'Web' branch of the frontend of the Nisky Hill Cemetery website project. During our semester, we used raw HTML, CSS, JS for the frontend, but you are encouraged to wrap this project in some kind of framework or library (use React.js for the easiest time). A lot of the frontend is pretty static, so I'll go over how to locally deploy and some of the backend integration in the case you're new to web-dev or thought CSE216 was as useless as we did. 

### Project Specifications
* User Accounts & Roles: there are 2 different roles for this project: users and admins. Users can view the website frontend and search for residents on the 'search' and 'profile' pages, and admins have access to an admin dashboard (/admin/dashboard.html) that displays residents, lots, and allows them to make changes or enter new data into the database. Currently, the database only has us and the Bethlehem Area Moravians team as authorized users, so you'll need to have your emails added at the beginning of the semester in order to mess around with the admin interface.

* The Home, History, Notable Residents, and FAQs pages are all static pages. 
* The Contact page, while mostly static, uses a service called FormSubmit to send messages directly to the sponsor's email account. This service is super convenient since it hides the sponsor's email from being on the frontend.
* The Find a Grave and Profile pages directly touch the database and allow users to search the database for buried residents. Users can filter by burial year and section. The Profile page also contains an interactive map, where each resident is connected to a set of coordinates.

* Database: included below are our database ERD and schema:
![Database ERD](https://github.com/tjs226/BAM_Niskey_Hill/blob/Web/img/Nisky_ERD.png)
![Database schema](https://github.com/tjs226/BAM_Niskey_Hill/blob/Web/img/Nisky_Schema.png)

* Internal REST API:
  * GET - `/residents/search?name` : Given a name, search for residents in the database with a matching first, middle, or last name
  * GET - `/sections/all` : Get all sections
  * GET - `/lots/residents/search` : Given a section or lot, perform a lot search matching those parameters
  * GET - `/lots/residents/search?section` : Given a section, perform a resident search matching those parameters
  * PUT - `/residents/update` : Update a resident's information
  * PUT - `/lots/update` : Update a lot's information
  * DELETE - `/residents/delete` : Delete a resident
  * DELETE - `/lots/delete` : Delete a lot
  * GET - `/auth/user` : Handle user auth for admin dashboard
  * GET - `/auth/user/status` : Get remaining token time and sets a timeout to redirect

### Running the Project
If you are testing purely frontend changes (as in, no need to connect with the database), using Node.js and running `npx http-server` is the best method (that, or using LiveServer). General tip when making changes to the frontend is to test how the changes look on different browsers. There were many times during development where a change would look good on Safari, but would not be functional on Chrome - so make sure to test this out before deploying.
