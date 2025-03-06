## Routes

- Post /devtinder/signup
- Post /devtinder/login (protected)
- Get /devtinder/profile (protected)
- Patch /devtinder/profile/update (protected)
- Patch /devtinder/profile/password (protected)
- Post /devtinder/logout (protected)

## Request Routes

(From sender side)

- Post /request/send/interested/:userId (protected)
- Post /request/send/ignored/:userId (protected)

(From Receiver side)

- Post /request/review/accept/:requestid (protected)
- Post /request/review/reject/:requestid (protected)

### Connection request

- Get /request/allconnections/recieved (Protected)

### Feed Api

- Get /feed (protected) { It will grab the user's or profiles for you }
