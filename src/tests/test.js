const expect  = require('chai').expect;
const request = require('request');

let token;
let userId;

describe('User', function() {

    describe('Authenticate', function() {

        it('User not found', function(done) {
            request.post('https://avanext.herokuapp.com/users/authenticate', {
                json: {
                    "cpf": "11111111111",
                    "password": "11111111111"
                }
            }, (error, response, body) => {
                expect(response.statusCode).to.equal(404);
                done();
            });
        });

        it('User not authenticated', function(done) {
            request.post('https://avanext.herokuapp.com/users/authenticate', {
                json: {
                    "cpf": "00000000000",
                    "password": "11111111111"
                }
            }, (error, response, body) => {
                expect(response.statusCode).to.equal(400);
                done();
            });
        });

        it('User authenticated', function(done) {
            request.post('https://avanext.herokuapp.com/users/authenticate', {
                json: {
                    "cpf": "00000000000",
                    "password": "00000000000"
                }
            }, (error, response, body) => {
                expect(response.statusCode).to.equal(201);
                token = response.body.token;
                userId = response.body.data.id;
                done();
            });
        });
    });

    describe('Create', function() {

        it('Create if CPF not exists', function(done) {
            this.timeout(5000);
            const cpf = "00000000003";
            request.get(`https://avanext.herokuapp.com/users/cpf/${cpf}`, (error, response, body) => {
                expect(error).to.equal(null);
                const json = {
                    "name": "Create if CPF not exists",
                    "cpf": cpf,
                    "email": "mateus.tofanello@outlook.com",
                    "password": "password"
                }
                if (response.statusCode === 200) {
                    request.post('https://avanext.herokuapp.com/users', {
                        json: json
                    }, (error, response, body) => {
                        expect(response.statusCode).to.equal(400);
                        done();
                    });
                } else if (response.statusCode === 404) {
                    request.post('https://avanext.herokuapp.com/users', {
                        json: json
                    }, (error, response, body) => {
                        expect(response.statusCode).to.equal(201);
                        done();
                    });
                }
            });
        });
    });
});

describe('Transaction', function() {
    
    describe('Transfer', function() {

        it('Transfer created', function(done) {
            request.post('https://avanext.herokuapp.com/transactions/transfer', {
                'headers': {
                    'x-access-token': token
                },
                json: {
                    "accountNumber": "00000001",
                    "bankCode": "100",
                    "transferValue": 1,
                    "agency":"0001",
                    "userName": "Mateus",
                    "cpf": "12345678901",
                    "transferType": 0,
                    "description": "Teste unitário",
                    "userId": userId
                }
            }, (error, response, body) => {
                expect(response.statusCode).to.equal(201);
                done();
            }); 
        });
    });
});