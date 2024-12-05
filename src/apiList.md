# api List

## authRouter

- POST - /signup
- POST - /login
- POST - /logout

 ## profileRouter
- GET - /profile/view
- PATCH - /profile/edit
- PATCH - /profile/password

## connectionReqestRoutere

- POST - /request/send/interested/:userId
- POST - /request/send/ignored/:userId
- POST - /request/review/accepted/:userId
- POST - /request/review/rejected/:userId


## userRouter
- GET - /user/request/received
- GET - /user/connection
- GET - user/feed - Gets you the profiles of other users on platform

Status: ignored , interested , accepted , rejected
 