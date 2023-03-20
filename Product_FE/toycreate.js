// phân trang
function movePage(nextPage) {
    loadToy(nextPage);
}

function renderPage(toy) {
    let page = "";
    if (toy.number == toy.totalPages - 1 && toy.number > 0) {
        page += `
    <button class="page-item btn btn-primary" 
    onclick="movePage(${toy.number - 1})">
    <i class="ti-angle-left"></i>
    </button>
    `
    }
    for (let i = 1; i <= toy.totalPages; i++) {
        let pageItem = $(`<button class="page-item number btn btn-primary"
                      onclick="movePage(${i - 1})">
                      ${i}
                      </button>`);
        if (i === toy.number + 1) {
            pageItem.addClass("active");
        } else {
            pageItem.removeClass("active");
        }
        page += pageItem.prop('outerHTML');
    }

    if (toy.number == 0 && toy.number < toy.totalPages) {
        page += `
    <button class="page-item btn btn-primary" 
    onclick="movePage(${toy.number + 1})">
    <i class="ti-angle-right"></i>
    </button>
    `
    }
    $("#paging").html(page);
}
// List
// - Toy: danh sách sản phẩm cần được render lên browser
function renderToy(toys) {
    let elements = "";
    for (let toy of toys) {
        elements +=
            `<tr>
        <td >${toy.id}</td>
        <td >${toy.name}</td>
        <td >${toy.price}</td>
        <td >${toy.description}</td>
        <td >${toy.brand}</td>
        <td >${toy.origin}</td>
        <td >${toy.material}</td>
        <td >${toy.typeToyDTO.name}</td>
        <td><button class="btn btn-primary btn-sm edit" type="button" title="Sửa" 
                id="show-emp" data-toggle="modal" data-target="#update"
                onclick="getToyInfoUpdate(${toy.id})">
                update
            </button></td>
        <td>
        <button type="button"
                className="btn btn-danger"
                data-toggle="modal" data-target="#exampleModal"
                onClick="getToyInfo(${toy.id}, '${toy.name}')">
            Xóa
        </button>
        </td>
    </tr>`;
        // hiện tại đươc hiển thị trên browser
        $("#listToy").html(elements);
    }
}

function loadToy(page) {
    let search = document.getElementById("name").value;
    $.ajax({
        type: "GET", url: `http://localhost:8080/api?page=${page ? page : "0"}&name=` + search,
        headers: {

            "Content-Type": "application/json",
        }, success: function (data) {
            renderToy(data.content);
            renderPage(data);
        }, error: function (error) {
            console.log(error);
        }
    })

};
$(document).ready(function () {
    loadToy();
});


// Delete
function getToyInfo(id,name) {
    document.getElementById("deleteId").value = id;
    document.getElementById("deleteName").innerText = "Xóa Đồ chơi " + name;
}

$("#delete-toy").submit(
    function (event) {
        event.preventDefault();
        let id = $("#deleteId").val();
        deleteToy(id);
    });

function deleteToy(id) {
    $.ajax({
        type: "delete",
        url: `http://localhost:8080/api/${id}`,
        success: function (data) {
            console.log("Xóa thành công");

            loadToy
            ();

            $('#exampleModal').hide();
            $('body').removeClass('modal-open');
            $('.modal-backdrop').remove();
        },
        error: function (error) {
            console.log("Lỗi, không xóa được");
        },
    });
}


// add
$("#addToyForm").submit(
    function
        (event) {
        debugger
        event.preventDefault();
        let name = $('#name1').val();
        let price = $('#price').val();
        let description = $('#description').val();
        let brand = $('#brand').val();
        let origin = $('#origin').val();
        let material = $("#material").val();
        let toyTypeDTO = $("#typeToy").val();
        saveToy(name, price,description,brand,origin,material, toyTypeDTO);
    });

function saveToy (name,price,description,brand,origin,material,toyTypeDTO) {
    debugger
    $.ajax ({
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        url: `http://localhost:8080/api`,
        type: 'POST',
        data: JSON.stringify({
            name: name,
            price: price,
            description: description,
            brand: brand,
            origin: origin,
            material : material,
            typeToyDTO: {name:toyTypeDTO},
        }),
        success: function (data) {
            alert("Thêm sản phẩm thành công!");
            $('#modelId').hide();
            $('body').removeClass('modal-open');
            $('.modal-backdrop').remove();
        },
        error: function () {
            alert("Lỗi khi thêm sản phẩm!");
        },
    })
}

function getSelectToyTypeList() {
    debugger
    $.ajax({
        type: "GET",
        url: `http://localhost:8080/toy-type`,
        headers: {
            "Content-Type": "application/json",
        },
        success: function (data) {
            showToyTypeSelectOption(data);
        },
        error: function (error) {
            console.log(error);
        },
    });
}
function getSelectToyTypeListUpdate() {
    $.ajax({
        type: "GET",
        url: `http://localhost:8080/toy-type`,
        headers: {
            "Content-Type": "application/json",
        },
        success: function (data) {
            showToyTypeSelectOptionUpdate(data);
        },
        error: function (error) {
            console.log(error);
        },
    });
}


function showToyTypeSelectOption(toyType) {
    let element = "";
    element += `
  <select class="form-control" id="typetoy" name="typetoy">
  `

    for (let toyTypes of toyType) {
        element += `<option value="${toyTypes.name}">`
        element +=toyTypes.name ;
        `</option>`
    }

    `</select>`;
    $("#toyTypeDTO").html(element);
    // $("#toy-typeDTO").html(element);
}
function showToyTypeSelectOptionUpdate(toyType) {
    let element = "";
    element += `
  <select class="form-control" id="typeToy-update" name="typeToy">
  `

    for (let toyTypes of toyType) {
        element += `<option value="${toyTypes.name}">`
        element +=toyTypes.name ;
        `</option>`
    }

    `</select>`;
    $("#toy-typeDTO").html(element);
    $("#toyTypeDTO").html(element);
    // $("#toy-typeDTO").html(element);
}

$(document).ready(function () {
    getSelectToyTypeList();
});
// update
$("#update-toy").submit(function(event){
    debugger
    event.preventDefault();
    let id = $('#update-id').val()
    let name = $('#update-name').val();
    let price = $('#update-price').val();
    let description = $('#update-description').val();
    let brand = $('#update-brand').val();
    let origin = $('#update-origin').val();
    let material = $("#update-material").val();
    let toyTypeDTO = $("#typeToy-update").val();
    updateToy(id,name, price,description,brand,origin,material, toyTypeDTO);
});

function updateToy(id,name, price,description,brand,origin,material, toyTypeDTO){
    debugger
    $.ajax ({
        type: "PUT",
        url: `http://localhost:8080/api/${id}`,
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        data: JSON.stringify({
            id : id,
            name: name,
            price: price,
            description: description,
            brand: brand,
            origin: origin,
            material : material,
            typeToyDTO: {name:toyTypeDTO},
        }),
        success: function (data) {
            alert("Sửa thông tin Sản phẩm thành công!");
            $("#update").hide();
            $("body").removeClass("modal-open");
            $(".modal-backdrop").remove();
            loadToy();
        },
        error: function () {
            alert("Lỗi khi sửa sản phẩm!");
        },
    })
}

function getToyInfoUpdate(id) {
    $.ajax({
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        type: "get",
        url: `http://localhost:8080/api/${id}`,
        success: function (data) {
            getSelectToyTypeListUpdate();
            let element = "";
            let toy = data;
            element +=
                `
      <div class="form-group">
        <div id="thongbao" class="text-danger" style="text-align: center;"></div>
      </div>
      <div class="form-group">
        <input type="hidden" id="update-id" value="${toy.id}">
      </div>
      <div class="form-group">
        <label for="update-name" class="control-label col-xs-3">Tên Đồ Chơi</label>
        <div class="col-md-12">
          <input type="text" class="form-control" id="update-name" value="${toy.name}">
        </div>
      </div>
      <div class="form-group">
        <label for="update-price" class="control-label col-xs-3">Giá</label>
        <div class="col-md-12">
          <input type="text" class="form-control" id="update-price" value="${toy.price}">
        </div>
      </div> 
      <div class="form-group">
        <label for="update-description" class="control-label col-xs-3">Mô Tả </label>
        <div class="col-md-12">
          <input type="text" class="form-control" id="update-description" value="${toy.description}">
        </div>
      </div> 
      <div class="form-group">
        <label for="update-brand" class="control-label col-xs-3">Thương Hiệu</label>
        <div class="col-md-12">
          <input type="text" class="form-control" id="update-brand" value="${toy.brand}">
        </div>
      </div>
       <div class="form-group">
        <label for="update-origin" class="control-label col-xs-3">Xuất xứ</label>
        <div class="col-md-12">
          <input type="text" class="form-control" id="update-origin" value="${toy.origin}">
        </div>
      </div>
      <div class="form-group">
        <label for="update-material" class="control-label col-xs-3">Chất Liệu</label>
        <div class="col-md-12">
          <input required type="text" class="form-control" id="update-material" name="update-material" value="${toy.material}">
        </div>
      </div>
      <div class="form-group">
        <label class="control-label">Loại</label>
        <div class="col-md-12" id="typeToy-update">
        </div>
      </div>
      <div class="modal-footer text-center flex items-center gap-2">
        <button type="submit" id="btnSave" class="btn btn-success">Lưu</button>
        <button class="btn btn-danger" data-dismiss="modal">Hủy bỏ</a>
      </div>
      `
            $("#update-toy").html(element);
        },
        error: function(error) {
            console.log(error);
        }
    })
}