import request from 'supertest';
import orders from '../testdata/neworders.json' with {type:"json"};
import {expect} from 'chai';


describe('Post API tests using supertest', () => {
	const baseurl = 'http://localhost:3004';
	it('should successfully pass the test for post api', async() => {

		let response = await request(baseurl).post('/addOrder').send(orders);
		expect(response.statusCode).to.be.equal(201)
		expect(response.body.orders[0].id).not.to.be.null;
		expect(response.body.orders[1].product_name).to.be.equal('iPad')
    
	});
});
