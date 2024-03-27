# Tooling

## Hosting
The application is hosted on [Render](https://render.com/)s free tier, this means that during inactivity, the application will spin down and may require up to 50s to respond to the first request.
The production database is hosted as a free cluster on [MongoDB Atlas](https://www.mongodb.com/atlas/database).

## Building and running
This application is built using [Bun](https://bun.sh/), scripts ran using npm may or may not work as intended. For best dev experience, please [install](https://bun.sh/docs/installation) the Bun runtime.


# Scripts explained
* `bun docker:publish` build and publishes a new docker image (requires rights)
* `bun docker:run` pulls the latest image of mongodb and the application and starts them in silent mode
* `bun dev` runs index.ts in watch mode
* `bun prod` runs the application in production configuration
* `bun run deploy` runs the docker:publish script, pushes the latest changes to github which in turn fires an event to [Render](https://render.com/) which pulls the latest docker image of the application and redeploys it
* `bun populate` populates the database with testing data (WIP)

# Testing
Testing is done using [Postman](https://www.postman.com/). Simply drag and drop **Assignment-API.postman_collection.json** (located in the root of the project) into postmans import window and start the runner. When importing the postman collection the **BASE_URL** will be set to the production server, to test against your local machine, run the application using `bun docker:run` or `bun dev` and set the postman variable to localhost:3000(docker)/4000(dev). Some of the endpoints are protected, however postman has a pre-script which will sign you in and add the authentication token before sending requests.

# Using the api
The api is located under **/api/v1**, from there, you can access the other endpoints by browsing the api, or by looking at the docs under **/api/v1/docs** which are currently only served as html(swagger), however a json option will be developed.

### Populated data

The populated data about humidity, weight, hive-flow and temperature is all from 2017. Please consider this when using the api to query these. When querying, use to and from as paramaters, if no paramaters are submitted the last 24 hours of data will be sent (There is no data for these in the last 24 hours).

### Production

The production api can be found on [Render](https://assignment-api-latest.onrender.com/api/v1).



