

// checks whether string has specified characters or not 
function check_input(name) {
    var regex = /^[a-z A-Z]+$/;
    return regex.test(name);
}

// prints alerts in these situations:
/*
    1. name is invalid 
    2. api couldn't make any guess about the name (for additional score :))) 
*/
function print_alert(message) {
    var alert_text = document.querySelector('#alert');
    alert_text.innerText = message;
}

// prints status for delete button.
function print_status(message) {
    var status_text = document.querySelector('#status');
    status_text.innerText = message;
}

// submit button for submiting form data and sending request to api
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
                if (respData['gender']) {
                    gender_status.innerText = respData['gender'];
                    gender_percentage.innerText = respData['probability'];
                } else {
                    print_alert("There is no guess for " + respData['name'])
                }
            }
        };

        xmlHttp.open(
            'GET',
            'https://api.genderize.io/?name=' +
            // taking care of multipart names 
                items['name'].split(' ').join('%20'),
            true
        );

        xmlHttp.send(null);
    } else {
        print_alert(items['name'] + ' is not a valid name!!!');
    }

    e.preventDefault();
};

/*
    scenarios for saving a record to localstorage :
        
        1. if a user selects any option between radio buttons it has preference over subsequent options 
        2. if a user send a request and receive response and then press the save button without choosing any radio button option,
            the response is saved in local storage
        otherwise an alert message is printed
*/
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
            localStorage.setItem(items['name'], gender_requested);
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


/*
    clears a record if it is available otherwise prints an error
*/
document.getElementById('clear-button').onclick = function (e) {
    var name = document.getElementById('name').value;
    var gender_status_saved = document.querySelector('#gender-status-saved');

    if (name.length != 0) {
        var gender = localStorage.getItem(name);
        if (gender) {
            localStorage.removeItem(name);
            gender_status_saved.innerText = '';
            print_status('successfully deleted : ' + name);
        } else {
            print_alert(
                "The gender of this name didn't save in the storage!!!"
            );
        }
    } else {
        print_alert('you have not enter any name!!!');
    }
    e.preventDefault();
};
