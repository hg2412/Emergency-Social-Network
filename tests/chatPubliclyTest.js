var ChatPublicly = require('../models/chatMessage.js');
var app = require('../app.js');
var expect = require('expect.js');
var should = require('should');


describe('savePublicMessage',function(){
    describe('#savePublicChatMessage()',function(){
        it('should save without error',function(done){
            var date = new Date();
            var time = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + (date.getMinutes() < 10 ? ('0' + date.getMinutes()) : date.getMinutes()) ;
            //var time = ioBehavior.getTime();
            var Message = {
                user: 'hahaha',
                //receiver:'edian',
                text: 'test',
                time: time.toString(),
                messageStatus:'ok'
            };
            ChatPublicly.saveChatMessage(Message);
            var chatMessage = global.dbHandle.getModel("chatMessage");
            var query=chatMessage.findOne({'senderName': 'hahaha','message':'test','timestamp':time.toString()});
            query.exec(function(err, rs){
                if(err){
                    done(err);
                }
                else{
                    chatMessage.findOne(function(err, result){
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

describe('sendLatestMessages', function () {
    describe('#sendLatestMessages()', function (done) {
        before(function () {
            global.dbHandle.clearDB();
            var date = new Date();
            var time = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + (date.getMinutes() < 10 ? ('0' + date.getMinutes()) : date.getMinutes()) ;
            
            var chatMessage = global.dbHandle.getModel("chatMessage");
            var Message = {
                senderName: 'hahaha',
                //receiver:'edian',
                message: 'test',
                timestamp: time.toString(),
                status:'ok'
            };
            chatMessage.create(Message);
        });
        it ('respond with matching records', function(done) {
            
            	ChatPublicly.sendLatestMessages(0, function (rs) {
               // status.should.equal("help");
                expect(rs[0].senderName).to.eql('hahaha');
                done();
            });
        });
    });
});