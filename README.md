# dynamo-lambda

## Pre-requisites

- Create a users table in dynamoDB and add to serverless.yml on line 16.
- Create a user-defined CMK in KMS and add key to lines 20 and 24.
- Create user role for lambda and add to serverless cli config.

## Depolyment

- run `serverless deploy`

## Testing and coverage

- run `npm run test`

## Demo

You can access the createUser and listUsers api here:

- GET - https://k4zgrunu41.execute-api.ap-southeast-2.amazonaws.com/dev/users
- POST - https://k4zgrunu41.execute-api.ap-southeast-2.amazonaws.com/dev/users/create
