/**
 * Created by Haoxiang on 11/9/16.
 */
function dataURItoBlob(dataURI) {
    var byteString = atob(dataURI.split(',')[1]);
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], {type: mimeString});
}

var MyLocationComponent = React.createClass({
    render() {
        if (this.props.latitude)
            return (
                <div>
                    <div className="form-group">
                        <label htmlFor="lat_text">Latitude</label>
                        <p id="lat_text">{this.props.latitude}</p>
                        <label htmlFor="long_text">Longitude</label>
                        <p id="long_text">{this.props.longitude}</p>
                        <button type="button" className="btn btn-success" onClick={this.props.onClick}>Update Location
                        </button>
                    </div>
                </div>);
        else {
            return (
                <div>
                    <p>No location data is captured from your browser!</p>
                    <button type="button" className="btn btn-success" onClick={this.props.onClick}>Update Location
                    </button>
                </div>
            );
        }
    }
});


var ListItemComponent = React.createClass({
    changeMapView(){
        var location = [this.props.item.latitude, this.props.item.longitude];
        this.props.map.setView(location, 14);
    },
    render(){
        return (
            <list className="list-group-item col-xs-4 col-sm-4 col-md-3" onMouseDown={this.changeMapView}>
                {this.props.item.name}
            </list>
        );
    }
});

var CitizenListComponent = React.createClass({
    render() {
        var local_map = this.props.map;
        return (
            <div className="container">
                <ul className="list-unstyled">{
                    this.props.citizens.map(function (citizen) {
                        return (
                            <ListItemComponent item={citizen} map={local_map}/>
                        );
                    })}
                </ul>
            </div>
        );
    }
});

var EventListComponent = React.createClass({
    render() {
        var local_map = this.props.map;
        return (
            <div className="container">
                <ul className="list-unstyled">{
                    this.props.events.map(function (event) {
                        return (
                            <ListItemComponent item={event} map={local_map}/>
                        );
                    })
                }
                </ul>
            </div>
        );
    }
});

var MyAddressComponent = React.createClass({
    render() {
        return (
            <div>
                <div className="form-group">
                    <label htmlFor="address">My Address</label>
                    <input type="text" className="form-control" id="address"/>
                    <button type="button" className="btn btn-success" onClick={this.props.onClick}>Update Location
                    </button>
                </div>
            </div>
        );
    }
});


var AddEventComponent = React.createClass({
    render() {
        return (
            <div>
                <div className="form-group">
                    <label htmlFor="event_name">Event Name:</label>
                    <input type="text" className="form-control" id="event_name"/>
                </div>
                <div className="form-group">
                    <label htmlFor="event_duration">Event Duration</label>
                    <input type="text" className="form-control" id="event_duration"/>
                </div>
                <div>
                    <label>Location:</label><br/>
                    [<span id="event_lat">{this.props.latlng.lat}</span>, <span
                    id="event_lgt">{this.props.latlng.lng}</span>]
                </div>
                <div className="form-group">
                    <label htmlFor="event_description">Description</label>
                    <input type="text" className="form-control" id="event_description"/>
                </div>
                <div>
                    <span className="btn btn-success" onClick={
                        function () {
                            $('#upload').trigger('click');
                        }
                    }>
                      <span className="glyphicon glyphicon-upload" />
                      Select Picture to Upload
                    </span>
                    <span style={{display: 'none'}}>
                      <input type="file" name="upload_file" id="upload" accept="image/jpeg" />
                    </span>
                </div>
                <br/>
                <button type="button" className="btn btn-default" onClick={this.props.onClickAddEvent}>Add Event
                </button>
            </div>
        );
    }
});


var EventComponent = React.createClass({
    cleanPath(imgUrl){
        if (imgUrl) return imgUrl.replace("public/", "/");
        else return "";
    },
    render() {
        if (this.props.event.imgUrl) {
            return (
                <div>
                    <p><strong>Event Name: </strong> {this.props.event.name}</p>
                    <p ><strong> Description: </strong> {this.props.event.description}</p>
                    <div>
                        <img display="block" height="auto" width="200px" src={this.cleanPath(this.props.event.imgUrl)} ></img>
                    </div>

                </div>
            );
        }else{
            return (
                <div>
                    <p><strong>Event Name: </strong> {this.props.event.name}</p>
                    <p ><strong> Description: </strong> {this.props.event.description}</p>
                    <p> No Photo</p>
                </div>
            );
        }
    }
});


var CitizenPopUpComponent = React.createClass({
    render() {
        return (
            <div>
                <p>
                    <strong>Name: </strong>
                    {this.props.user.name}
                </p>
                <p>
                    <a className="btn btn-default" href={"../chatPrivately/" + this.props.user.name}>Chat Privately</a>
                </p>
            </div>
        );
    }
});

var MapComponent = React.createClass({
    onClickAddEvent(){
        var event = {}
        event.name = $('#event_name').val();
        event.description = $('#event_description').val();
        event.duration = $('#event_duration').val();
        event.lgt = $('#event_lgt').text();
        event.lat = $('#event_lat').text();
        var files = $("#upload")[0].files;
        if (files[0]){
            var data = new FormData();
            if (files) {
                var data = new FormData();
                console.log(data);
                console.log("files");
                console.log(files[0]);

                var Comp = this;

                lrz(files[0]).then(function (rst) {
                    data.append('file', dataURItoBlob(rst.base64));
                    data.append('name', $('#event_name').val());
                    data.append('description', $('#event_description').val());
                    data.append('lgt', $('#event_lgt').text());
                    data.append('lat', $('#event_lat').text());
                    data.append('duration', $('#event_duration').val());

                    $.ajax({
                        type: 'post',
                        dataType: 'json',
                        url: '/findNearby/addEventWithImage',
                        data: data,
                        contentType: false,
                        processData: false,
                        statusCode: {
                            201: function () {
                                alert('Invalid Picture Type');
                            },
                            200: function () {
                                alert('Successfully uploaded photo and added event!');
                                Comp.forceUpdate();
                            }.bind(this)
                        }
                    });
                })
                .catch(function (err) {
                    alert('Picture error!');
                });
            }
        }else{
            $.post("/findNearby/addEvent?" + $.param(event), function (data) {
                this.forceUpdate();
                alert('Successfully added event!');
            }.bind(this));
        }

    },

    getInitialState() {
        return {};
    },
    componentWillMount(){
        this.updateMyLocByBrowser();
    },
    showEventOnMap(event){
        var div = document.createElement('div');
        ReactDOM.render(<EventComponent event={event}/>, div);
        L.marker([event.latitude, event.longitude], {icon: this.eventIcon}).addTo(this.map).bindPopup(div);
    },

    showUserOnMap(user){
        var div = document.createElement('div');
        ReactDOM.render(<CitizenPopUpComponent user={user}/>, div);
        L.marker([user.latitude, user.longitude], {icon: this.citizenIcon}).addTo(this.map).bindPopup(div);
    },

    updateMyLocByBrowser(){
        navigator.geolocation.getCurrentPosition(
            // if successfully get the browser location
            function (location) {
                var loc = {latitude: location.coords.latitude, longitude: location.coords.longitude};
                console.log(loc);
                this.setState({location: loc});
                this.map.setView([loc.latitude, loc.longitude], 14);

                $.post("/findNearby/updateUserLocation?" + $.param({
                        lat: loc.latitude,
                        lgt: loc.longitude
                    }), function (data) {
                    this.forceUpdate();
                }.bind(this));

                ReactDOM.render(<MyLocationComponent latitude={loc.latitude} longitude={loc.longitude}
                                                     onClick={() => this.updateMyLocByBrowser()}/>, document.getElementById('menu1'));
            }.bind(this),
            // if fail to get the browser location
            function error(err) {
                alert("We can not get location data from browser. Please enter your address manually!");
                ReactDOM.render(<MyAddressComponent
                    onClick={() => this.updateMyLocByAddress()}/>, document.getElementById('menu1'));
            }.bind(this)
        );
    },
    updateMyLocByAddress(){
        var addr = $('#address').val();
        $.get("/findNearby/getLocationByAddress?" + $.param({"addr": addr}), function (data) {
            if (data.length == 0) {
                alert("Sorry! Location not found!");
            } else {
                data = data[0];
                var loc = {latitude: data.latitude, longitude: data.longitude};
                console.log(loc);
                this.setState({location: loc});
                this.map.setView([loc.latitude, loc.longitude], 14);
                $.post("/findNearby/updateUserLocation?" + $.param({
                        lat: loc.latitude,
                        lgt: loc.longitude
                    }), function (data) {
                    this.forceUpdate();
                }.bind(this));

            }
        }.bind(this));
    },
    onMapClick(e) {
        var popup = L.popup();
        var div = document.createElement('div');
        console.log(e.latlng);
        ReactDOM.render(<AddEventComponent latlng={e.latlng} onClickAddEvent={this.onClickAddEvent}/>, div);
        console.log(div);
        popup.setContent(div)
            .setLatLng(e.latlng)
            .openOn(this.map);
    },
    componentDidMount() {
        this.map = L.map('map');
        L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpandmbXliNDBjZWd2M2x6bDk3c2ZtOTkifQ._QA7i5Mpkd_m30IGElHziw', {
            maxZoom: 20,
            minZoom: 10,
            attribution: "",
            id: 'mapbox.streets'
        }).addTo(this.map);

        this.map.on('click', this.onMapClick);
        this.citizenIcon = new L.Icon({
            iconSize: [30, 45],
            iconAnchor: [13, 27],
            popupAnchor: [1, -24],
            iconUrl: "images/citizen.png"
        });
        this.eventIcon = new L.Icon({
            iconSize: [40, 40],
            iconAnchor: [13, 27],
            popupAnchor: [1, -24],
            iconUrl: "images/event.png"
        });
    },
    componentWillUpdate: function () {
        this.users = [];
        this.events = [];
    },
    componentDidUpdate: function () {
        if (this.state.location) {
            var location = [this.state.location.latitude, this.state.location.longitude];
            if (this.myLocationMarker)
                this.map.removeLayer(this.myLocationMarker);
            this.myLocationMarker = L.marker(location).addTo(this.map);
            $.get("/findNearby/getNearbyCitizens?" + $.param({lat: location[0], lgt: location[1]}),
                function (data) {
                    console.log(data);
                    var users = data.userLocations;
                    ReactDOM.render(<CitizenListComponent citizens={users}
                                                          map={this.map}/>, document.getElementById("menu2"));
                    for (var i = 0; i < users.length; i++) {
                        console.log(users[i]);
                        this.showUserOnMap(users[i]);
                    }
                }.bind(this));

            var str = "/findNearby/getNearbyEvents?" + $.param({lat: location[0], lgt: location[1]});
            $.get(str,
                function (data) {
                    var events = data.mapEvents;
                    console.log(data);
                    ReactDOM.render(<EventListComponent events={events}
                                                        map={this.map}/>, document.getElementById("menu3"));
                    for (var i = 0; i < events.length; i++) {
                        console.log(events[i]);
                        this.showEventOnMap(events[i]);
                    }
                }.bind(this));
        }
    },
    render: function () {
        return (
            <div id='map'></div>
        );
    }
});

if (confirm("ESN will use your location data") == true) {
    ReactDOM.render(
        <MapComponent/>,
        document.getElementById('map'));

} else {
    alert("Sorry, you can not use this feature!");
}





