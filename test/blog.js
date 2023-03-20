showList();

function showList() {
    $.ajax({
        type: "GET",
        dataType: "json",
        url: "http://localhost:8080/home/blog",
        success: function (data) {
            console.log(data);
            let element = '';
            for (let i = 0; i < data.length; i++) {
                element += `<tr>`
                element += `<th>${i + 1}</th>`
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
//delete
function deleteById(id) {
    debugger
    $.ajax({
        url: `http://localhost:8080/home/blog/${id}`,
        type: "DELETE",
        success: function () {
            alert("Bạn có muốn xoá nội dung này !!");
            showList();
        }
    })
}

function addBlogFrom(){
// $("#addBlogForm").submit(function (event) {
    // debugger
    // // event.preventDefault();
    let content = $('#content').val();
    let title = $('#title').val();
    let author = $("#author").val();
    let category = $("#category").val();
    saveBlog(content, title, author, category);
};

function saveBlog(content, title, author, category) {
    debugger
    $.ajax ({
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        url: `http://localhost:8080/home/blog`,
        type: 'POST',
        data: JSON.stringify({
            content: content,
        title: title,
        author: author,
         category: {id:category},
        }),
        success: function (data) {
            alert("Thêm blog thành công!");
            $('#exampleModal').hide();
            $('body').removeClass('modal-open');
            $('.modal-backdrop').remove();
            showList();
        },
        error: function () {
            alert("Lỗi khi thêm blog!");
        },
    })
}

function getSelectBlogTypeList() {
    $.ajax({
        type: "GET",
        url: `http://localhost:8080/category`,
        headers: {
            "Content-Type": "application/json",
        },
        success: function (data) {
            showCustomerTypeSelectOption(data);
        },
        error: function (error) {
            console.log(error);
        },
    });
}

function showCustomerTypeSelectOption(customerTypes) {
    let element = "";
    element += `
  <select class="form-control" id="category">
  `

    for (let customerType of customerTypes) {
        element += `<option value="${customerType.id}">`
        element +=customerType.name ;
        `</option>`
    }

    `</select>`;
    $("#category").html(element);
}

$(document).ready(function () {
    getSelectBlogTypeList();
});


