document.addEventListener('readystatechange', event => {
    // When window loaded ( external resources are loaded too- `css`,`src`, etc...) 
    if (event.target.readyState === "complete") {
        GetPastTimes();
    }
});

//#region Time Requests

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
    UseHttpRequest(xhttp, "GET", "http://localhost:5000/api/pasttimes?" + parameters);
}

function RecordCurrentTime() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            const response = JSON.parse(this.response);
            const html = CreateTable(response.pastTimes, response.totalPages);
            document.getElementById("output").innerHTML = html;
            ShowCurrentTime(response.currentTime);
        }
    };
    const parameters = GetTimeZone() + "&" + GetPagingValues();
    UseHttpRequest(xhttp, "GET", "http://localhost:5000/api/currenttime?" + parameters);
}

//#endregion

//#region Paging

function GoToNextPage() {
    const pageIndex = parseInt(document.getElementById("page-index").value);
    const totalPages = parseInt(document.getElementById("total-pages").value);

    if(pageIndex < totalPages) {
        GetDataOfPage(pageIndex + 1);
    }
}

function GoToPreviousPage() {
    const pageIndex = parseInt(document.getElementById("page-index").value);

    if(pageIndex > 1) {
        GetDataOfPage(pageIndex - 1);
    }
}

function GetDataOfPage(pageIndex) {
    let pageButtons = document.querySelectorAll(".page-button");

    [].forEach.call(pageButtons, function(el) {
        el.classList.remove("active");
    });

    document.getElementById("page-index").value = pageIndex;

    if(pageButtons.length > 0) {
        document.getElementById("page-button-" + pageIndex).classList.add("active");
    }

    GetPagingValues();

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            const response = JSON.parse(this.response);
            document.getElementById("past-times-table").tBodies[0].innerHTML = PopulateData("", response.pastTimes);
        }
    };
    const parameters = GetPagingValues();
    UseHttpRequest(xhttp, "GET", "http://localhost:5000/api/pasttimes?" + parameters);


}

//#endregion

//#region Table Generation

function CreateTable(pastTimes, totalPages) {
    document.getElementById("total-pages").value = totalPages;

    var html = "<table id=\"past-times-table\" class =\"ui celled padded table\"><thead>" +
        "<tr>" +
        "<th>Id</th><th>Time</th><th>Time Zone</th>" +
        "</tr></thead><tbody>";
    var pastTimesCount = pastTimes.length;

    html = PopulateData(html, pastTimes);

    var pageButtons = "";
    var dropDown = CreateJumpTo(totalPages);;

    if(totalPages < 16) {
        for(let i = 0; i < totalPages; i++) {
            var activeClass = i === 0 ? "active" : "";

            pageButtons += "<a id=\"page-button-" + (i+1) + "\" onclick=\"GetDataOfPage(" + (i+1) + ");\" class=\"item page-button " + activeClass + "\">" + (i + 1) + "</a>";
        }
    }

    html += "<tfoot>" +
        "    <tr><th colspan=\"5\">" + dropDown +
        "      <div class=\"ui right floated pagination menu\">" +
        "        <a class=\"icon item\" onclick=\"GoToPreviousPage();\">" +
        "          <i class=\"left chevron icon\"></i>" +
        "        </a>\n" +
        pageButtons +
        "        <a class=\"icon item\" onclick=\"GoToNextPage();\">" +
        "          <i class=\"right chevron icon\"></i>\n" +
        "        </a>\n" +
        "      </div>\n" +
        "    </th>\n" +
        "  </tr></tfoot></tbody></table>"

    return html;
}

function CreateJumpTo(totalPages) {
    var html = "Jump To: <select id=\"page-size\" onchange=\"GetDataOfPage(this.value);\" class=\"ui dropdown\">";

    for(let i = 0; i < totalPages; i++) {
        html += "<option value=\"" + (i+1) + "\">" + (i+1) + "</option>\n";
    }

    html += "</select>";

    return html;
}

function PopulateData(html, pastTimes) {
    var pastTimesCount = pastTimes.length;

    for(let i = 0; i < pastTimesCount; i++){
        html += "<tr><td>" + pastTimes[i].id + "</td><td>" + pastTimes[i].time + "</td>" + "</td><td>" + pastTimes[i].timeZone + "</td></tr>";
    }

    return html;
}

//#endregion

//#region Helpers

function UseHttpRequest(xhttp, method, url) {
    xhttp.open(method, url, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send();
}

function GetPagingValues(isInitialLoad = false) {
    if(isInitialLoad) {
        document.getElementById("page-index").value = 1;
    }
    const pageSize = document.getElementById("page-size").value;
    const pageIndex = document.getElementById("page-index").value;

    return "PageSize=" + pageSize + "&PageIndex=" + pageIndex;
}

function GetTimeZone() {
    let timeZoneLargeDropDown = document.getElementById("time-zones-large");

    return encodeURI("TimeZone=" + timeZoneLargeDropDown.selectedOptions[0].getAttribute("name"));
}

function ShowCurrentTime(currentTime) {
    document.getElementById("current-time").innerHTML = "Current Time: " + currentTime;
}

//#endregion