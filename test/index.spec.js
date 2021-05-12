const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../index');
const projects = Array.from(require('../data-store'));
const Promise = require('bluebird');
const should = chai.should();

chai.use(chaiHttp);

describe('http_server_intermediate', () => {

    it('Should return 404 for an invalid route', (done) => {
        chai.request(server)
            .get('/')
            .then(response => {
                response.status.should.eql(404);
                done()
            })
    });

    it('Should return a 400 if the project id sent in body already exists', done => {
        chai.request(server)
            .post('/projects')
            .type('application/json')
            .send({
                id: 1,
                name: 'Alicia in Wonderland'
            })
            .then(response => {
                response.status.should.eql(400);
                response.should.have.header('content-type', 'application/json');
                response.should.be.json;
                response.body.message.should.eql('BAD REQUEST');
                done()
            })
    });

    it('Should return a 400 if post data is not a valid JSON', done => {
        chai.request(server)
            .post('/projects')
            .set('content-type', 'application/json')
            .send("DUMMY_DATA")
            .then(response => {
                response.status.should.eql(400);
                response.should.have.header('content-type', 'application/json');
                response.should.be.json;
                response.body.message.should.eql('BAD REQUEST');
                done()
            })
    });

    it('Should respond with the correct data for GET /projects', (done) => {
        chai.request(server)
            .get('/projects')
            .then(response => {
                response.status.should.eql(200);
                response.should.have.header('content-type', 'application/json');
                response.body.should.eql(projects);
                done()
            })
    });

    it('Should update and send the updated data after a valid POST /projects request', done => {
        const newProject = {
            id : 5,
            name : "DUMMY_PROJECT"
        };
        chai.request(server)
            .post('/projects')
            .set('content-type', 'application/json')
            .send(newProject)
            .then(response => {
                response.status.should.eql(201);
                response.should.have.header('content-type', 'application/json');
                response.body.should.eql([...projects, newProject]);
                done()
            })
    });

    it('Should respond with the correct data for GET /projects after a valid POST /projects', (done) => {
        const agent = chai.request.agent(server);

        const newProject = {
            id : 5,
            name : "DUMMY_PROJECT"
        };
        agent
            .post('/projects')
            .set('content-type', 'application/json')
            .send(newProject)
            .then(() => {
                return agent.get('/projects')
            })
            .then(response => {
                response.status.should.eql(200);
                response.should.have.header('content-type', 'application/json');
                response.body.should.eql([...projects, newProject]);
                agent.close();
                done()
            })
    });

    it('Should respond with a 404 for an invalid Projects route', (done) => {
        chai.request(server)
            .get('/projects/abc')
            .then(response => {
                response.status.should.eql(404);
                done()
            })
    })

});
