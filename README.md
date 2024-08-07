## Overview

### Issues Handled
- Lots of duplicate code: Build a central library as an NPM module to share code between our different projects.
- Hard to picture the flow of events: Precisely define all of our events in this shared library.
- Hard to remember what properties events should have: Write everything in TypeScript.
- Really hard to test some event flows: Write tests for as much as possible/reasonable.
- If machine becomes slow and laggy while running Kubernetes: Run a k8s cluster in the cloud and develop on it almost as quickly as local.
- What if someone adds a post and creates a comment quickly: Introduce a lot of code to handle concurrency issues.

## Next App

### Functionality
- User can list tickets for an event.
- Others can purchase this ticket.
- Any user can list tickets for sale and purchase tickets.
- When a user attempts to purchase a ticket, the ticket is locked for 15 minutes. The user has 15 minutes to enter their payment info.
- While locked, no other user can purchase the ticket. After 15 minutes, the ticket should unlock.
- Ticket prices can be edited if they are not locked.

### Database Schema
- **User**: email, password.
- **Order**: userId, status (create | cancelled | awaiting payment | Completed), ticketId, expiresAt.
- **Ticket**: title, price, userId, orderId.
- **Charge**: orderId, status (created | failed | completed), amount, stripeId, stripeRefundId.

### Services
- **Auth**: User signup/signin/signout.
- **Tickets**: Ticket creation/editing/lock management.
- **Orders**: Order creation/editing.
- **Expiration**: Watches for orders to expire after 15 minutes.
- **Payments**: Handles credit card payments, cancels orders if payment fails, completes if payment succeeds.

## Technology Stack

### Used Technologies
- **Client**: Next.js with Server-side rendering.
- **Services**: Node.js + MongoDB + Redis.
- **Shared Common Library**: NPM Module to share code.
- **Event Bus**: NATS Streaming Server.

## Auth Service API

- **Route**: /api/users/signup
  - **Method**: POST
  - **Body**: {email: string, password: string}
  - **Purpose**: Sign Up for an Account

- **Route**: /api/users/signin
  - **Method**: POST
  - **Body**: {email: string, password: string}
  - **Purpose**: Sign In to an existing Account

- **Route**: /api/users/signout
  - **Method**: POST
  - **Body**: {}
  - **Purpose**: Sign Out of an Account

- **Route**: /api/users/currentuser
  - **Method**: GET
  - **Body**: -
  - **Purpose**: Return Info about the user
