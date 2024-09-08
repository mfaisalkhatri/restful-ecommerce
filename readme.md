# Restful E-Commerce

A simple Node E-Commerce application for testing RESTful web services.

# Installation Steps
1. Clone the repo
1. Navigate into the restful-ecommerce root folder
1. Run `npm install`
1. Run `npm start`

APIs are exposed on http://localhost:3004/

Swagger is exposed on http://localhost:3004/api-docs

## Importing the API Collection into Postman

1. Visit `http://localhost:3004/swagger.json` to generate and download the Swagger JSON file
1. The Swagger JSON file will be saved as `swagger-output.json` in your project directory
1. Open `Postman` app and click on `Import`
1. Select file `swagger-output.json` from the root folder of the project
1. Select `OpenAPI 3.0 with a Postman Collection` and click on `Import`
1. All the Available APIs will be imported in Postman and can be used for testing


# Running the Unit Tests

After running all the steps mentioned in the `Installation steps` section
1. Run `npm run unit-test`


## Checkout the API Documentation on the [Wiki-Page](https://github.com/mfaisalkhatri/restful-ecommerce/wiki)