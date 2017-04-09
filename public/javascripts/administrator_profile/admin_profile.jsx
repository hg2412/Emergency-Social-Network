class Row extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        var link = "/admin/userInfo?username=" + this.props.username;
        return (
            <li>
                <a href={link} className="list-group-item list-group-item-action">{this.props.username}</a>
            </li>
        );
    }
}

class Table extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div id="data-container">
                <a href="#" className="list-group-item active">Please select user to edit</a>
                <ul style={{"list-style": "none"}} className="list-group">
                    {
                        this.props.userlist.map((user, i) => {
                            return (
                                <Row
                                    key={i}
                                    username={user}
                                />
                            )
                        })
                    }
                </ul>
            </div>
        );
    }
}

class Pagination extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return(
            <ul className="pager">
                <li className="previous">
                    <a href="#" onClick={this.props.getPrevPage}>Prev</a>
                </li>
                <li>{this.props.currentPage} / {this.props.numPages}</li>
                <li className="next">
                    <a href= "#" onClick={this.props.getNextPage}>Next</a>
                </li>
            </ul>
        );
    }
}

class UserListing extends React.Component {
    constructor(props) {
        super(props);
        this.userlist = [];
        this.listSize = 0;
        this.pageSize = 3;
        this.numPages = 0;
        this.state = {
            currentPage: 1,
            displayList: []
        };
    }
    componentDidMount() {
        var that = this;
        axios.get('/admin/userlist').then(function(response) {
            that.userlist = response.data.userlist;
            that.listSize = that.userlist.length;
            that.numPages = Math.floor(that.listSize / that.pageSize);
            if (that.listSize % that.pageSize > 0) {
                that.numPages++;
            }
            that.getPage(1);
        });
    }
    getPage(n) {
        var res = [];
        var start = (n - 1) * this.pageSize;
        var end = start + this.pageSize - 1 < this.listSize ? start + this.pageSize - 1 : this.listSize - 1;
        while (start <= end) {
            res.push(this.userlist[start]);
            start += 1;
        }
        this.setState({displayList: res});
    }
    handleNextPage() {
        var {currentPage} = this.state;
        if (currentPage < this.numPages) {
            currentPage += 1;
            this.getPage(currentPage);
            this.setState({currentPage});
        }
    }
    handlePrevPage() {
        var {currentPage} = this.state;
        if (currentPage > 1) {
            currentPage -= 1;
            this.getPage(currentPage);
            this.setState({currentPage});
        }
    }
    render() {
        return(
            <div>
                <Table
                    userlist={this.state.displayList}
                />
                <Pagination
                    currentPage={this.state.currentPage}
                    numPages={this.numPages}
                    getNextPage={this.handleNextPage.bind(this)}
                    getPrevPage={this.handlePrevPage.bind(this)}
                />
            </div>
        );
    }
}
ReactDOM.render(<UserListing/>, document.getElementById("userlist"));