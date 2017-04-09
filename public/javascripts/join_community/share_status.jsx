/**
 * Created by yifanli on 10/16/16.
 * @jsx React.DOM
 */

if (typeof (global) === 'undefined') {
    global = {};
}
global.socket = global.socket || io.connect();


var Status = React.createClass({
    getInitialState() {
        return {user: '', status: "undefined"}
    },

    componentWillMount() {
        global.socket.on("setInitStatus", this._setStatus);
    },

    _setStatus(username, status) {
        this.setState({
            user: username,
            status: status
        });
    },

    changeHandler(e) {
        var newStatus = e.target.value;
        console.log(newStatus);
        this.setState({status: newStatus});
        global.socket.emit("changeStatus", newStatus);
    },

    render() {
        if (this.state.user === "") {
            return null;
        }
        if (this.state.status === "ok") {
            return (
                <form>
                    <select className="form-control" style={{backgroundColor: '#5cb85c', borderColor: "#4cae4c", color: "#fff"}} id="share_status" onChange={this.changeHandler} value="ok">
                        <option value="undefined">Share Status</option>
                        <option value="ok">OK</option>
                        <option value="help">Help</option>
                        <option value="emergency">Emergency</option>
                    </select>
                </form>
            );
        } else if (this.state.status === "help") {
            return (
                <form>
                    <select className="form-control" style={{backgroundColor: '#f0ad4e', borderColor: "#eea236", color: "#fff"}} id="share_status" onChange={this.changeHandler} value="help">
                        <option value="undefined">Share Status</option>
                        <option value="ok">OK</option>
                        <option value="help">Help</option>
                        <option value="emergency">Emergency</option>
                    </select>
                </form>
            );
        } else if (this.state.status === "emergency") {
            return (
                <form>
                    <select className="form-control" style={{backgroundColor: '#d9534f', borderColor: "#d43f3a", color: "#fff"}} id="share_status" onChange={this.changeHandler} value="emergency">
                        <option value="undefined">Share Status</option>
                        <option value="ok">OK</option>
                        <option value="help">Help</option>
                        <option value="emergency">Emergency</option>
                    </select>
                </form>
            );
        } else {
            return (
                <form>
                    <select className="form-control"
                            style={{backgroundColor: '#fff', borderColor: "#ccc", color: "#333"}} id="share_status"
                            onChange={this.changeHandler} value="undefined">
                        <option value="undefined">Share Status</option>
                        <option value="ok">OK</option>
                        <option value="help">Help</option>
                        <option value="emergency">Emergency</option>
                    </select>
                </form>
            );
        }
    }

});

ReactDOM.render(<Status/>, document.getElementById("share_status_area"));