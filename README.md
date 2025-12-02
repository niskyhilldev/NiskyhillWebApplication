# BAM Niskey Hill Cemetery Web Application (Server)
In this branch you will find two folders, server and database. The server branch contains the production code for the server for the web application.  The database folder contains information on how the database was constructed and how the data was entered into it. 

** This Branch is not intended to be merged into main ** 

## Server (Development Guide / Remarks)
The Server is a very traditional Server that utilizes the javelin framework.  Maven is used to manage dependancies.  The Server is built in 3 layers: 
* (1) Repository / Data Layer 
    * Ineracts with database (database.java)
    * models are used to represent database tables (except object representation)
* (2) Service Layer
    * This is where the buisiness logic is applied (services/*.java)
    * Ex: when and under what conditions does an HTTP error occur like 404 not found
    * DTO's are assembled using mappers, DTO's are what gets sent to the requester
* (3) Controller Layer
    * where endpoints are defined to interact with the server (server.java)
    * authorization is handled

Data always flows from 1 - 3 or 3 - 1, it never skips a layer.  While this does means more boiler plate code, it also means less room for error and overall makes the server more maintainable and readable.  

Resources/Public folder is a defined location for the application to serve files that can be rendered in a broswer (JS, HTML, CSS).  Theese files are availble on the Web branch of the git repo.  A bash script has been written to pull theese files over from the web branch and place them in the correct folder here on the server branch.  simple run `bash pullWebFiles.bash`.   

Maven is used to manage the dependancies for this project.  Developers will need to download maven and make sure it is in their classpath. To run the application, run the following commands in the terminal `mvn clean`, `mvn package`, `mvn exec:java` 

The database URI is stored in an envirmental varibale and is read from the Heroku envirnment when deployed. For development either set this at run time, or add a permininant environment variable to your development machine called `JDBC_DATABASE_URI`.  The uri can be obtained from heroku (see project document)


## Database (Development Guide / Remarks)
This project uses a PostgreSQL database.  The database is availble through Salesforce/Heroku. Developers should attain the URI through Heroku and a SQL editior (eg. DBeaver, PGAdmin4) to interact with it for development purposes

* The `Create_Tables` folder shows the sql scripts used to create the data model.  
* The `Data_Entry` folder contains the scripts that were used to enter obtained data into the database
    * This contains an error log that has line numbers that corisponds to an excel sheet (provided by the sponsor) to indicate rows that were not entered due to malformation or other error. 
    * Note: this data was scanned with AI and contains many errors
* The `Map_Cords_Entry` folder contains the script that was used to enter known map pixel coordinates used by the mapping interface
    * the `map_coordinates` table itself may seem like a major redundancy itself, see the comments in `map_coordinates.sql` for an explaination.  Just know it cointains well known lot locations that will likley never change nor will any additional lots ever be added to nisky hill


Note: Adding users to the system is done strictly through the database, a default hashed_password and salt are automatically assigned to a new user inserted into the table by the database.  Read through the table creation files to understand how to write a query to add a new user.

![ERD](/Database/ERD.png)

![Schema](/Database/Schema.png)





