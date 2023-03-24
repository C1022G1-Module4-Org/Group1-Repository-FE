/*function login(page) {
    let login = document.getElementById("idLogin").value;
    $.ajax({
        type: "POST", url: `http://localhost:8080/login`,
        headers: {

            "Content-Type": "application/json",
        }, success: function (data) {
            window.location.href = '/home.html';
            // renderPage(data);
        }, error: function (error) {
            console.log(error);
        }
    })

};
$(document).ready(function () {
    loadPromotion();
});*/
function login() {
    debugger
    let username = $("#username").val();
    let password =  $("#password").val();
    $.ajax({
        type: 'POST',
        url: `http://localhost:8080/login`,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        data: JSON.stringify({
            "username": username,
            "password": password,
        }),
        success: function (data) {
            console.log(data)
            sessionStorage.setItem('token', data.token);
            sessionStorage.setItem('name', data.name);
            window.location.href = '/base/home.html';
        },
        error: function () {
            alert("Error!");
        },
    });
}
