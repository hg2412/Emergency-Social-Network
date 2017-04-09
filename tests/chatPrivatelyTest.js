
var app = require('../app.js');
var privateChatMessage = require('../models/privateChatMessage.js');
var expect = require('expect.js');
var should = require('should');


describe('savePrivateMessage',function(){
	describe('#savePrivateChatMessage()',function(){
		it('should save without error',function(done){
			var date = new Date();
    		var time = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + (date.getMinutes() < 10 ? ('0' + date.getMinutes()) : date.getMinutes()) ;
			var message = {
                user: 'hahaha',
                receiver:'edian',
                text: 'test',
                time: time.toString(),
                messageStatus:'ok'
            };
            privateChatMessage.savePrivateChatMessage(message);
            var chatMessage = global.dbHandle.getModel("chatPrivately");
    		var query=chatMessage.findOne({'senderName': 'hahaha','message':'test','timestamp':time.toString()});
            query.exec(function(err, rs){
                if(err){
                    done(err);
                }
                else{
                    chatMessage.findOne(function(err, result){
                        //socket.emit("addLatestPrivateMessages", rs);
                        var receiver=result.receiverName;
                        expect(receiver).to.eql('edian');
                        done();
                    });
                }
            });
		});
	});
});

describe('sendLatestPrivateMessages', function () {
    describe('#sendLatestPrivateMessages', function (done) {
        before(function () {
            global.dbHandle.clearDB();
            var date = new Date();
            var time = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + (date.getMinutes() < 10 ? ('0' + date.getMinutes()) : date.getMinutes()) ;
            
            var chatPrivately = global.dbHandle.getModel("chatPrivately");
            var Message = {
                senderName: 'hahaha',
                receiverName:'edian',
                message: 'test',
                timestamp: time.toString(),
                status:'ok'
            };
            chatPrivately.create(Message);
        });
        it ('respond with matching records', function(done) {
            
            privateChatMessage.sendLatestPrivateMessages(0,'hahaha','edian', function (rs) {
               // status.should.equal("help");
                expect(rs[0].senderName).to.eql('hahaha');
                done();
            });
        });

    });
});