document.addEventListener('DOMContentLoaded', () => {

    if (localStorage.getItem('current_channel') != null) {
        document.querySelector("select").value = localStorage.getItem('current_channel');
        document.querySelector("button").click();
    }

    document.getElementById("name").innerHTML += localStorage.getItem('name');
    document.querySelector("button").onclick = () => {
        const channel = document.querySelector("select").value;
        localStorage.setItem('current_channel', channel);
    };
});