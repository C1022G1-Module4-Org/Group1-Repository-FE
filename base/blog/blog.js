
function movePage(page) {
    getBlogList(page);
}

function renderPage(blogList) {
    let pageable = "";
    if (
        blogList.number <= blogList.totalPages - 1 &&
        blogList.number > 0
    ) {
        pageable += `
    <button class="page-item btn btn-dark btn-sm" 
    onclick="movePage(${blogList.number - 1})">
    Previous
    </button>
    `;
    }
    for (let i = 1; i <= blogList.totalPages; i++) {
        let pageItem = $(`<button class="page-item number btn btn-dark btn-sm"
                      onclick="movePage(${i - 1})">
                      ${i}
                      </button>`);
        if (i === blogList.number + 1) {
            pageItem.addClass("active1");
        } else {
            pageItem.removeClass("active1");
        }
        pageable += pageItem.prop("outerHTML");
    }

    if (blogList.number >= 0 && blogList.number < blogList.totalPages - 1) {
        pageable += `
    <button class="page-item btn btn-dark btn-sm" 
    onclick="movePage(${blogList.number + 1})">
    Next
    </button>
    `;
    }
    $("#pagination").html(pageable);
}

function getBlogIdAndName(id, content) {
    document.getElementById("deleteId").value = id;
    document.getElementById("deleteName").innerText = content;
}

// list
function renderBlogList(blogList) {
    let elements = "";
    let stt = blogList.number*blogList.size + 1;

    for (let blog of blogList.content) {
        elements += `<tr>
          <td>${stt++}</td>
          <td>${blog.content}</td>
          <td>${blog.title}</td>
          <td>${blog.author}</td>
          <td>${blog.categoryDto.name}</td>
          <td>
                        <button class="btn btn-primary btn-sm edit" type="button" title="Sửa" 
                id="show-emp" data-toggle="modal" data-target="#update"
                onclick="getBlogInfo(${blog.id})">Sửa
            </button>
</td>
          <td>  
              <button type="button"
                class="btn btn-danger btn-sm"
                data-toggle="modal" data-target="#exampleModal"
                onclick="getBlogIdAndName(${blog.id}, '${blog.content}')"> Xoá
              </button>
          </td>
          </tr>`;
    }
    $("#list-blog").html(elements);
}

function getBlogList(page) {
    debugger;
    let search = $("#search").val();
    $.ajax({
        type: "get",
        url: `http://localhost:8080/blog?name=${search}&page=${
            page ? page : "0"
        }`,
        headers: {
            "Content-Type": "application/json",
        },
        success: function (data) {
            if (data.totalElements === 0){
                document.getElementById("mess").innerText = "Khong tim thay ";
            }else {
                document.getElementById("mess").innerText = "";
            }
            renderBlogList(data);
            renderPage(data);
        },
        error: function (error) {
            console.log(error);
        },
    });
}

$(document).ready(function () {
    getBlogList();
});

// delete
$("#delete-blog").submit(function (event) {
    event.preventDefault();
    let id = $("#deleteId").val();
    deleteBlog(id);
});

function deleteBlog(id) {
    $.ajax({
        type: "delete",
        url: `http://localhost:8080/blog/${id}`,
        success: function (data) {
            console.log("Xóa thành công");
            $("#exampleModal").hide();
            $("body").removeClass("modal-open");
            $(".modal-backdrop").remove();
            getBlogList();
        },
        error: function (error) {
            console.log("Lỗi, không xóa được");
        },
    });
}

// add
$("#add-blog").submit(function (event) {
    debugger;
    event.preventDefault();
    let content = $("#content").val();
    let title = $("#title").val();
    let author = $("#author").val();
    let categoryDto = $("#category").val();
    addBlog(content , title , author , categoryDto);
});

function addBlog(content , title , author , categoryDto) {
    debugger;
    $.ajax({
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        url: `http://localhost:8080/blog`,
        type: "post",
        data: JSON.stringify({
            content: content,
            title: title,
            author: author,
            categoryDto: {id: categoryDto},
        }),
        success: function (data) {
            alert("Thêm blog thành công!");
            $("#add-Blog").hide();
            $("body").removeClass("modal-open");
            $(".modal-backdrop").remove();
            getBlogList();
        },
        error: function (data) {
            for (let key of Object.keys(data.responseJSON)) {
                const cusKey = `${key[0].toUpperCase()}${key.substring(1)}`;
                if (document.getElementById(`add${cusKey}Valid`)) {
                    document.getElementById(`add${cusKey}Valid`).innerText = data.responseJSON[key] ?? '';
                }
            }
        },
    });
}

function getSelectCategoryList() {
    debugger;
    $.ajax({
        type: "GET",
        url: `http://localhost:8080/category?name=${""}`,
        headers: {
            "Content-Type": "application/json",
        },
        success: function (data) {
            showCategorySelectOption(data);
            showCategorySelectOptionCreate(data)
        },
        error: function (error) {
            console.log(error);
        },
    });
}

function showCategorySelectOptionCreate(categorys) {
    let element = "";
    element += `
  <select class="form-control" id="category" name="category">`;

    for (let category of categorys) {
        element += `<option value="${category.id}">`;
        element += category.name;
        `</option>`;
    }

    `</select>`;
    $("#categoryDto").html(element);
}

function showCategorySelectOption(categorys) {
    let element = "";
    element += `
  <select class="form-control" id="category-update" name="category-update">`;
    for (let category of categorys) {
        element += `<option value="${category.id}">`;
        element += category.name;
        `</option>`;
    }
    `</select>`;
    $("#category-Dto").html(element);
}

$(document).ready(function () {
    getSelectCategoryList();
});

//UPDATE
$("#update-performing").submit(function (event) {
    event.preventDefault();
    let id = $("#update-id").val();
    let content = $("#update-content").val();
    let title = $("#update-title").val();
    let author = $("#update-author").val();
    let categoryDto = $("#category-update").val();
    updateBlog(id,  content, title, author, categoryDto);
})

function updateBlog(id,  content, title, author, categoryDto) {
    debugger;
    $.ajax({
        type: "PUT",
        url: `http://localhost:8080/blog/${id}`,
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        data: JSON.stringify({
            id: id,
            content: content,
            title: title,
            author: author,
            categoryDto: {id: categoryDto},
        }),
        success: function (data) {
            alert("Sửa thông tin blog thành công!");
            $("#update").hide();
            $("body").removeClass("modal-open");
            $(".modal-backdrop").remove();
            getBlogList();
        },
        error: function () {
            alert("Lỗi khi sửa thông tin blog!");
        },
    })
}

function getBlogInfo(id) {
    debugger;
    $.ajax({
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        type: "get",
        url: `http://localhost:8080/blog/${id}`,
        success: function (data) {
            getSelectCategoryList();
            let element = "";
            let blog = data;
            element +=
                `
      <div class="form-group">
        <div id="thongbao" class="text-danger" style="text-align: center;"></div>
      </div>
      <div class="form-group">
        <input type="hidden" id="update-id" value="${blog.id}">
      </div>
      <div class="form-group">
        <label for="update-content" class="control-label col-xs-3">Tên content</label>
        <div class="col-md-12">
          <input type="text" class="form-control" id="update-content" value="${blog.content}">
        </div>
      </div>
         <div class="form-group">
        <label for="update-title" class="control-label col-xs-3">Title</label>
        <div class="col-md-12">
          <input type="text" class="form-control" id="update-title" value="${blog.title}">
        </div>
      </div>
            <div class="form-group">
        <label for="update-author" class="control-label col-xs-3">Author</label>
        <div class="col-md-12">
          <input type="text" class="form-control" id="update-author" value="${blog.author}">
        </div>
      </div>
       <div class="form-group">
        <label class="control-label">Category</label>
        <div class="col-md-12" id="category-Dto">
        </div>
      </div>
      <div class="modal-footer text-center flex items-center gap-2">
        <button type="submit" id="btnSave" class="btn btn-primary btn-sm">Lưu</button>
        <button class="btn btn-danger btn-sm" data-dismiss="modal">Hủy bỏ</a>
      </div>
      `
            $("#update-performing").html(element);
        },
        error: function (error) {
            console.log(error);
        }
    })
}