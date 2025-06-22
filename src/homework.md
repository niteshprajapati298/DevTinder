## Episode 3

- Create a repository
- Initialize the repository 
- node_modules , package , json , package-lock.json
- Install express
- Create a server
- Write request handlers for /test , /hello
- Install nodemon 
- What are dependencies 
- What is the use of "-g" while npm install
- Difference between caret and tilda (^ vs ~)

## Episode 4
- intialize git
- .gitignore
- Create a remote repo on github
- Push all code to remote origin
- Play with rmeote and route extensions ex. /hello , /hello/2 . /xyz 
- Order of the routes  matter a lot
- Install PostMan app and make a  workspace/collection > test API call 
- Write logic to handle GET , POST , PATCH , DELETE API Calls and test then on postman
- routing ??
- Explore routing and use of ? , + , () , * in the routes 
- Use of regex in routes /a/ /.*fly$/
- Reading the query params in the routes
- Reading the dynamic routes


## episode 5:-
- Multiple Route handlers :- play with the code
- next()
- next function and erros along with the res.send()
- app.use("/route",rH , rH2, rH3, rH4, rH5)
- write dummy auth middleware for all user routes except /user/login
- what is middle wares
- how express js basically handles requests behind the scenes
- write a dummy auth middle for admin
- difference between app.use and app.all
- Error handling using app.use "/" , (err , req , res , next) => {}


## Episode 6:- 
- Create a free cluster on mongo db official website (mognoDb atlas)
- Install mongoose library 
- connect your application to the database "connection-url"/devTinder
- call the connectDB function and connect to database before starting application on 7777....
- Create a userSchema & userModel
- signup API to add data to database
- push some documents using API calls from postman 
- Error Handling 

## Episode 7:-
- Difference between javascript object and JSON 
- Add the express.json middleware to your app
- Make your signup API dynamic to recieve data from the end user
- User.findOne with duplicate email ids which object returned
- API - get user by email
- API - Feed API - GET / feed =- get al the user from the database 
- API - get user by ID
- API - delete a user deleteuserbyid();
- API - put a user 
- API - patch a user
- Difference between patch and put 
- API - Update the user with emailId

## Episode 8:-
- Explore schematype options from the documentations
- and required , unique , lowercase , min , minLength , trim , and default
- Create a custom validate function for gender
- Improve the DB schema - PUT all appropriate validations on each field in schema
- Add timestamps to the userSchema
- API level validations on patch request & signup  post api
- Data sanitizing - add api validation for each field
- add API validation for each field;
- Install validator 
- Explore validator library functions and use validator function for password, email,url
- NEVER Trust req.body 



## Episode 9:- 

- validate data in signup API
- Install bcrypt package 
- Create a password hash using bcrypt.hash & save the user is encrypted password
- create a login API 
- compare passwords and throw errors if email or password is invalid
 

 ## Episode 10:-
 - install cookie parser       
 - send a dummy cookie to user
 - create GET/profile API and check if you get the cookie back
 - install jsonwebtoken
 - 
 - IN login API After email and passsword validation , create a JWT token and send it to user in cookies 
 - read the cookies inside your profile API and find the logged in user
 - Add the userAuth middle ware in profile API and a new sendConnectionRequest API
 - Set the expiry of JWT token and cookies to 7 days
 - Create userSchema method to getJWT()
 - Create UserSchema method to comparePassword(passwordInputByUser)

## Episode 11:-
- Explore tinder APIs
- Create a list all API you can think of is DevTinder
- Group multiple routes under respective routers 
- Read documentation for express.Router
- create authRouter , profileRouter , requestRouter
- Import these router in app.js
- create POST /logout API
- Create PATCH /profile/edit
- Create PATCH /profile/password API = > forgot password API
- Make your validate all data in every POST , PATCH apis


## Episode 12:- queries and indexes 
- Create Conncection Request Schema 
- Send conncection Request API
- Proper validation of Data  
- Think about all corner cases 
- $or query read more about it these type of queries
- schema.pre  function
- Read more about indexes in MongoDB
- Why do we need index in DB?
- What is the advantages and disadvantage of creating index?
- Read this article aobut compound indexes   
# Learnin lession :- think about corner cases else attacker can attack our api 
