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
    $.ajax({
        type: 'POST',
        url: `http://localhost:8080/login`,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        data: JSON.stringify({
            username: username,
            password: password,
        }),
        success: function (data) {
            window.location.href = '/home.html';
        },
        error: function () {
            alert("Error!");
        },
    })
}
