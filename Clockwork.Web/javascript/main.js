function UserAction() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            const response = JSON.parse(this.response);
            const html = CreateTable(response.currentTime, response.pastTimes);
            document.getElementById("output").innerHTML = html;
        }
    };
    xhttp.open("GET", "http://localhost:5000/api/currenttime", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send();

}

function CreateTable(currentTime, pastTimes) {
    var html = "Current Time: " + currentTime + "<br/><br/>" +
        "<table class =\"ui celled padded table\"><thead>" +
        "<tr>" +
        "<th>Id</th><th>Time</th>" +
        "</tr></thead><tbody>";
    var pastTimesCount = pastTimes.length;

    for(let i = 0; i < pastTimesCount; i++){
        html += "<tr><td>" + pastTimes[i].id + "</td><td>" + pastTimes[i].time + "</td></tr>";
    }

    html += "</tbody></table>"

    return html;
}