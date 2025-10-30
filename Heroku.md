# How to Deploy    
    - run pullServer.sh to get the latest version of the server from the Server Branch  (if needed)
    - run pullWebFiles.bash to get the latest web files from the web branch and put them in the correct file structure    
    - run mvn clean 
        - Maven is used to manage this project, make sure it is in you class path       
    - run mvn package        
    - run 'git add .'      'git commit -m"meaningfull message"'      'git push'              
    - go to heroku website and deply Heroku-Deployment Branch          