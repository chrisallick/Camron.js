TrashIO = function( _p, _room ) {
    var self = this;
    var parent = _p;

    self.connection;
    self.bConnected;
    self.room = _room;

    self.ws_url = "ws://stage.trash.io:8882/"+self.room;

    this.onWelcome = function(sid,players) {
        var msg = self.createMessage("join",sid);
        self.sendMessage(msg);
    }

    this.sendMessage = function(msg) {
        self.connection.send(JSON.stringify(msg));
    }

    this.ping = function() {
        var msg = {"type":"ping"}
        self.sendMessage(msg);
    }

    this.pong = function() {
        var msg = {"type":"pong"}
        self.sendMessage(msg);
    }

    this.createMessage = function( _type, _msg ) {
        var msg = {};
        msg["type"] = _type;
        msg["msg"] = _msg;
        return msg;
    }

    this.setup = function() {
        if ("WebSocket" in window) {
            self.connection = new ReconnectingWebSocket( self.ws_url );
        }

        this.connection.onmessage = function( event ) {
            try {
                self.parseMessage( JSON.parse(event.data) );
            } catch (err) { console.log(err); }
        }

        this.connection.onopen = function( event ) {
            self.bConnected = true;
        }

        this.connection.onclose = function( event ) {
            self.bConnected = false;
        }
    }

    this.parseMessage = function( msg ) {
        if( msg["type"] ) {
            if( msg["type"] == "welcome" ) {
                self.onWelcome( msg["data"], msg["players"] );
            } else if( msg["type"] == "add" ) {
                parent.addImage( msg["msg"] );
            }
        }
    }

    self.setup();
};