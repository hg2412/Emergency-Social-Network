var app = require('../app.js');
var userRole = require('../models/userRole.js');
var expect = require('expect.js');
var should = require('should');


describe('createNewUserRole',function(){
    describe('#createNewUserRole()',function(){
        it('should create without error',function(done){
            userRole.createNewUser("neolicdtest1", "citizen", "active", function() {
                userRole.getUser("neolicdtest1", function(user) {
                    expect(user.accountStatus).to.equal("active");
                    done();
                });
            });
        });
    });

    describe('#updateUserName()',function(){
        it('should update without error',function(done){
            userRole.createNewUser("neolicdtest2", "citizen", "active", function() {
                userRole.updateUserName("neolicdtest2", "updatedUserName", function() {
                    userRole.getUser("updatedUserName", function(user) {
                        expect(user.username).to.equal("updatedUserName");
                        done();
                    });                    
                })
            });
        });
    });
    describe('#updateAccountStatus()',function(){
        it('should update without error',function(done){
            userRole.createNewUser("neolicdtest3", "citizen", "active", function() {
                userRole.updateAccountStatus("neolicdtest3", "inactive", function() {
                    userRole.getUser("neolicdtest3", function(user) {
                        expect(user.accountStatus).to.equal("inactive");
                        done();
                    });                    
                })
            });
        });
    });

    describe('#updatePrivilege()',function(){
        it('should update without error',function(done){
            userRole.createNewUser("neolicdtest4", "citizen", "active", function() {
                userRole.updatePrivilege("neolicdtest4", "administrator", function() {
                    userRole.getUser("neolicdtest4", function(user) {
                        expect(user.privilege).to.equal("administrator");
                        done();
                    });                    
                })
            });
        });
    });
});
