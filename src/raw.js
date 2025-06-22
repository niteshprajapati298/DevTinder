const {adminAuth,userAuth}= require("./middlewares/auth")

const app = express(); // when we call this we are creating a web server using express

// 
// app.use("/admin/getAllData", (req,res)=>{
//   // check if the request is authorized

//    res.send("All data sent");
// })
// app.use("/admin/deleteUser", (req,res)=>{
//    //logic of fetching all data

//    res.send("Deleted a User");
// })

// Writing a dummy auth:-
app.use("/admin",adminAuth)
// app.use("/admin/getUser",(req,res)=>{
//     res.send(" User data fetched");
// })
app.get("/user",userAuth,(req,res)=>{
    res.send("User Data Sent")
});
 app.get("/user/UserId",userAuth,(req,res)=>{
    res.send("User Data Sent 2")
 })


// app.use("/user"
//     ,(req,res,next)=>
//     {
//     console.log("Handling the route user 1!!");
//     next();
    
// }
//     ,(req,res,next)=>
//     {
//     console.log("Handling the route user 2!!");
//     next();
    
// }
//     ,(req,res,next)=>
//     {
//     console.log("Handling the route user 3!!");
//     next();
    
// }
//     ,(req,res,next)=>
//     {
//     console.log("Handling the route user 4!!");
//     res.send("Data send successfully")
//     // next();
    
// }
// ) // This will throw an error bcoz it cannot get the user bcoz express is expecting a Route handler

// app.use() can handle all HTTP methods (GET, POST, etc.)

//Order is very important in routing

//this route will only handle  GET call to  /user 
// app.get("/user",(req, res)=>{
//   console.log(req.query); //to get the request query
//   res.send({firstName:"Nitesh",lastName:"Prajapati"});
// });// they query params give us the user inputs 


// //Handling dynamic routes :- /:routeName
// app.get("/user/:userId/:apiKey/:password",(req, res)=>{
//   console.log(req.params);//request params to get the 
//   res.send({firstName:"Nitesh",lastName:"Prajapati"});
// }); // they query params give us the user parameter 

// app.get("/ab?c",(req, res)=>{
//   res.send({firstName:"Nitesh",lastName:"Prajapati"});
// });// if we make a call on abc it will call abc but if write ac it will also make an api call to abc bcoz b is optional here
// app.get("/ab+c",(req, res)=>{
//   res.send({firstName:"Nitesh",lastName:"Prajapati"});
// });// if we make a call on ab+c it will call abc but if write abbbbbbbbbbbc it will also work
// app.get("/ab*cd",(req, res)=>{
//   res.send({firstName:"Nitesh",lastName:"Prajapati"});
// });// if we make a call on ab*cd it will call abcd but if we write in betweeen of ab  and cd it will also work 


// app.post("/user",(req,res)=>{
//     console.log("Save data to the Data base");
//     res.send("Data successfully saved to the database");
// });

// app.delete("/user",(req,res)=>{
//     res.send("Deleted Successfully")
// })

// // this wil match all the HTTP method API calls to /test
// app.use("/test", (req, res) => {
//     res.send("Hello from the server");
// });

