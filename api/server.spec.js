const request = require('supertest');
const server = require('./server.js');

const Users = require('../auth/users-model.js');

const {test_count, incrementTestCount, testdata} = require('./testdata.js');
describe('server', function(){
    describe('/', function() {
        it('should return 200 OK', function() {
            return request(server)
                .get('/')
                .then(res => {
                    expect(res.status).toBe(200);
                })
        });
        it('should return api: up', function() {
            return request(server)
                .get('/')
                .then(res => {
                    expect(res.body.api).toBe("up");
                });
        });
    });
    describe('/api/auth', function() {
        describe('/register', function() {
            it('successful registration', function() {
                return request(server)
                    .post('/api/auth/register')
                    .send({username: `test ${test_count}`, password: testdata.password})
                    .then(async res => {
                        // should return the status 200
                        expect(res.status).toBe(200);

                        // should return the message - Registration Successfully
                        expect(res.body.message).toBe('Registration successful');

                        // should return the username
                        expect(res.body.username).toBe(`test ${test_count}`);

                        // should not return the password
                        expect(res.body.password).toBe(undefined);

                        // should add the user to the db
                        const username = res.body.username;
                        const dbCheck = await Users.findBy({username});
                        expect(dbCheck).toBeTruthy();
                    });
            });
            it('should return the error when username is missing', function() {
                return request(server)
                    .post('/api/auth/register')
                    .send({password: testdata.password})
                    .then(res => {
                        expect(res.body.message).toBe('Please provide username and password to register');
                    });
            });
            it('should return the error when password is missing', function() {
                return request(server)
                    .post('/api/auth/register')
                    .send({username: 'test'})
                    .then(res => {
                        expect(res.body.message).toBe('Please provide username and password to register');
                    });
            });
        });

        describe('/login', function() {
            it('successful login', function() {
                return request(server)
                    .post('/api/auth/login')
                    .send({username: `test ${test_count}`, password: testdata.password})
                    .then(async res => {
                        // should return the status 200
                        expect(res.status).toBe(200);

                        // should return the message - Login Successful
                        expect(res.body.message).toBe('Login Successful');

                        // should return the token
                        expect(res.body.token).toBeTruthy();
                    });
            });
            it('should return the error when username is missing', function() {
                return request(server)
                    .post('/api/auth/login')
                    .send({password: testdata.password})
                    .then(res => {
                        expect(res.body.message).toBe('Please provide username and password to login');
                    });
            });
            it('should return the error when password is missing', function() {
                return request(server)
                    .post('/api/auth/login')
                    .send({username: 'test'})
                    .then(res => {
                        expect(res.body.message).toBe('Please provide username and password to login');
                    });
            });
        });
        
    });


})