## Routes

## AuthRoutes

- Post /devtinder/signup ✅
- Post /devtinder/login (protected) ✅
- Get /devtinder/profile/view (protected) ✅
- Patch /devtinder/profile/update (protected) ✅
<!-- - Patch /devtinder/profile/password (protected) -->
- Post /devtinder/logout (protected) ✅
- Post /devtinder/forgotPassword ✅

## Request Routes

(From sender side)

<!-- - Post /request/send/interested/:userId (protected)
- Post /request/send/ignored/:userId (protected) -->

- Post /devTinder/request/:status/:userId (protected)

(From Receiver side)

<!-- - Post /request/review/accept/:requestid (protected)
- Post /request/review/reject/:requestid (protected) -->

- /devTinder/request/review/:status/:requestId (protected)

<!-- ### Connection request
- Get /request/allconnections/recieved (Protected) -->

### userConnections Route

- Get /devTinder/connections/requests/recieved (protected)
- Get /devTinder/connections/allConnections [Only the connections that has the accepted status] (protected)

### Feed Api
- Get /feed (protected) { It will grab the user's or profiles for you }
