# Deploying the Application 
This branch is connected to a Heroku Deployment pipeline.  This is were the production code is staged and assembled.  This branch also provides version controll for deployments. `Procfile` tells Heroku how to run the executable.  `system.properties` specifies what version of java Heroku should use for the JVM to run the executable on. 

## Requirements
* Git, Maven, Java 17, and **Node.js 18+ with npm** (needed to build the React admin app)
* The Web and Server branches must already be **pushed to GitHub**: the pull scripts clone them from the remote, not from your local copy

## How to Deploy
* run `bash pullServer.bash` to get the latest version of the server from the Server Branch  (if needed). Run this FIRST: it wipes everything in this folder except the files listed in `EXCLUDE_FILES`, including `src/`
* run `bash pullWebFiles.bash` to get the latest web files from the Web branch and put them in the correct file structure. This also builds the React admin app (`admin/` in the Web branch) and copies only the build output into `src/main/resources/public/admin`. Old files in `public/` (including the old HTML admin and login pages) are removed.
* run `mvn clean` 
* run `mvn package`   
* add, commit and push (may take a while and may have warnings...has a lot of media files)
* navigate to the heroku dashboard to the deployments section 
* connect the github and select this branch      
* Deploy !!!
## Config Vars (Heroku dashboard -> Settings)
* `JDBC_DATABASE_URI` - database connection string
* `POWER_AUTOMATE_URL` - used by the To-Do email reminders (the server logs an error and skips emails if it is missing)

## Admin app
The admin app is served at `/admin` (login at `/admin/login`). It calls the API on the same origin, so no API URL needs configuring in production.
