# App.py Resources

- [Pony ORM Integration with Flask](https://docs.ponyorm.org/integration_with_flask.html)
- [First Steps with Pony ORM](https://docs.ponyorm.org/firststeps.html)
- [Flask-Restful Quickstart](https://flask-restful.readthedocs.io/en/latest/quickstart.html)
- [Flask Quickstart](https://flask.palletsprojects.com/en/3.0.x/quickstart/)
- [How to Connect ReactJS with Flask API](https://www.geeksforgeeks.org/how-to-connect-reactjs-with-flask-api/)
- [YouTube - A Helpful Guide on Using Flask for User Auth Login](https://www.youtube.com/watch?v=71EU8gnZqZQ)
- [Python Send Email Gmail - Mailtrap Blog](https://mailtrap.io/blog/python-send-email-gmail/)
- [Testing Database with Using db_session from Pony ORM](https://docs.ponyorm.org/transactions.html)

# Build Instructions

## 1. Install all necessary modules/libraries for the backend
List of pip installs if needed:

```bash
pip install Flask
pip install Flask-CORS
pip install Flask-JWT-Extended
pip install Flask-Login
pip install Werkzeug
pip install pony
pip install requests
pip install vite
pip install pytest
pip install jwt
```
##2. To run the backend make sure you cd into the backend folder. Afterwards, run app.py on Python

##3. To run the frontend make sure you cd into the frontend folder. Afterwards, run the command npm install to download all the necessary packages and libraries to run react. Afterwards, running the command npm run dev should get the frontend to run. We do not have a proper landing page so the route to access the application is: http://localhost:5173/login

# Navigating the Application
The general flow of the application for first time users is to create an account via hyperlink in the login page → set profile → dashboard. From the dashboard you can input meals, and access routes on navbar.

If you want to see the badges you can make a new profile and create your first meal and a popup should appear once you navigate to the dashboard page. If you want to see the other badges 3 days later/1 week later badge you should uncomment the line in frontend/routes/dashboard.jsx allowing you to change the amount of days. Make sure to delete local storage by inspect element in the application tab to see this behavior work.

Usage of the lookup and recipe tabs are helpful when inputting meals where specific macros are unknown.

# Known Bugs
1. The progress tab should be ignored. If we try deleting it and its files, it somehow causes the viewprofile route to break.

2. A blank square can be displayed on certain lookup results based on APIs database of jpgs.

3. Note styling issue with display of 3072 x 1920 on profile page
