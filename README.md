# BAM Niskey Hill Web Application (main)
Codebase for the Lehigh 2025 Capstone team for Bethlehem Area Moravians - Nisky Hill Cemetery Project.     

## Remarks
This README is a Summary of the Notes/Errata Sheet which can be requested from the sponsor (Erik Sink) which is most likely how you got the link to this repository !!!. He will need to add you as a colaborator


## About this Repository 
Each Brach (and somtimes folders within) contains a readme document pertiaining to all the information needed for development. Below is a guide to the branch strucutre in this repository: 

1. Main 
    * Unused 
    * Only contains this readme file
2. Server
    * Holds the Server files (Server Folder)
        * Has a bash script to pull Web files and put them in the correct spot for testing
    * Holds the SQL scripts and Java files (Database folder) used to:
        * Build the database (relational model)
        * Enter Sample Data
        * enter the Real data from the CSV files
        * Enter map coordinates for the map 
        * Also has the Database Schema and ERD
3. Map 
    * Where the interactive map was developed 
    * No Longer in use as this branch was merged to the Web branch 
4. Scripts 
    * Scripts used to clean data for entry into database
5. Web 
    * The entire front end is on this branch in a very specific file structure
6. Heroku-Deployment
    * Branch used for deployments 
    * All of the deployment history lives here 
    * Bash Scripts pull work from other branches (make sure you git pull )
    * Linked to Heroku 

