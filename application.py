import os
import time

from flask import Flask, render_template, request
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)

#username = None
channels = {"General":[]}

@app.route("/", methods=["POST", "GET"])
def index():
    return render_template("index.html")

@app.route("/homepage", methods=["POST", "GET"])
def homepage():
    global channels
    return render_template("homepage.html", channels=channels, new_message="")

@app.route("/new_channel", methods=["POST"])
def new_channel():
    global channels
    channel = request.form.get("new_channel")

    contents = channels.get(channel)
    if contents is None:
        channels[channel] = []
        message = "Added channel: " + channel
    else:
        message = "Channel already exists."
    return render_template("homepage.html", channels=channels, new_message=message)


@app.route("/channel", methods=["POST"])
def channel():
    global channels
    channel = request.form.get("channel")
    empty = False
    
    contents = channels.get(channel)
    if contents is None:
        return render_template("homepage.html", channels=channels, new_message="Channel not found.")
    if contents == []:
        empty = True
    return render_template("channel.html", contents=contents, empty=empty)


@socketio.on("text sent")
def text(data):
    global channels
    current_channel = data["channel"]
    message = data["message"]
    name = data["name"]
    if len(channels.get(current_channel)) >= 100:
        channels[current_channel] = channels[current_channel][-99]
    ts = time.gmtime()
    rts = time.strftime("%H:%M %d-%m-%Y", ts)
    channels[current_channel].append([name, rts, message])
    #channels[current_channel] = channels[current_channel].append([name, rts, message])
    emit("send message", {'name': name, 'timestamp': rts, 'message': message, 'channel': current_channel}, broadcast=True)

""" @socketio.on("channel exists")
def channel_exists(data):
    global channels
    channel = data["channel"]
    empty = False
    
    contents = channels.get(channel)
    if contents is None:
        return render_template("homepage.html", channels=channels, new_message="Channel not found.")
    if contents == []:
        empty = True
    return render_template("channel.html", contents=contents, empty=empty)

@socketio.on("name exists")
def name_exists():
    global channels
    return render_template("homepage.html", channels=channels, new_message="") """
