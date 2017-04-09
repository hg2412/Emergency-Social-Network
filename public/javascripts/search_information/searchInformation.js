var stop_words = ["a", "able", "about", "across", "after", "all", "almost", "also", "am", "among", "an", "and", "any", "are", "as", "at", "be", "because", "been", "but", "by", "can", "cannot", "could", "dear", "did", "do", "does", "either", "else", "ever", "every", "for", "from", "get", "got", "had", "has", "have", "he", "her", "hers", "him", "his", "how", "however", "i", "if", "in", "into", "is", "it", "its", "just", "least", "let", "like", "likely", "may", "me", "might", "most", "must", "my", "neither", "no", "nor", "not", "of", "off", "often", "on", "only", "or", "other", "our", "own", "rather", "said", "say", "says", "she", "should", "since", "so", "some", "than", "that", "the", "their", "them", "then", "there", "these", "they", "this", "tis", "to", "too", "twas", "us", "wants", "was", "we", "were", "what", "when", "where", "which", "while", "who", "whom", "why", "will", "with", "would", "yet", "you", "your"];
search_criteria_input = ' <label for="search_criteria">Search Criteria:</label><input  class="form-control" id="search_criteria_input">';
search_criteria_select = '<label for="search_criteria">Search Criteria:</label><select class="form-control" class="form-control"id="search_criteria_sel"><option>ok</option><option>help</option> <option>emergency</option></select>';
pager_text = '<ul class="pager"> <li class="previous"><a>Previous</a></li> <li id="result"></li> <li class="next"><a>Next</a></li> </ul>';

var current_page = 0;
var total_page = 0;
var item_per_page = 10;
var data = [];
remove_stop_word = function (sc) {
    var words = sc.split(" ");
    var result = [];
    for (var i = 0; i < words.length; i++) {
        console.log(words[i]);
        if (stop_words.indexOf(words[i]) < 0) {
            result.push(words[i]);
        } else {
            alert(words[i] + " is a stop word!");
        }
    }
    return result;
};

render_search_message_items = function (data, cur_page, context) {
    $('#search_results_list').text('');
    if (context == "Public Announcements") {
        for (var i1 = current_page * 10; i1 < Math.min(data.length, current_page * 10 + 10); i1++) {
            msg = data[i1];
            var template_announcement = '<a href="#" class="list-group-item list-group-item-action"><h5 class="list-group-item-heading">HEADING</h5><p class="list-group-item-text">TEXT</p></a>';
            template_announcement = template_announcement.replace("HEADING", msg.username + " Time:" + msg.timestamp);
            template_announcement = template_announcement.replace("TEXT", 'Content: ' + msg.content);
            $('#search_results_list').append(template_announcement);
        }
    } else if (context == "Private Messages") {
        for (var i2 = current_page * 10; i2 < Math.min(data.length, current_page * 10 + 10); i2++) {
            msg = data[i2];
            var template_private_msg = '<a href="#" class="list-group-item list-group-item-action"><h5 class="list-group-item-heading">HEADING</h5><p class="list-group-item-text">TEXT</p></a>';
            template_private_msg = template_private_msg.replace("HEADING", "From: " + msg.senderName + " To: " + msg.receiverName + "<br>Time: " + msg.timestamp);
            template_private_msg = template_private_msg.replace("TEXT", 'Content: ' + msg.message);
            $('#search_results_list').append(template_private_msg);
        }
    } else if (context == "Public Messages") {
        for (var i3 = current_page * 10; i3 < Math.min(data.length, current_page * 10 + 10); i3++) {
            msg = data[i3];
            var template_public_msg = '<a href="#" class="list-group-item list-group-item-action"><h5 class="list-group-item-heading">HEADING</h5><p class="list-group-item-text">TEXT</p></a>';
            template_public_msg = template_public_msg.replace("HEADING", msg.senderName + "<br> Time:" + msg.timestamp);
            template_public_msg = template_public_msg.replace("TEXT", 'Content: ' + msg.message);
            $('#search_results_list').append(template_public_msg);
        }
    }
    $('.pager #result').text((current_page + 1) + '/' + total_page + ' pages');
};

render_search_user_items = function (data, cur_page) {
    $('#search_results_list').text('');
    for (var i4 = current_page * 10; i4 < Math.min(data.length, current_page * 10 + 10); i4++) {
        user = data[i4];
        var template = '<a href="#" class="list-group-item list-group-item-action"><h5 class="list-group-item-heading">HEADING</h5><p class="list-group-item-text">TEXT</p></a>';
        template = template.replace("HEADING", user.username);
        template = template.replace("TEXT", 'Status: ' + user.status);
        $('#search_results_list').append(template);
    }
    $('.pager #result').text((current_page + 1) + '/' + total_page + ' pages');
};


render_search_result = function (data, type, context) {
    $('#search_result_container').show();
    if (data.length < 1) {
        alert('Sorry! No search result returned!');
    }
    total_page = Math.ceil(data.length * 1.00 / item_per_page);
    current_page = 0;
    if (type == "user") {
        // show previous and next
        $('li.previous').on('click', function (e) {
            if (current_page <= 0) current_page += 0;
            else {
                current_page--;
                render_search_user_items(data, current_page, context);
            }
        });

        $('li.next').on('click', function (e) {
            if (current_page >= total_page - 1) current_page += 0;
            else {
                current_page++;
                render_search_user_items(data, current_page, context);
            }
        });
        render_search_user_items(data, 0);
    } else if (type == "message") {
        // show previous and next
        $('li.previous').on('click', function (e) {
            if (current_page <= 0) current_page += 0;
            else {
                current_page--;
                render_search_message_items(data, current_page, context);
            }
        });

        $('li.next').on('click', function (e) {
            if (current_page >= total_page - 1) current_page += 0;
            else {
                current_page++;
                render_search_message_items(data, current_page, context);
            }
        });
        render_search_message_items(data, 0, context);
    }
};

attachClick = function () {
    $("#search_btn").click(function () {
        $('#pager_container').text("");
        $('#pager_container').append(pager_text);
        var search_context = "";
        $("#sel1 option:selected").each(function () {
            search_context = $(this).text();
            var search_criterion = "";
            if (search_context == "Citizens by Status") {
                $("#sel1 option:selected").each(function () {
                    search_criterion = $("#search_criteria_sel option:selected").text();
                    $.get("/search/citizenByStatus", {status: search_criterion}, function (users) {
                        data = users.usersOnline;
                        data = data.concat(users.usersOffline);
                        render_search_result(data, 'user', "Citizens by Status");
                    });
                });
            } else if (search_context == "Citizens by Name") {
                $("#sel1 option:selected").each(function () {
                    search_criterion = $('#search_criteria_input').val();
                    $.get("/search/citizenByUsername", {username: search_criterion}, function (users) {
                        data = users.usersOnline;
                        data = data.concat(users.usersOffline);
                        render_search_result(data, 'user', "Citizens by Name");
                    });
                });
            }
            else if (search_context == "Public Messages") {
                search_criterion = $('#search_criteria_input').val();
                search_criterion = remove_stop_word(search_criterion);
                $.get("/search/publicMessages", {words: search_criterion}, function (msg) {
                    data = msg.publicMessages;
                    render_search_result(data, 'message', "Public Messages");
                });


            } else if (search_context == "Public Announcements") {
                search_criterion = $('#search_criteria_input').val();
                search_criterion = remove_stop_word(search_criterion);
                $.get("/search/announcement", {words: search_criterion}, function (msg) {
                    data = msg.announcements;
                    render_search_result(data, 'message', "Public Announcements");
                });

            } else if (search_context == "Private Messages") {
                search_criterion = $('#search_criteria_input').val();
                search_criterion = remove_stop_word(search_criterion);
                $.get("/search/privateMessages", {words: search_criterion}, function (msg) {
                    data = msg.privateMessages;
                    render_search_result(data, 'message', "Private Messages");
                });
            }
            else {

            }
        });

    });
};

$( document ).ready(function() {
    $("#search_criteria_div").text("");
    $("#search_criteria_div").append(search_criteria_input);
    $('#search_criteria_div').append('<br><button type="button" class="btn btn-primary" id= "search_btn">Search</button>');
    attachClick();
});

$("#sel1")
    .change(function () {
        var str = "";
        $("#sel1 option:selected").each(function () {
            str = $(this).text();
        });
        switch (str) {
            case 'Citizens by Status':
                $("#search_criteria_div").text("");
                $("#search_criteria_div").append(search_criteria_select);
                $('#search_criteria_div').append('<br><button type="button" class="btn btn-primary" id= "search_btn">Search</button>');
                attachClick();
                break;
            default:
                $("#search_criteria_div").text("");
                $("#search_criteria_div").append(search_criteria_input);
                $('#search_criteria_div').append('<br><button type="button" class="btn btn-primary" id= "search_btn">Search</button>');
                attachClick();

                break;
        }
    });

