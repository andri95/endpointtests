//Importing the application to test
let server = require('../index');
let mongoose = require("mongoose");
let Event = require('../models/event');
let Booking = require('../models/booking');

//These are the actual modules we use
let chai = require('chai');
let should = chai.should();
let chaiHttp = require('chai-http');
chai.use(chaiHttp);

describe('Endpoint tests', () => {
    //###########################
    //These variables contain the ids of the existing event/booking
    //That way, you can use them in your tests (e.g., to get all bookings for an event)
    //###########################
    let eventId = '';
    let bookingId = '';

    //###########################
    //The beforeEach function makes sure that before each test, 
    //there is exactly one event and one booking (for the existing event).
    //The ids of both are stored in eventId and bookingId
    //###########################
    beforeEach((done) => {
        let event = new Event({ name: "Test Event", capacity: 10, startDate: 1590840000000, endDate: 1590854400000});

        Event.deleteMany({}, (err) => {
            Booking.deleteMany({}, (err) => {
                event.save((err, ev) => {
                    let booking = new Booking({ eventId: ev._id, firstName: "Jane", lastName: "Doe", email: "jane@doe.com", spots: 2 });
                    booking.save((err, book) => {
                        eventId = ev._id;
                        bookingId = book._id;
                        done();
                    });
                });
            });
        });
    });

    //###########################
    //Write your tests below here
    //###########################

    // testing GET all events
    it('GET /events', (done) => {
        chai.request(server).get('/events').end((err, res) => {
                    console.log('Reaches this');
                    chai.expect(res).to.have.status(200);
                    console.log('Does not reach this');
                    chai.expect(res).to.be.a('object');
                    chai.expect(res).to.have.property('body');
                    chai.expect(res.body).to.be.a('array');
                    chai.expect(res.body.length).to.be.eql(1);
                    chai.expect(res.body[0]).to.be.a('object');
                    chai.expect(res.body[0]).to.have.property('_id');
                    chai.expect(res.body[0]).to.have.property('name');
                    chai.expect(res.body[0]).to.have.property('capacity');
                    chai.expect(res.body[0]).to.have.property('startDate');
                    chai.expect(res.body[0]).to.have.property('endDate');
                    done();
        });
    });

    it("should always pass", function() {
        console.log("Our event has id " + eventId);
        console.log("Our booking has id " + bookingId);
        chai.expect(1).to.equal(1);
    });
});