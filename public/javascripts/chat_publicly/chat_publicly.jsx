/**
 * Created by yifanli on 10/3/16.
 *
 * @jsx React.DOM
 */
var socket = io();
socket.on("connect",function(){
    var username=$("#username_div").text();
    console.log("usernamehere2:"+username);
    socket.emit("setUsername",username);
});
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
                                text={message.text}
                                sendByMe={message.user === this.props.currentUser}
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
        var status = $("#user-status").text();
        return {userStatus: status, text: ''}
    },

    handleSubmit(e) {
        e.preventDefault();
        var message = {
            user: this.props.user,
            text: this.state.text,
            time: this.props.time,
            messageStatus: this.state.userStatus
        };
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
        var username = $("#username_div").text();
        console.log("username:" + username);
        return {user: username , messages:[], text: ''}
    },

    componentDidMount() {
        // TO-DO: get current user
        
        // getOldMessages
        socket.emit("getLatestMessages", 0);
        socket.on("addLatestMessages", this._addLatestMessages);
        socket.on("addPublicMessage", this._addPublicMessage);
        socket.on("addPrivateMessage", this._addPrivateMessage);
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
                text: message.message,
                time: message.timestamp,
                messageStatus: message.status
            });
        });
        this.setState({messages});
    },

    _addPrivateMessage(message) {
            message.text = "alert you have receive a private message from :"+message.user;
            var {messages} = this.state;
            var messagenow = {
                user: message.user,
                text: message.text,
                time: message.time,
                messageStatus: message.status
            };
            messages.push(messagenow);
            this.setState({messages});
    },
    _addPublicMessage(message) {
        var {messages} = this.state;
        messages.push(message);
        this.setState({messages});
    },

    handleMessageSubmit(message) {
        socket.emit('sendPublicMessage', message);
        var node = ReactDOM.findDOMNode(this.refs.scrollView);
        node.scrollTop = node.scrollHeight;
    },

    onScroll() {
        var node = ReactDOM.findDOMNode(this.refs.scrollView);
        var {messages} = this.state;
        if (node.scrollTop == 0) {
            socket.emit("getLatestMessages", messages.length);
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
