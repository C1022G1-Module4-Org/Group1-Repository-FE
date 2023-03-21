showList();

function showList() {
    debugger
    $.ajax({
        type: "GET",
        dataType: "json",
        url: "http://localhost:8080/home/blog",
        success: function (data) {
            console.log(data);
            let element = '';
            for (let i = 0; i < data.content.length; i++) {
                debugger
                element += `<tr>`
                element += `<th>${i + 1}</th>`
                element += `<td>${data.content[i].content}</td>`
                element += `<td>${data.content[i].title}</td>`
                element += `<td>${data.content[i].author}</td>`
                element += `<td>${data.content[i].categoryDto.name}</td>`
                element += (`<td><button onclick="deleteById(` + data.content[i].id + `)">Delete</button></td>`);
                element += `</tr>`
            }
            $('#blogList').html(element);
        }

    })

}
// $(document).ready(function () {
//     showList();
// }

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

function addBlogFrom() {
// $("#addBlogForm").submit(function (event) {
    debugger
    // // event.preventDefault();
    let content = $('#content').val();
    let title = $('#title').val();
    let author = $("#author").val();
    let category = $("#categoryAdd").val();
    saveBlog(content, title, author, category);
    debugger
};

function saveBlog(content, title, author, category) {
    debugger
    $.ajax({
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
            category: {id: category},
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
            showBlogTypeSelectOption(data);
        },
        error: function (error) {
            console.log(error);
        },
    });
}

function showBlogTypeSelectOption(customerTypes) {
    debugger
    let element = "";
    element += `
  <select class="form-control" id="categoryAdd">
  `

    for (let customerType of customerTypes) {
        element += `<option value="${customerType.id}">`
        element += customerType.name;
        `</option>`
    }

    `</select>`;
    $("#category").html(element);
}

$(document).ready(function () {
    getSelectBlogTypeList();
});

function renderPage(customers) {
    let page = "";
    if (customers.number == customers.totalPages - 1 && customers.number > 0) {
        page += `
    <button class="page-item btn btn-primary btn-sm" 
    onclick="movePage(${customers.number - 1})">
    Before
    </button>
    `
    }
    for (let i = 1; i <= customers.totalPages; i++) {
        let pageItem = $(`<button class="page-item number btn btn-primary btn-sm"
                      onclick="movePage(${i - 1})">
                      ${i}
                      </button>`);
        if (i === customers.number + 1) {
            pageItem.addClass("active");
        } else {
            pageItem.removeClass("active");
        }
        page += pageItem.prop('outerHTML');
    }

    if (customers.number == 0 && customers.number < customers.totalPages) {
        page += `
    <button class="page-item btn btn-primary btn-sm" 
    onclick="movePage(${customers.number + 1})">
    Next
    </button>
    `
    }
    $("#paging").html(page);
}


