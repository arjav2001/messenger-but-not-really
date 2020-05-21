document.addEventListener('DOMContentLoaded', () => {


    document.getElementById("index").onclick = () => {
        localStorage.clear();
    };

    document.getElementById("homepage").onclick = () => {
        localStorage.removeItem("current_channel");
    };

    document.getElementById("submit").disabled = true;

    document.getElementById("message").onkeyup = () => {
        if (document.getElementById("message").value.length > 0)
            document.getElementById("submit").disabled = false;
        else
            document.getElementById("submit").disabled = true;
    };

    // Connect to websocket
    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

    // When connected, configure buttons
    socket.on('connect', () => {

        // Each button should emit a "submit vote" event
        document.getElementById("submit").onclick = () => {
            const message = document.getElementById("message").value;
            document.getElementById("message").value = "";
            document.getElementById("submit").disabled = true;
            socket.emit('text sent', {'message': message, 'name': localStorage.getItem('name'), 'channel': localStorage.getItem('current_channel')});
        };
    });
    // When a new vote is announced, add to the unordered list
    socket.on('send message', data => {
        if (data.channel==localStorage.getItem('current_channel')) {
            const p = document.createElement('p');
            p.innerHTML = `${data.name} at ${data.timestamp}`;
            const li = document.createElement('li');
            li.innerHTML = data.message;
            document.querySelector('#messages').append(p);
            document.querySelector('#messages').append(li);
        }
    });

    // document.getElementById("channels").onclick = () => {
    //     localStorage.removeItem('current_channel');
    // }

    // document.getElementById("change_user").onclick = () => {
    //     localStorage.removeItem('name');
    // }
});