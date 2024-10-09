![Open Source Love](https://badges.frapsoft.com/os/v1/open-source.svg?v=103)

# Restful E-Commerce

A simple Node E-Commerce application for testing RESTful web services. 
This application is built for testers to practice API Testing Manually using tools like [Postman](https://www.postman.com/downloads/) or using API Test Automation tools like [SuperTest](https://www.npmjs.com/package/supertest), [Rest-Assured](https://rest-assured.io/), [Playwright](https://playwright.dev/java/docs/api-testing), [Cypress](https://learn.cypress.io/advanced-cypress-concepts/integration-and-api-tests), [Boyka-Framework](https://github.com/BoykaFramework/boyka-framework), etc.

## Don't forget to give a :star: to make the project popular

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

# Installation using Docker
1. Clone the repo
1. Navigate into the restful-ecommerce root folder
1. Run `docker compose -f docker-compose-ecommerce.yml up -d` - This command will start the application in detached mode
1. APIs are exposed on http://localhost:3004/
1. Swagger is exposed on http://localhost:3004/api-docs

1. Run `docker compose -f docker-compose-ecommerce.yml down` to stop the application.

# Running the Unit Tests

After running all the steps mentioned in the `Installation steps` section, the following command will execute all the unit-tests. (It is optional to run the unit tests, these tests are written using Super-Test) 
1. Run `npm run unit-test`

## Checkout the API Documentation on the [Wiki-Page](https://github.com/mfaisalkhatri/restful-ecommerce/wiki)

## Tutorials of this Project 

### Blog

- [RESTful E-Commerce API in Node.js: Demo APIs for API Testing](https://medium.com/@iamfaisalkhatri/restful-ecommerce-a-simple-demo-node-e-commerce-application-for-practising-api-testing-db867ed3be9f)

### YouTube

- RESTful E-Commerce API in Node.js: Demo APIs for API Testing | Open Source | Tutorial

[![RESTful E-Commerce API in Node.js: Demo APIs for API Testing | Open Source | Tutorial](https://img.youtube.com/vi/9WDhjf-Qlo4/0.jpg)](https://www.youtube.com/watch?v=9WDhjf-Qlo4)


## API Testing Tutorials

- [Playwright Java API Testing | How to test POST requests?](https://medium.com/@iamfaisalkhatri/playwright-java-api-testing-how-to-test-post-requests-4c9102d3ab03)
- [Playwright Java API Testing | How to test GET requests?](https://medium.com/@iamfaisalkhatri/playwright-java-api-testing-how-to-test-get-requests-c036b984cc6d)
- [Playwright Java API Testing | How to test PUT requests?](https://medium.com/@iamfaisalkhatri/playwright-java-api-testing-how-to-test-put-requests-d6b1d054d64b)
- [Playwright Java API Testing | How to test PATCH requests?](https://medium.com/@iamfaisalkhatri/playwright-java-api-testing-how-to-test-patch-requests-f6b0867d91e7)
- [Playwright Java API Testing | How to test DELETE requests?](https://medium.com/@iamfaisalkhatri/playwright-java-api-testing-how-to-test-delete-requests-2ff77feb0383)
- [Postman Learning Center](https://learning.postman.com/)
- [Automating your API tests with REST Assured](https://testautomationu.applitools.com/automating-your-api-tests-with-rest-assured/)
- [How to perform End to End API Testing using Playwright with Java and TestNG](https://medium.com/@iamfaisalkhatri/how-to-perform-end-to-end-api-testing-using-playwright-with-java-and-testng-26b318927115)
- [End to End API Testing using rest-assured](https://medium.com/@iamfaisalkhatri/end-to-end-api-testing-using-rest-assured-a58c4ea80255)
- [Learn API Testing using Rest-Assured | Tutorial | Part 1](https://www.youtube.com/live/xLKpdQE0oKY?si=VCija9_74KVhkdQK)
- [Learn API Testing using Rest-Assured | Part 2 | Code Cleanup and Refactoring | Tutorial](https://www.youtube.com/live/AFQSolEeu74?si=QmRS9HTpjpHOcsq3)
- [Curated lists of all Free learning resources for Software Test Automation Engineer ](https://github.com/mfaisalkhatri/awesome-learning)

## :question: Need Assistance?

- Discuss your queries by writing to me @ `mohammadfaisalkhatri@gmail.com`
  OR ping me on any of the social media sites using the below link:
    - [Linktree](https://linktr.ee/faisalkhatri)
