import request from 'supertest';
import orders from '../testdata/neworders.json' with { type: "json" };
import orderObject from '../testdata/neworder_only_object.json' with { type: "json" }
import missingFieldsOrder from '../testdata/neworder_field_missing.json' with { type: "json" }
import {expect} from 'chai';


describe('Unit Tests of E-Commerce application', () => {
	const baseurl = 'http://localhost:3004';

	it('should show 404 status code as no order exists', async() => {
		let response = await request(baseurl).get('/getAllOrders').send(orderObject);
		expect(response.statusCode).to.be.equal(404)
		expect(response.body.message).to.be.equal('No Order found!!');

	});

	it('should show 400 status code for invalid order format', async() => {

		let response = await request(baseurl).post('/addOrder').send(orderObject);
		expect(response.statusCode).to.be.equal(400)
		expect(response.body.message).to.be.equal('Request Payload must be an array of orders!');
		 
	});

	it('should show 400 status code with message for fields missing in order', async() => {

		let response = await request(baseurl).post('/addOrder').send(missingFieldsOrder);
		expect(response.statusCode).to.be.equal(400)
		expect(response.body.message).to.be.equal('Each order must have user_id, product_id, product_name, product_amount, qty, tax_amt, and total_amt!');
	});

	it('should create orders with 201 status code', async() => {

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

	it('should get all available orders successfully with 200 status', async() => {
	
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

	it('should filter and fetch order on user_id', async() => {
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
	

});
