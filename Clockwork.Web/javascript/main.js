document.addEventListener('readystatechange', event => {
    // When window loaded ( external resources are loaded too- `css`,`src`, etc...) 
    if (event.target.readyState === "complete") {
        GetPastTimes();
    }
});


function GetPastTimes(isInitialLoad = false) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            const response = JSON.parse(this.response);
            const html = CreateTable(response.pastTimes, response.totalPages);
            document.getElementById("output").innerHTML = html;
        }
    };
    const parameters = GetPagingValues(isInitialLoad);
    UseHttpRequest(xhttp, "GET", "http://localhost:5000/api/pasttimes" + parameters);
} 

function UserAction() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            const response = JSON.parse(this.response);
            const html = CreateTable(response.pastTimes, response.totalPages);
            document.getElementById("output").innerHTML = html;
            ShowCurrentTime(response.currentTime);
        }
    };
    const parameters = GetPagingValues();
    UseHttpRequest(xhttp, "GET", "http://localhost:5000/api/currenttime" + parameters);
}

function UseHttpRequest(xhttp, method, url) {
    xhttp.open(method, url, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send();
}

function GetDataOfPage(pageIndex) {
    var elems = document.querySelectorAll(".page-button");

    [].forEach.call(elems, function(el) {
        el.classList.remove("active");
    });
    
    document.getElementById("page-index").value = pageIndex;
    document.getElementById("page-button-" + pageIndex).classList.add("active");
    GetPagingValues();

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            const response = JSON.parse(this.response);    
            document.getElementById("past-times-table").tBodies[0].innerHTML = PopulateData("", response.pastTimes);
        }
    };
    const parameters = GetPagingValues();
    UseHttpRequest(xhttp, "GET", "http://localhost:5000/api/pasttimes" + parameters);   
    
    
}

function GetPagingValues(isInitialLoad = false) {
    if(isInitialLoad) {
        document.getElementById("page-index").value = 1;
    }
    const pageSize = document.getElementById("page-size").value;
    const pageIndex = document.getElementById("page-index").value;
    
    return "?PageSize=" + pageSize + "&PageIndex=" + pageIndex;
}

function ShowCurrentTime(currentTime) {
    document.getElementById("current-time").innerHTML = "Current Time: " + currentTime;
}

function CreateTable(pastTimes, totalPages) {
    var html = "<table id=\"past-times-table\" class =\"ui celled padded table\"><thead>" +
        "<tr>" +
        "<th>Id</th><th>Time</th>" +
        "</tr></thead><tbody>";
    var pastTimesCount = pastTimes.length;

    html = PopulateData(html, pastTimes);
    
    var pageButtons = "";
    
    for(let i = 0; i < totalPages; i++) {
        var activeClass = i === 0 ? "active" : "";
        
        pageButtons += "<a id=\"page-button-" + (i+1) + "\" onclick=\"GetDataOfPage(" + (i+1) + ");\" class=\"item page-button " + activeClass + "\">" + (i + 1) + "</a>"; 
    }

    html += "<tfoot>" +
        "    <tr><th colspan=\"5\">" +
        "      <div class=\"ui right floated pagination menu\">" +
        "        <a class=\"icon item\">" +
        "          <i class=\"left chevron icon\"></i>" +
        "        </a>\n" +
        pageButtons +
        "        <a class=\"icon item\">" +
        "          <i class=\"right chevron icon\"></i>\n" +
        "        </a>\n" +
        "      </div>\n" +
        "    </th>\n" +
        "  </tr></tfoot></tbody></table>"

    return html;
}

function PopulateData(html, pastTimes) {
    var pastTimesCount = pastTimes.length;

    for(let i = 0; i < pastTimesCount; i++){
        html += "<tr><td>" + pastTimes[i].id + "</td><td>" + pastTimes[i].time + "</td></tr>";
    }
    
    return html;
}