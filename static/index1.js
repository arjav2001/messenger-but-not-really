document.addEventListener('DOMContentLoaded', () => {

    if (localStorage.getItem('name') != null) {
        document.getElementById("name").value = localStorage.getItem('name');
        document.getElementById("submit").click();
    }

    document.getElementById("submit").onclick = () => {
        var name = document.getElementById("name").value;
        localStorage.setItem("name", name);
    }
});