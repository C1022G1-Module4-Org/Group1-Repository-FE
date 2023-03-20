showList();

function showList(){
    $.ajax({
        type: "GET",
        dataType: "json",
        url: "http://localhost:8080/home/blog",
        success: function (data){
            console.log(data);
            let element = '';
            for (let i = 0; i < data.length; i++) {
                element += `<tr>`
                element += `<th scope="row">${i+1}</th>`
                element += `<td>${data[i].content}</td>`
                element += `<td>${data[i].title}</td>`
                element += `<td>${data[i].author}</td>`
                element += `<td>${data[i].category.name}</td>`
                element += (`<td><button onclick="deleteById(` + data[i].id + `)">Delete</button></td>`);
                element += `</tr>`
            }
            $('#blogList').html(element);
        }
    })
}

$(document).ready(function () {
    let nameSearch = "";
    let sizePage = 1;
    showList(nameSearch, sizePage);
    $('#find').click(function () {
        sizePage = 1;
        let nameSearch = $('#search').val();
        showList(nameSearch, sizePage);
    })
    $(`#next`).click(function () {
        let nameSearch = $('#search').val()
        sizePage++;
        showList(nameSearch, sizePage);
    })
})

function deleteById(id) {
    $.ajax({
        url: "http://localhost:8080/blog/" + id,
        type: "DELETE",
        success: function () {
            alert("Delete success");
            showList();
        }
    })
}
