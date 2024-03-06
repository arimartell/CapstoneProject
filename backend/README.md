App.py resources 
- https://docs.ponyorm.org/integration_with_flask.html
- https://docs.ponyorm.org/firststeps.html
- https://flask-restful.readthedocs.io/en/latest/quickstart.html
- https://flask.palletsprojects.com/en/3.0.x/quickstart/
- https://www.geeksforgeeks.org/how-to-connect-reactjs-with-flask-api/
- https://www.youtube.com/watch?v=71EU8gnZqZQ  (Guide on using Flask for User Auth Login)

Run app: 
cd backend
python3 app.py

Run test cases command:
pytest 

Note that we have to make sure that users used for unit tests are in the database

Database terminal commands https://www.sqlitetutorial.net/sqlite-select/:
cd backend
sqlite3 ./main.db3
SELECT * FROM user;
SELECT * FROM meal;
.tables
.schema