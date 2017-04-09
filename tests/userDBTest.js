var app = require('../app.js');
var userDB = require('../models/user.js');
var expect = require('expect.js');
var should = require('should');


describe('createNewUser',function(){
    describe('#createNewUser()',function(){
        it('should create without error',function(done){
            userDB.createNewUser("neolicdtest1", "1234", "undefined", function() {
                userDB.getUser("neolicdtest1", function(user) {
                    expect(user.username).to.equal("neolicdtest1");
                    done();
                });
            });
        });
    });


    describe('#updateUserName()',function(){
        it('should update without error',function(done){
            userDB.createNewUser("neolicdtest2", "1234", "undefined", function() {
                userDB.updateUserName("neolicdtest2", "updatedOne", function() {
                    userDB.getUser("updatedOne", function(user) {
                        expect(user.username).to.equal("updatedOne");
                        done();
                    });                    
                });
            });
        });
    });


    describe('#updateUserName()',function(){
        it('should update without error',function(done){
            userDB.createNewUser("neolicdtest3", "1234", "undefined", function() {
                userDB.updatePwd("neolicdtest3", "newpass", function() {
                    userDB.getUser("neolicdtest3", function(user) {
                        expect(user.password).to.equal("newpass");
                        done();
                    });                    
                });
            });
        });
    });
});
