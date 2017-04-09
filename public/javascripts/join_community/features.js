var reserveWord = /(^about|access|account|accounts|add|address|adm|admin|administration|adult|advertising|affiliate|affiliates|ajax|analytics|android|anon|anonymous|api|app|apps|archive|atom|auth|authentication|avatar|banners|bin|billing|blog|blogs|board|bot|bots|business|chat|cache|cadastro|calendar|campaign|careers|cgi|client|cliente|code|comercial|compare|config|connect|contact|contest|create|code|compras|css|dashboard|data|db|design|delete|demo|design|designer|dev|devel|dir|directory|doc|docs|domain|download|downloads|edit|editor|email|ecommerce|forum|forums|faq|favorite|feed|feedback|flog|follow|file|files|free|ftp|gadget|gadgets|games|guest|group|groups|help|home|homepage|host|hosting|hostname|html|http|httpd|https|hpg|info|information|image|img|images|imap|index|invite|intranet|indice|ipad|iphone|irc|java|javascript|job|jobs|js|knowledgebase|log|login|logs|logout|list|lists|mail|mail1|mail2|mail3|mail4|mail5|mailer|mailing|mx|manager|marketing|master|me|media|message|microblog|microblogs|mine|mp3|msg|msn|mysql|messenger|mob|mobile|movie|movies|music|musicas|my|name|named|net|network|new|news|newsletter|nick|nickname|notes|noticias|ns|ns1|ns2|ns3|ns4|old|online|operator|order|orders|page|pager|pages|panel|password|perl|pic|pics|photo|photos|photoalbum|php|plugin|plugins|pop|pop3|post|postmaster|postfix|posts|profile|project|projects|promo|pub|public|python|random|register|registration|root|ruby|rss|sale|sales|sample|samples|script|scripts|secure|send|service|shop|sql|signup|signin|search|security|settings|setting|setup|site|sites|sitemap|smtp|soporte|ssh|stage|staging|start|subscribe|subdomain|suporte|support|stat|static|stats|status|store|stores|system|tablet|tablets|tech|telnet|test|test1|test2|test3|teste|tests|theme|themes|tmp|todo|task|tasks|tools|tv|talk|update|upload|url|user|username|usuario|usage|vendas|video|videos|visitor|win|ww|www|www1|www2|www3|www4|www5|www6|www7|wwww|wws|wwws|web|webmail|website|websites|webmaster|workshop|xxx|xpg|you|yourname|yourusername|yoursite|yourdomain)$/;
if (typeof(global) === 'undefined')
{
    global = {};
}
global.socket = global.socket || io.connect();

formatTR = function(online, username, status) {
    return '<tr><td>'+online+'</td><td>'+'<a href="'+ '/chatPrivately/' + username +'">'+username+'</a></td><td>'+status+'</td></tr>';
};

hideAll = function() {
    $('#signup_page').hide();
    $('#confirm_register').hide();
    $('#register_div').hide();
    $('#directory').hide();
    $('#chat_publicly_btn').hide();
};

showPage = function(pageId) {
    $('#' + pageId).show();
};

hideAll();

// when click join community button, show the signup page
$('#join_community').bind('click', function() {
    $('#join_community').hide();
    $('#signup_page').show();
});


// when click submit button, submit the username and password
$('#submit').bind('click', function() {
    
    var username = $('#user_name').val();
    uname = username;
    var pass = $('#password').val();
    // check if the pattern of username is valid
    if (username.length < 3) {
        alert('username must be at least 3 characters!');
        return false;
    } else if (username.match(reserveWord)) {
        alert('sorry, it\'s a reserved word, please change another one.');
        return false;
    } else if (pass.length < 4) {
        alert('password must be at least 4 characters!');
        return false;
    }
    // encrypt the password field using SHA256
    var hashedpass = CryptoJS.SHA256(pass).toString(CryptoJS.enc.Hex);
    // socket.emit('user_pass', {user: $('#user_name').val(), pass:hashedpass});
    var user_pass = {
        'username': username,
        'password': pass
    };
    $.post('/login', user_pass, function(rs){
        console.log("rs.status"+rs.status);
        if (rs.status=='inactive') {
            alert("Inactive User!");
        }
        else if (rs.status == 'new_user') { // go to confirm page "Do you want to register?"
            $('#signup_page').hide();
            $('#confirm_register').show();
            $('#register_div').show();
        } else if (rs.status == 'login') { // directly go to the directory page
            global.socket.emit('add_user_name', username);
            $('#signup_page').hide();
            $('#directory').show();
            $('#chat_publicly_btn').show();
        } else { // user already exists, get an alert
            alert('this user name already exists, plsease change another one');
        }
    });
    return false;
});

$('#yes').click(function() {
    var username = $('#user_name').val();
    uname = username;
    var pass = $('#password').val();
    var hashedpass = CryptoJS.SHA256(pass).toString(CryptoJS.enc.Hex);
    var user_pass = {
        'username': username,
        'password': pass
    };
    $.post('/register', user_pass, function(rs) { 
        global.socket.emit('add_user_name', username);
        $('#register_div').hide();
        $('#directory').show();
        $('#chat_publicly_btn').show();
        $('#welcome_modal').modal('show');
    });
});

$('#logout').click(function(){
    location.href = "logout";
    global.socket.emit('leave');
    // Do something on client side
    $('#directory').hide();
    $('#join_community').show();
});

$('#directory').click(function() {
    global.socket.emit('load_directory');
});

$('#directory_navi_bar').click(function() {
    global.socket.emit('load_directory');
});

global.socket.on("connect",function(){
    $.getJSON('/user').done(function(data){
        console.log("usernamehere3:"+data.username);
        global.socket.emit("setUsername",data.username);
    });
   // console.log("usernamehere2:"+username);
    //global.socket.emit("setUsername",username);
});
global.socket.on('user_directory', function(userDir) {
    $('#directory_content').html('');
    var n = userDir.length;
    userDir.sort(function(client1, client2) {
        if (client1.online && client2.online) {
            return client1.username.localeCompare(client2.username);
        } else if (!(client1.online || client2.online)) {
            return (client1.username).localeCompare(client2.username);
        } else if (client1.online) {
            return 1;
        } else if (client2.online){
            return -1;
        }
        return 0;
    });
    for (var i = 0; i < n; i++) {
        $('#directory_content').append(formatTR(userDir[i].online ? "Y" : "N", userDir[i].username, userDir[i].status));
    }
});

global.socket.on('addPrivateMessage',function(message){
    alert("you have a message from "+message.user+" at "+message.time+":\n"+message.text);
});