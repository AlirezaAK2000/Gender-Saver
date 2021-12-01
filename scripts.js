function submit_handler(e) {
    var elements = document.getElementById("main-form").elements;
    var obj ={};
    for(var i = 0 ; i < elements.length ; i++){
        var item = elements.item(i);
        obj[item.name] = item.value;
    }
    var log = document.querySelector("#gender-status");
    log.innerText = 'hello';
    e.preventDefault();
}



document.getElementById("main-form").addEventListener("submit", submit_handler ,false);