# Deploying the Application 
This branch is connected to a Heroku Deployment pipeline.  This is were the production code is staged and assembled.  This branch also provides version controll for deployments. `Procfile` tells Heroku how to run the executable.  `system.properties` specifies what version of java Heroku should use for the JVM to run the executable on. 

## How to Deploy
* run `pullServer.sh` to get the latest version of the server from the Server Branch  (if needed)
* run `pullWebFiles.bash` to get the latest web files from the Web branch and put them in the correct file structure    
* run `mvn clean` 
* run `mvn package`   
* add, commit and push (may take a while and may have warnings...has a lot of media files)
* navigate to the heroku dashboard to the deployments section 
* connect the github and select this branch      
* Deploy !!!      