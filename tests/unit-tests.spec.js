import request from 'supertest';
import orders from '../testdata/neworders.json' with { type: "json" };
import orderObject from '../testdata/neworder_only_object.json' with { type: "json" }
import missingFieldsOrder from '../testdata/neworder_field_missing.json' with { type: "json" }
import authCredentials from '../testdata/auth_credentials.json' with {type: "json"}
import updateOrder from '../testdata/update_order.json' with {type: "json"}
import missingFieldInUpdateOrder from '../testdata/update_order_field_missing.json' with {type: "json"}
import {expect} from 'chai';


describe('Unit Tests of E-Commerce application', () => {
	const baseurl = 'http://localhost:3004';

	it('should return status code 404 as no order exists', async() => {
		let response = await request(baseurl).get('/getAllOrders');
		expect(response.statusCode).to.be.equal(404)
		expect(response.body.message).to.be.equal('No Order found!!');

	});

	it('should return status code 400 for invalid order format', async() => {

		let response = await request(baseurl).post('/addOrder').send(orderObject);
		expect(response.statusCode).to.be.equal(400)
		expect(response.body.message).to.be.equal('Request Payload must be an array of orders!');
		 
	});

	it('should return status code 400 with message for fields missing in order', async() => {

		let response = await request(baseurl).post('/addOrder').send(missingFieldsOrder);
		expect(response.statusCode).to.be.equal(400)
		expect(response.body.message).to.be.equal('Each order must have user_id, product_id, product_name, product_amount, qty, tax_amt, and total_amt!');
	});

	it('should create orders and return status code 201', async() => {

		let response = await request(baseurl).post('/addOrder').send(orders);
		expect(response.statusCode).to.be.equal(201)
		expect(response.body.message).to.be.equal('Orders added successfully!');
		expect(response.body.orders[0].id).not.to.be.null;
		expect(response.body.orders.length).to.be.equal(4);
		expect(response.body.orders[1].product_name).to.be.equal('iPad');
		expect(response.body.orders[1].product_amount).to.be.equal(699);
		expect(response.body.orders[1].qty).to.be.equal(1);
		expect(response.body.orders[1].tax_amt).to.be.equal(7.99);
		expect(response.body.orders[1].total_amt).to.be.equal(706.99);    
	});

	it('should get all available orders successfully with status code 200', async() => {
	
		let response = await request(baseurl).get('/getAllOrders');
		expect(response.statusCode).to.be.equal(200);
		expect(response.body.message).to.be.equal('Orders fetched successfully!');
		expect(response.body.orders.length).to.be.equal(4);
		expect(response.body.orders[0].user_id).to.be.equal('1');
		expect(response.body.orders[0].product_id).to.be.equal('1');
		expect(response.body.orders[0].product_name).to.be.equal('iPhone');
		expect(response.body.orders[0].product_amount).to.be.equal(500);
		expect(response.body.orders[0].qty).to.be.equal(1);
		expect(response.body.orders[0].tax_amt).to.be.equal(5.99);
		expect(response.body.orders[0].total_amt).to.be.equal(505.99);    
	});

	it('should filter and fetch order on order id with status code 200', async() => {
		let response = await request(baseurl).get('/getOrder').query({id: 1});
		expect(response.statusCode).to.be.equal(200);
		expect(response.body.message).to.be.equal('Order found!!');
		expect(response.body.orders.length).to.be.above(0);
		expect(response.body.orders[0].user_id).to.be.equal('1');
		expect(response.body.orders[0].product_id).to.be.equal('1');
		expect(response.body.orders[0].product_name).to.be.equal('iPhone');
		expect(response.body.orders[0].product_amount).to.be.equal(500);
		expect(response.body.orders[0].qty).to.be.equal(1);
		expect(response.body.orders[0].tax_amt).to.be.equal(5.99);
		expect(response.body.orders[0].total_amt).to.be.equal(505.99);    
	});

	it('should filter and fetch order on product_id with status code 200', async() => {
		let response = await request(baseurl).get('/getOrder').query({product_id: 3});
		expect(response.statusCode).to.be.equal(200);
		expect(response.body.message).to.be.equal('Order found!!');
		expect(response.body.orders.length).to.be.above(0);
		expect(response.body.orders[0].user_id).to.be.equal('3');
		expect(response.body.orders[0].product_id).to.be.equal('3');
		expect(response.body.orders[0].product_name).to.be.equal('Samsung S24 Ultra');
		expect(response.body.orders[0].product_amount).to.be.equal(4300);
		expect(response.body.orders[0].qty).to.be.equal(1);
		expect(response.body.orders[0].tax_amt).to.be.equal(5.99);
		expect(response.body.orders[0].total_amt).to.be.equal(4305.99);    
	});

	it('should filter and fetch order on user_id with status code 200', async() => {
		let response = await request(baseurl).get('/getOrder').query({user_id: 1});
		expect(response.statusCode).to.be.equal(200);
		expect(response.body.message).to.be.equal('Order found!!');
		expect(response.body.orders.length).to.be.above(0);
		expect(response.body.orders[1].user_id).to.be.equal('1');
		expect(response.body.orders[1].product_id).to.be.equal('2');
		expect(response.body.orders[1].product_name).to.be.equal('iPad');
		expect(response.body.orders[1].product_amount).to.be.equal(699);
		expect(response.body.orders[1].qty).to.be.equal(1);
		expect(response.body.orders[1].tax_amt).to.be.equal(7.99);
		expect(response.body.orders[1].total_amt).to.be.equal(706.99);
	});

	it('should return 404 status code when query no records are found for the order id filter', async() => {
		let response = await request(baseurl).get('/getOrder').query({id: 6});
		expect(response.statusCode).to.be.equal(404);
		expect(response.body.message).to.be.equal('No Order found with the given parameters!');

	});

	it('should return 404 status code when query no records are found for the user id filter', async() => {
		let response = await request(baseurl).get('/getOrder').query({user_id: 6});
		expect(response.statusCode).to.be.equal(404);
		expect(response.body.message).to.be.equal('No Order found with the given parameters!');

	});

	it('should return 404 status code when query no records are found for the product id filter', async() => {
		let response = await request(baseurl).get('/getOrder').query({product_id: 6});
		expect(response.statusCode).to.be.equal(404);
		expect(response.body.message).to.be.equal('No Order found with the given parameters!');

	});

	it('should return the order with multiple filter queries with status code 200', async() =>{
		let response = await request(baseurl).get('/getOrder').query({id: 3, user_id: 2, product_id: 2});
		expect(response.statusCode).to.be.equal(200);
		expect(response.body.message).to.be.equal('Order found!!');
		expect(response.body.orders.length).to.be.above(0);
		expect(response.body.orders[0].id).to.be.equal(3);
		expect(response.body.orders[0].user_id).to.be.equal('2');
		expect(response.body.orders[0].product_id).to.be.equal('2');
		expect(response.body.orders[0].product_name).to.be.equal('iPhone 15 PRO');
		expect(response.body.orders[0].product_amount).to.be.equal(999);
		expect(response.body.orders[0].qty).to.be.equal(2);
		expect(response.body.orders[0].tax_amt).to.be.equal(9.99);
		expect(response.body.orders[0].total_amt).to.be.equal(1088.99);

	});

	it('should return status code 404 and not return any order when multiple filter query params dont match', async() =>{
		let response = await request(baseurl).get('/getOrder').query({id: 1, user_id: 3, product_id: 2});
		expect(response.statusCode).to.be.equal(404);
		expect(response.body.message).to.be.equal('No Order found with the given parameters!');	
	});

	it('should generate the valid token with status code 201 ', async() => {
		let response = await request (baseurl).post('/auth').send(authCredentials);
		expect(response.statusCode).to.be.equal(201);
		expect(response.body.message).to.be.equal('Authentication Successful!');
		expect(response.body.token).not.to.be.null;
	});

	it('should not generate the token and return status code 401 when invalid credentials are supplied ', async() => {
		let response = await request (baseurl).post('/auth').send({username: "admin", password: "Password123"});
		expect(response.statusCode).to.be.equal(401);
		expect(response.body.message).to.be.equal('Authentication Failed! Invalid username or password!');
	});

	it('should not generate the token and return status code 401 when only username is provided and password is missing', async() => {
		let response = await request (baseurl).post('/auth').send({username: "admin"});
		expect(response.statusCode).to.be.equal(400);
		expect(response.body.message).to.be.equal('Username and Password is required for authentication!');
	});

	it('should not generate the token and return status code 400 when only password is provided and username is missing', async() => {
		let response = await request (baseurl).post('/auth').send({password: "pass123"});
		expect(response.statusCode).to.be.equal(400);
		expect(response.body.message).to.be.equal('Username and Password is required for authentication!');
	});

	it('should not generate the token and return status code 401 when username is blank', async() => {
		let response = await request (baseurl).post('/auth').send({username: "blank", password: "admin"});
		expect(response.statusCode).to.be.equal(401);
		expect(response.body.message).to.be.equal('Authentication Failed! Invalid username or password!');
	});

	it('should not generate the token and return status code 401 when password is blank', async() => {
		let response = await request (baseurl).post('/auth').send({username: "admin", password: "blank"});
		expect(response.statusCode).to.be.equal(401);
		expect(response.body.message).to.be.equal('Authentication Failed! Invalid username or password!');

	});

	it('should not generate the token and return status code 401 when both username and password is blank', async() => {
		let response = await request (baseurl).post('/auth').send({username: "blank", password: "blank"});
		expect(response.statusCode).to.be.equal(401);
		expect(response.body.message).to.be.equal('Authentication Failed! Invalid username or password!');
	});

	it('should update the order successfully and return status code 200', async() => {

		let authResponse = await request (baseurl).post('/auth').send(authCredentials);
	
		let response = await request (baseurl).put('/updateOrder/2')
		.set('Content-Type', 'application/json')
		.set('Authorization', authResponse.body.token)
		.send(updateOrder);
		expect(response.statusCode).to.be.equal(200);
		expect(response.body.message).to.be.equal('Order updated successfully!');
		expect(response.body.order.user_id).to.be.equal('3');
		expect(response.body.order.product_id).to.be.equal('7');
		expect(response.body.order.product_name).to.be.equal('Samsung Android Television');
		expect(response.body.order.product_amount).to.be.equal(8559.89);
		expect(response.body.order.qty).to.be.equal(3);
		expect(response.body.order.tax_amt).to.be.equal(1283.98);
		expect(response.body.order.total_amt).to.be.equal(26960.98);
	});

	it('should return 404 when order with the given id is not found for update', async() => {

		let authResponse = await request (baseurl).post('/auth').send(authCredentials);

		let response = await request (baseurl).put('/updateOrder/90')
		.set('Content-Type', 'application/json')
		.set('Authorization', authResponse.body.token)
		.send(updateOrder);
		expect(response.statusCode).to.be.equal(404);
		expect(response.body.message).to.be.equal('No Order found with the given Order Id!');

	});

	it('should not update the order when authorization token is missing in the update request and return status code 403', async() => {

		let response = await request (baseurl).put('/updateOrder/2').send(updateOrder);
		expect(response.statusCode).to.be.equal(403);
		expect(response.body.message).to.be.equal('Forbidden! Token is missing!');
	});
	
	it('should not update the order when authorization token is invalid and return status code 400', async() => {

		let response = await request (baseurl).put('/updateOrder/2')
		.set('Content-Type', 'application/json')
		.set('Authorization', 'invalidtokenuyiy234sdf')
		.send(updateOrder);
		expect(response.statusCode).to.be.equal(400);
		expect(response.body.message).to.be.equal('Failed to authenticate token!');
	});

	it('should not update the order when a field is missing from request body and return status code 400', async() => {
		let authResponse = await request (baseurl).post('/auth').send(authCredentials);

		let response = await request (baseurl).put('/updateOrder/2')
		.set('Content-Type', 'application/json')
		.set('Authorization', authResponse.body.token)
		.send(missingFieldInUpdateOrder);
		expect(response.statusCode).to.be.equal(400);
		expect(response.body.message).to.be.equal('Each Order must have user_id, product_id, product_name, product_amount, qty, tax_amt, and total_amt!');

	});

	it('should update the order partially and return status code 200 ', async() => {
		let authResponse = await request (baseurl).post('/auth').send(authCredentials);

		let response = await request (baseurl).patch('/partialUpdateOrder/2')
		.set('Content-Type', 'application/json')
		.set('Authorization', authResponse.body.token)
		.send({"tax_amt": 60.77, "total_amt": 25740.44});
		expect(response.statusCode).to.be.equal(200);
		expect(response.body.message).to.be.equal('Order updated successfully!');
		expect(response.body.order.user_id).to.be.equal('3');
		expect(response.body.order.product_id).to.be.equal('7');
		expect(response.body.order.product_name).to.be.equal('Samsung Android Television');
		expect(response.body.order.product_amount).to.be.equal(8559.89);
		expect(response.body.order.qty).to.be.equal(3);
		expect(response.body.order.tax_amt).to.be.equal(60.77);
		expect(response.body.order.total_amt).to.be.equal(25740.44);
	});

	it('should return 404 when order with the given id is not found for partial update', async() => {

		let authResponse = await request (baseurl).post('/auth').send(authCredentials);

		let response = await request (baseurl).patch('/partialUpdateOrder/90')
		.set('Content-Type', 'application/json')
		.set('Authorization', authResponse.body.token)
		.send({"tax_amt": 60.77, "total_amt": 25740.44});

		expect(response.statusCode).to.be.equal(404);
		expect(response.body.message).to.be.equal('No Order found with the given Order Id!');

	});

	it('should not update the partial order when authorization token is missing in the update request and return status code 403', async() => {

		let response = await request (baseurl).patch('/partialUpdateOrder/3').send({"user_id": 5});
		expect(response.statusCode).to.be.equal(403);
		expect(response.body.message).to.be.equal('Forbidden! Token is missing!');
	});
	
	it('should not update the partial order when authorization token is invalid and return status code 400', async() => {

		let response = await request (baseurl).patch('/partialUpdateOrder/3')
		.set('Content-Type', 'application/json')
		.set('Authorization', 'invalidtokenuyiy234sdf')
		.send({"total_amt": 25500.99});
		expect(response.statusCode).to.be.equal(400);
		expect(response.body.message).to.be.equal('Failed to authenticate token!');
	});

	it('should not update the partial order when no data is provided in the request body, and return status code 400', async() => {
		
		let authResponse = await request (baseurl).post('/auth').send(authCredentials);

		let response = await request (baseurl).patch('/partialUpdateOrder/3')
		.set('Content-Type', 'application/json')
		.set('Authorization', authResponse.body.token)
		.send({ });
		expect(response.statusCode).to.be.equal(400);
		expect(response.body.message).to.be.equal('Invalid request, no data provided to update!');
	});

	it('should delete an order with correct order id and valid token and return status code 204', async() => {
		
		let authResponse = await request (baseurl).post('/auth').send(authCredentials);

		let response = await request (baseurl).delete('/deleteOrder/4')
		.set('Authorization', authResponse.body.token);
		
		expect(response.statusCode).to.be.equal(204);
	});

	it('should not delete an order and return status code 403 when authorization token is missing in the header', async() => {

		let response = await request (baseurl).delete('/deleteOrder/2');

		expect(response.statusCode).to.be.equal(403);
		expect(response.body.message).to.be.equal('Forbidden! Token is missing!');

	});

	it('should not delete an order and return status code 400 when authorization token is in invalid format', async() => {

		let response = await request (baseurl).delete('/deleteOrder/2')
		.set('Authorization', 'invalidtokenuyiy234sdf')

		expect(response.statusCode).to.be.equal(400);
		expect(response.body.message).to.be.equal('Failed to authenticate token!');

	});

	it('should not delete an order and return status code 404 when no order is found for the order id', async() => {

		let authResponse = await request (baseurl).post('/auth').send(authCredentials);

		let response = await request (baseurl).delete('/deleteOrder/50')
		.set('Authorization', authResponse.body.token);

		expect(response.statusCode).to.be.equal(404);
		expect(response.body.message).to.be.equal('No Order found with the given Order Id!');
	});
});