/**
 * Created by yiting on 10/12/16.
 *
 * @jsx React.DOM
 */

var socket = io();

socket.on("connect",function(){
    var username=$("#username_div").text();
    console.log("usernamehere2:"+username);
    socket.emit("setUsername",username);
});
var talker=$("#receiver_div").text();

var Image = React.createClass({
    render() {
        if (this.props.status === "ok") {
            return (
                <img src="/images/OK.png" />
            );
        } else if (this.props.status === "help") {
            return (
                <img src = "/images/Help.png"/>
            );
        } else if (this.props.status === "emergency") {
            return (
                <img src="/images/Emergency.png"/>
            );
        } else {
            return null;
        }
    }
});

var Message = React.createClass({
    render() {
        if (this.props.sendByMe) {
            return (
                <li className="mar-btm">
                    <div className="media-right"></div>
                    <div className="media-body pad-hor speech-right">
                        <div className="speech">
                            <a href="#" className="media-heading">{this.props.user}</a>
                            <p>{this.props.text}</p>
                            <p className="speech-time">
                                <i className="fa fa-clock-o fa-fw"></i>{this.props.time}
                            </p>
                            <Image
                                status = {this.props.status}
                            />
                        </div>
                    </div>
                </li>
            );

        } else {
            return (
                <li className="mar-btm">
                    <div className="media-left"></div>
                    <div className="media-body pad-hor">
                        <div className="speech">
                            <a href="#" className="media-heading">{this.props.user}</a>
                            <p>{this.props.text}</p>
                            <p className="speech-time">
                                <i className="fa fa-clock-o fa-fw"></i>{this.props.time}
                            </p>
                            <Image
                                status = {this.props.status}
                            />
                        </div>
                    </div>
                </li>
            );

        }
    }

});

var MessageList = React.createClass({
    render() {
        return (
            <ul className="list-unstyled media-block">
                {
                    this.props.messages.map((message, i) => {
                        return (
                            <Message
                                key={i}
                                user={message.user}
                                receiver={message.receiver}
                                //receiver = {"edian"}
                                text={message.text}
                                sendByMe={message.user === this.props.currentUser}
                               // ifAlert={message.user===this.props.currentUser || message.user===this.props.receiver}
                                time={message.time}
                                status={message.messageStatus}
                            />
                        )
                    })
                }
            </ul>
        );
    }
});

var MessageForm = React.createClass({
    getInitialState() {
        //return {text: ''}
        var username;
        username = $("#username_div").text();
        var receivername = $("#receiver_div").text();
        talker = receivername;
        console.log("username:" + username);
        console.log("receiver:" + receivername);
        var status = $("#user-status").text();
       // return {userStatus: status, text: ''}
        console.log("status" + status);
        return {user: username, receiver: receivername, userStatus: status,messages:[], text: ''}
    },

    handleSubmit(e) {
        e.preventDefault();
        var message = {
            user: this.state.user,

            receiver: this.state.receiver,
            //receiver:this.state.receiver,
            text: this.state.text,
            time: this.props.time,
            messageStatus: this.state.userStatus
        };
        console.log("Message" + message);
        console.log("Message:" + message.receiver);
        console.log("statushere" + message.messageStatus);
        this.props.onMessageSubmit(message);
        this.setState({text: ''});
    },

    _handleKeyPress: function(e) {
        if (e.key === 'Enter') {
            this.handleSubmit(e);
        }
    },

    changeHandler(e) {
        this.setState({text: e.target.value});
    },

    render() {
        return(
            <div className="row">
                <div className="col-xs-9">
                    <input type="text" onChange={this.changeHandler} onKeyPress={this._handleKeyPress} placeholder="Enter your text" value={this.state.text} className="form-control"/>
                </div>
                <div className="col-xs-3">
                    <button className="btn btn-primary btn-block" type="submit" onClick={this.handleSubmit}>Send</button>
                </div>
            </div>
        );
    }
});

var MessagePagelet = React.createClass({
    getInitialState() {
        var username;
        username = $("#username_div").text();
        var receivername = $("#receiver_div").text();
        talker = receivername;
        console.log("username:" + username);
        console.log("receiver:" + receivername);
        var status = $("#user-status").text();
        return {user: username, receiver: receivername,userStatus: status, messages:[], text: ''}
    },

    componentDidMount() {
        // TO-DO: get current user
        
        // getOldMessages
        console.log("this.props.receiver" + this.state.receiver);
        console.log("this.props.user" + this.state.user);
        socket.emit("getLatestPrivateMessages",0,this.state.user,this.state.receiver);
       // socket.emit("getLatestPrivateMessages",0,"hahaha","edian");
        socket.on("addLatestPrivateMessages", this._addLatestMessages);
        socket.on("addPrivateMessage", this._addPrivateMessage);
        socket.on("addPrivateMyMessage", this._addPrivateMyMessage);
    },

    componentWillUpdate: function() {
        var node = ReactDOM.findDOMNode(this.refs.scrollView);
        this.shouldScrollBottom = node.scrollTop + node.offsetHeight === node.scrollHeight;
    },

    componentDidUpdate: function() {
        if (this.shouldScrollBottom) {
            var node = ReactDOM.findDOMNode(this.refs.scrollView);
            node.scrollTop = node.scrollHeight;
        }

    },

    _addLatestMessages(data) {
        var {messages} = this.state;
        data.forEach(message => {
            messages.unshift({
                user: message.senderName,
                receiver:message.receiverName,
                text: message.message,
                time: message.timestamp,
                messageStatus: message.status
            });
        });
        this.setState({messages});
    },

    _addPrivateMessage(message) {
        console.log("talker" +talker);
        console.log("message.senderName" +message.user);
        console.log("message.status" +message.messageStatus);
        if (talker === message.user ) {
            var {messages} = this.state;
            messages.push(message);
            this.setState({messages});
        }
        else{
            message.text = "alert you have receive a data from :"+message.user;
            var {messages} = this.state;
            messages.push(message);
            this.setState({messages});
        }
    },

    _addPrivateMyMessage(message) {

        var {messages} = this.state;
        messages.push(message);
        this.setState({messages});
    },
    handleMessageSubmit(message) {
        socket.emit('sendPrivateMessage', message);
        var node = ReactDOM.findDOMNode(this.refs.scrollView);
        node.scrollTop = node.scrollHeight;
    },

    onScroll() {
        var node = ReactDOM.findDOMNode(this.refs.scrollView);
        var {messages} = this.state;
        if (node.scrollTop == 0) {
            socket.emit("getLatestPrivateMessages", messages.length,this.props.user,this.props.receiver);
        }
    },

    render() {
        return (
            <div style={{height: '75vh'}}>
                <div className="nano has-scrollbar">
                    <div className="nano-content pad-all" ref="scrollView" onScroll={this.onScroll} tabIndex="0">

                        <MessageList
                            messages = {this.state.messages}
                            currentUser = {this.state.user}
                        />
                    </div>
                    <div className="nano-pane">
                        <div className="nano-slider" style={{height: '141px', transform: 'translate(0px, 0px)'}}></div>
                    </div>
                </div>
                <div className="panel-footer">
                    <MessageForm
                        onMessageSubmit = {this.handleMessageSubmit}
                        user = {this.state.user}
                    />
                </div>
            </div>
        );
    }
});

ReactDOM.render(<MessagePagelet/>, document.getElementById("chat-area"));
