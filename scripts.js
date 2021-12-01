function check_input(name) {
    var regex = /^[a-z A-Z]+$/;
    return regex.test(name);
}

function submit_handler(e) {
    var form = document.getElementById('main-form');
    var gender_status = document.querySelector('#gender-status');
    var gender_percentage = document.querySelector('#gender-percentage');
    var gender_status_saved = document.querySelector('#gender-status-saved');

    var data = new FormData(form);
    var items = {};
    for (const entry of data) {
        items[entry[0]] = entry[1];
    }
    console.log(check_input(items['name']))
    if (check_input(items['name'])) {
        
        var xmlHttp;
        
        xmlHttp = new XMLHttpRequest();
        
        xmlHttp.onreadystatechange = function () {
            if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
                var respData = JSON.parse(xmlHttp.responseText) || {};

                gender_status.innerText = respData['gender'];
                gender_percentage.innerText = respData['probability'];
            }
        };
        
        xmlHttp.open(
            'GET',
            'https://api.genderize.io/?name=' + items['name'],
            true
        );
        
        xmlHttp.send(null);
    } else {
        alert(items['name'] + " is not a valid name!!!")
    }

    e.preventDefault();
}

document
    .getElementById('main-form')
    .addEventListener('submit', submit_handler, false);
