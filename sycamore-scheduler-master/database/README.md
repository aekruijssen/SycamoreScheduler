# Database Section
---

## Initializing the database
First, run database.sql and then run instructors_and_classes.sql to initialize all the values in the database.



### usc_class_scraper.py
To run the python (usc_class_scraper.py) script, simply run it with no parameters. 

It will create a file that you can specify within the script -- by default it is called classes.txt. 

The program will only APPEND to the file, so make sure to delete whatever is stored in the file before each time you run it.

The INSERT statements in the file can then be used as SQL queries to insert classes into the database (database.sql).

You MUST insert the instructors into the database before inserting the classes into the database to create the class-instructor link.

### insert_instructors.py
Parses the json given by Jon Luca's RateMyProfessor ratings on his github page.

A local copy of the ratings are stored at ratings.json.

INSERT statements are generated that allow someone to insert all the instructors into the database (database.sql).
