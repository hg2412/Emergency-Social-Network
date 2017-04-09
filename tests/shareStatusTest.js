var shareStatus = require('../models/user.js');
var app = require('../app');
var should = require('should');
var expect = require('expect.js');

describe('setUserStatus',function(){
    describe('#setUserStatus()',function(){
        before(function () {
            global.dbHandle.clearDB();
            var u = {
                "username": "hehehe",
                "password": "666666",
                "status": "help"
            };
            var User2 = global.dbHandle.getModel('user');
            var second = function() {
                console.log("second");
                shareStatus.setUserStatus("hehehe","ok");
            }
            var first = function(second) {
                User2.create(u, second);
                console.log('first');
                // callback();
            }
            first(second);
            
        });
        it('should save without error',function(done){
            var User = global.dbHandle.getModel('user');
            var query=User.findOne({'username': 'hehehe'});
            query.exec(function(err, rs){
                if(err){
                    done(err);
                }
                else{
                    User.findOne(function(err, result){
                        //socket.emit("addLatestPrivateMessages", rs);
                        var status=result.status;
                        expect(status).to.eql('ok');
                        done();
                    });
                }
            });
        });
    });
});


describe('Status', function () {
    describe('#find()', function (done) {
        before(function () {
            global.dbHandle.clearDB();
            var User = global.dbHandle.getModel('user');
            var u = {
                "username": "Joyce",
                "password": "666666",
                "status": "help"
            };
            User.create(u);
        });
        it ('respond with matching records', function(done) {
           // shareStatus.setUserStatus("Joyce", "help");
            shareStatus.getUserStatus("Joyce", function (status) {
                status.should.equal("help");
                done();
            });
        });

    });
});
