function display(msg_list, announcement){
	var username = announcement.username;
	var content = announcement.content.replace(new RegExp("\n", "gm"), "<br>");
	var time = announcement.timestamp;
	msg_list.append(
		'<li class="mar-btm">'+
         	'<div class="media-left"></div>'+
            '<div class="media-body pad-hor">'+
                '<div class="speech">'+
                    '<a href="#" class="media-heading">'+username+'</a>'+
                    '<p>'+content+'</p>'+
                    '<p class="speech-time">'+
                        '<i class="fa fa-clock-o fa-fw"></i>'+time+
                    '</p>'+
                '</div>'+
            '</div>'+
        '</li>');
}

function getLatest(){
    $.get('announce/latest', function(rs){
        if(rs.status){
            if(rs.status=="privilege"){
                alert('Low privilege!');
            }
        }
        else if(rs.announcement){
            var msg_list = $("#msg-list"); 
            var announcement = rs.announcement;
            for(var i = announcement.length-1; i >= 0; i--){
                display(msg_list, announcement[i]);
                $('.nano>.nano-content').scrollTop($('.nano>.nano-content').get(0).scrollHeight);
            }
        }
    });
}

$("#postButton").click(function(){
	var username = $("#username").html();
	var newAnnouncement = $("#newAnnouncement").val();
	var data = {"username": username, "newAnnouncement": newAnnouncement};
	$.post('/announce/post', data, function(rs) {
        if(rs.status){
            if(rs.status=="privilege"){
                alert('Low privilege!');
            }
        }
        else{
    		var msg_list = $("#msg-list"); 
            display(msg_list, rs.announcement);
            $('.nano>.nano-content').scrollTop($('.nano>.nano-content').get(0).scrollHeight);
        }
    });

});

getLatest();