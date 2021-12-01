function check_input(name) {
    var regex = /^[a-z A-Z]+$/;
    return regex.test(name);
}

function print_alert(message) {
    var alert_text = document.querySelector('#alert');
    alert_text.innerText = message;
}

function print_status(message) {
    var status_text = document.querySelector('#status');
    status_text.innerText = message;
}

document.getElementById('submit-button').onclick = function (e) {
    var form = document.getElementById('main-form');
    var gender_status = document.querySelector('#gender-status');
    var gender_percentage = document.querySelector('#gender-percentage');
    var gender_status_saved = document.querySelector('#gender-status-saved');

    var data = new FormData(form);
    var items = {};
    for (const entry of data) {
        items[entry[0]] = entry[1];
    }
    gender_status_saved.innerText = localStorage.getItem(items['name']);
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
            'https://api.genderize.io/?name=' +
                items['name'].split(' ').join('%20'),
            true
        );

        xmlHttp.send(null);
    } else {
        print_alert(items['name'] + ' is not a valid name!!!');
    }

    e.preventDefault();
};

document.getElementById('save-button').onclick = function (e) {
    var form = document.getElementById('main-form');
    var gender_status_saved = document.querySelector('#gender-status-saved');
    var gender_status = document.querySelector('#gender-status');

    var data = new FormData(form);
    var items = {};
    for (const entry of data) {
        items[entry[0]] = entry[1];
    }
    if (check_input(items['name'])) {
        if (items['gender']) {
            localStorage.setItem(items['name'], items['gender']);
            gender_status_saved.innerText = items['gender'];
        } else {
            var gender_requested = gender_status.innerText;
            gender_status_saved.innerText = gender_requested;
            localStorage.setItem(items['name'] , gender_requested)
            if (gender_requested.length == 0) {
                print_alert(
                    'You did not choose a gender and you did not search any name either!!!'
                );
            }
        }
    } else {
        print_alert(items['name'] + ' is not a valid name!!!');
    }

    e.preventDefault();
};

document.getElementById('clear-button').onclick = function (e) {
    var name = document.getElementById('name').value;
    var gender_status_saved = document.querySelector('#gender-status-saved');

    if (name.length != 0) {
        var gender = localStorage.getItem(name);
        if(gender){
            localStorage.removeItem(name)
            gender_status_saved.innerText = ''
            print_status("successfully deleted : " + name)

        } else{
            print_alert("The gender of this name didn't save in the storage!!!")
        }
    } else{
        print_alert("you have not enter any name!!!")
    }
    e.preventDefault();
};
