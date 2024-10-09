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
