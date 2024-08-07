Lots of duplicate code: Build a central library as an NPM module to share code between our different projects
Hard to picture the flow of events: Precisely define all of our events in this shared library.
Hard to remember what properties events should have: write everything in Typescript.
Really hard to test some event flows: Write tests for as much as possible/resonable.
If machine becomes slow and laggy while running Kubernetes: Run a k8s cluster in the cloudand develop on it almost as quickly as local
what if someone adds post and created comment quickly: Introduce a lot of code to handle concurrancy issues

Next app

User can list tickets for an event
Others can purchase this ticket
Any user can list tickets for sale and purchase tickets
When a user attempts to purchase ticket, the ticket is locked for 15minutes. The user has 15minutes to enter their payment info.
While locked no other user can purchase the ticket. After 15 minutes the ticket should unlock
Ticket prices can be edited if they are not locked


Database: 

User: email, password
Order: userId, status (create | cancelled | awaiting payment | Completed), ticketId, expiresAt
Ticket: title, price, userId, orderId
Charge: orderId, status ( created | failed | completed), amount, stripeId, stripeRefundId

Services: 

Auth: User signup/signin/signout
tickets: ticket creation/editing/knows whether ticket can be updated
orders: Order creation/editing
expiration: watches for order to be created, cancels them after 15minutes
payments: handles credit card payment, Cancels order if payment fails, completes if payment succeeds


We are creating seperate service to manage each type of resources
Should we do this for every microservice app?
No, depends on the case, number of resources, business logic tied to each other
Perhaps feature based approach would be better

Events:

UserCreated
UserUpdated
OrderCreated
OrderCancelled
OrderExpired
TicketCreated
TicketUpdated
ChargeCreated


Technology Used:

Client: Next.js with Serverside rendering
Services: Node + MongoDB + Redis
Uses Shared Common Library : NPM Module to share code
NATS Streaming Server

Auth Service: 

Route: /api/users/signup
Method: POST
Body: {email: string, password: string}
Purpose: Sign Up for an Account

Route: /api/users/signin
Method: POST
Body: {email: string, password: string}
Purpose: Sign In to an existing Account

Route: /api/users/signout
Method: POST
Body: {}
Purpose: Sign Out of an Account

Route: /api/users/currentuser
Method: GET
Body: -
Purpose: Return Info about the user

