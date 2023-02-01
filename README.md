# Customer Support

The Customer Support Center wants to add, edit and remove Support Agents. Customers want to be able to report a case for returning a product. Your software should assign an available Support Agent to handle a case automatically Support Agents should be able to list and resolve all the current active cases and Customers can add a new case. An agent can have only one case at a time. When the case is resolved, it should be marked so and the Support Agent should be free to take a new case

## Install

### Pre-Requisites

Before starting with system installation, the following are required

- Docker
- Docker Compose

#### Steps

1. Clone the repository.
2. Copy the .env.example file to .env: cp .env.example .env
3. pdate the values in the .env file (if needed).
4. Run `make install` (For initial setup)
6. Run the application `make run` (To run the containers)
7. Run `make shell service=node cmd="npm run test"`
8. Run `docker exec -it support-node bash`
9. Run `npm run start:dev"`
   
Note: Seed data is not available, so testing must be done using Postman for creating Customers and Agents, and the front-end for creating, listing, and resolving tickets.

### Test steps:
- Create customer [Postman]
- Create Agent [Postman]
- Login as Customer [Frontend]
- Create Ticket [Frontend]
- Create as agent [Frontend]
- Resolve Ticket [Frontend]
## Technical Details

### Technologies:

1. Nest.js.
2. Mysql database.
3. Typeorm as ORM.
4. Jest

### Architecture:

I used Monolithic Modular
#### My assumption
- I assumend this is as POC or MVP 
- Scalability: I assumed the scale is not so high and I can handle from the infrastructure in this stage
- I don't give the security attention in this POC 

### Design:

1. Repository for accessing the database layer.
2. Service Layer has business logic.
3. DTO pattern
4. I tried as I can follow framework design recommendations.

### Tradeoffs:

- Auto-assign ticket:
  - The availability of each agent is tracked using a flag and start time.
  - The ticket is assigned to the earliest available agent by pushing it onto a queue, and a job listens on this queue to pick the next available agent.
  - If no agent is available at the time, a warning will be logged and the job will retry three times before deleting the ticket from the queue.
  - A cron job will run every 5 minutes (based on the severity of the issue) to attempt to assign the ticket to an available agent.
- Relational database is used because the business requirements support this approach, with 4-5 entities having relationships with each other.


### TODO:
- Authorization
- Validation "Specially the unique constrain and make sure order is belong to the customer"
- Using config service
- Implement filters in getTickets
- Throw custom errors to make tracing and monitoring more easier 
- Cron job to assign tickets 
- Ticket workflow "I have to validate before resolve the ticket that it is already in progress for example"
- Complete CRUD operation for agents controller
- Customers module
- Order module or at least order table in DB
- Database Seed 
- CI/CD


