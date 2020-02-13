var expect  = require('chai').expect;
var request = require('request');

it('Main page content', function(done) {
    request('https://avanext.herokuapp.com/' , function(error, response, body) {
        expect(body).to.equal('{"title":"Avanext API","version":"1.0.0"}');
        done();
    });
});