module.exports = {
    chatMessage: {
        senderName: {type: String, required: true},
        message: {type: String, required: true},
        timestamp: {type: String, required: true},
        status: {type: String, required: false},
        location: {type: String, required: false}
    },
    announcement: {
        username: {type: String, required: true},
        content: {type: String, required: true},
        timestamp: {type: String, required: true}
    },
    
    user: {
        username: {type: String, required: true},
        password: {type: String, required: true},
        // 4 kinds of status: undefined, ok, help, emergency
        status: {type: String, required: true}
    },
    chatPrivately: {
        senderName: { type: String, required: true },
        receiverName: { type: String, required: true },
        message: {type: String, required: true},
        timestamp: { type: String, required: true },
        status: { type: String, required: false},
        location: {type: String, required: false}
    },
    userLocation: {
        name: { type: String, required: true, unique: true, index: true},
        status:  { type: String, required: false},
        latitude: {type: Number, required: true},
        longitude: {type: Number, required: true}
    },
    mapEvent:{
        name: { type: String, required: true },
        latitude: {type: Number, required: true},
        longitude: {type: Number, required: true},
        description: { type: String, required: true},
        expiretime: { type: Date, required: true },
        imgUrl: {type: String, required: false}
    },
    userRole: {
        username: { type: String, required: true},
        // 3 kinds of privilege: citizen, coordinator, administrator
        privilege: { type: String, required: true},
        // 2 kinds of accountStatus: active, inactive
        accountStatus: { type: String, required: true}
    }
};
