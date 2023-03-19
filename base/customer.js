// phân trang
function movePage(nextPage) {
    loadCustomer(nextPage);
}

function renderPage(customers) {
    let page = "";
    if (customers.number == customers.totalPages - 1 && customers.number > 0) {
        page += `
    <button class="page-item btn btn-primary" 
    onclick="movePage(${customers.number - 1})">
    <i class="ti-angle-left"></i>
    </button>
    `
    }
    for (let i = 1; i <= customers.totalPages; i++) {
        let pageItem = $(`<button class="page-item number btn btn-primary"
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
    <button class="page-item btn btn-primary" 
    onclick="movePage(${customers.number + 1})">
    <i class="ti-angle-right"></i>
    </button>
    `
    }
    $("#paging").html(page);
}
// List
// - customers: danh sách sản phẩm cần được render lên browser
function renderCustomers(customers) {
    let elements = "";
    for (let customer of customers) {
        elements +=
            `<tr>
        <td >${customer.id}</td>
        <td >${customer.name}</td>
        <td >${customer.address}</td>
        <td >${customer.phoneNumber}</td>
        <td >${customer.customerTypeDTO.name}</td>
        <td><button class="btn btn-primary btn-sm edit" type="button" title="Sửa" 
                id="show-emp" data-toggle="modal" data-target="#update"
                onclick="getCustomerInfo(${customer.id})">
                <i class="fas fa-edit"></i>
            </button></td>
        <td>
        <button type="button"
                className="btn btn-danger"
                data-toggle="modal" data-target="#exampleModal"
                onClick="getCustomerInfo(${customer.id}, '${customer.name}')">
            Xóa
        </button>
        </td>
    </tr>`;
        // hiện tại đươc hiển thị trên browser
        $("#listCustomers").html(elements);
    }
}

function loadCustomer(page) {
    let search = document.getElementById("name").value;
    $.ajax({
        type: "GET", url: `http://localhost:8080/customers?page=${page ? page : "0"}&name=` + search,
        headers: {

            "Content-Type": "application/json",
        }, success: function (data) {
            renderCustomers(data.content);
            renderPage(data);
        }, error: function (error) {
            console.log(error);
        }
    })

};
$(document).ready(function () {
    loadCustomer();
});


// Delete
function getCustomerInfo(id,name) {
    document.getElementById("deleteId").value = id;
    document.getElementById("deleteName").innerText = "Xóa Customer " + name;
}

$("#delete-customer").submit(function (event) {
    event.preventDefault();
    let id = $("#deleteId").val();
    deleteCustomer(id);
});

function deleteCustomer(id) {
    $.ajax({
        type: "delete",
        url: `http://localhost:8080/customers/${id}`,
        success: function (data) {
            console.log("Xóa thành công");
            loadCustomer();

            $('#exampleModal').hide();
            $('body').removeClass('modal-open');
            $('.modal-backdrop').remove();
        },
        error: function (error) {
            console.log("Lỗi, không xóa được");
        },
    });
}

// add
$("#addCustomerForm").submit(function (event) {
    debugger
    event.preventDefault();
    let name = $('#name1').val();
    let phoneNumber = $('#phoneNumber').val();
    let address = $("#address").val();
    let customerTypeDTO = $("#category").val();
    saveCustomer(name, phoneNumber, address, customerTypeDTO);
});

function saveCustomer (name, phoneNumber, address, customerTypeDTO) {
    debugger
    $.ajax ({
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        url: `http://localhost:8080/customers`,
        type: 'POST',
        data: JSON.stringify({
            name: name,
            phoneNumber: phoneNumber,
            address: address,
            customerTypeDTO: {name:customerTypeDTO},
        }),
        success: function (data) {
            alert("Thêm khách hàng thành công!");
            $('#modelId').hide();
            $('body').removeClass('modal-open');
            $('.modal-backdrop').remove();
        },
        error: function () {
            alert("Lỗi khi thêm sản phẩm!");
        },
    })
}

function getSelectCustomerTypeList() {
    $.ajax({
        type: "GET",
        url: `http://localhost:8080/customer-type`,
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
  <select class="form-control" id="category" name="category">
  `

    for (let customerType of customerTypes) {
        element += `<option value="${customerType.name}">`
        element +=customerType.name ;
        `</option>`
    }

    `</select>`;
    $("#customerTypeDTO").html(element);
    $("#customer-typeDTO").html(element);
}

$(document).ready(function () {
    getSelectCustomerTypeList();
});
// update
$("#update-customer").submit(function(event){
    debugger
    event.preventDefault();
    let id = $("#update-id").val();
    let name = $('#update-name').val();
    let phoneNumber = $('#update-phoneNumber').val();
    let address = $("#update-address").val();
    let customerTypeDTO = $("#category").val();
    updateCustomer(id, name, phoneNumber, address, customerTypeDTO);
})

function updateCustomer(id, name, phoneNumber, address, customerTypeDTO) {
    debugger
    $.ajax ({
        type: "PUT",
        url: `http://localhost:8080/customers/${id}`,
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        data: JSON.stringify({
            id: id,
            name: name,
            phoneNumber: phoneNumber,
            address: address,
            customerTypeDTO: { name: customerTypeDTO },
        }),
        success: function (data) {
            alert("Sửa thông tin khách hàng thành công!");
            $("#update").hide();
            $("body").removeClass("modal-open");
            $(".modal-backdrop").remove();
            loadCustomer();
        },
        error: function () {
            alert("Lỗi khi sửa sản phẩm!");
        },
    })
}

function getCustomerInfo(id) {
    $.ajax({
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        type: "get",
        url: `http://localhost:8080/customers/${id}`,
        success: function (data) {
            getSelectCustomerTypeList();
            let element = "";
            let customer = data;
            element +=
                `
      <div class="form-group">
        <div id="thongbao" class="text-danger" style="text-align: center;"></div>
      </div>
      <div class="form-group">
        <input type="hidden" id="update-id" value="${customer.id}">
      </div>
      <div class="form-group">
        <label for="update-name" class="control-label col-xs-3">Tên sản phẩm</label>
        <div class="col-md-12">
          <input type="text" class="form-control" id="update-name" value="${customer.name}">
        </div>
      </div>
      <div class="form-group">
        <label for="update-phoneNumber" class="control-label col-xs-3">Số điện thoại</label>
        <div class="col-md-12">
          <input type="text" class="form-control" id="update-phoneNumber" value="${customer.phoneNumber}">
        </div>
      </div>
      <div class="form-group">
        <label for="update-address" class="control-label col-xs-3">Địa chỉ</label>
        <div class="col-md-12">
          <input required type="text" class="form-control" id="update-address" name="update-address" value="${customer.address}">
        </div>
      </div>
      <div class="form-group">
        <label class="control-label">Danh mục</label>
        <div class="col-md-12" id="customer-typeDTO">
        </div>
      </div>
      <div class="modal-footer text-center flex items-center gap-2">
        <button type="submit" id="btnSave" class="btn btn-success">Lưu</button>
        <button class="btn btn-danger" data-dismiss="modal">Hủy bỏ</a>
      </div>
      `
            $("#update-customer").html(element);
        },
        error: function(error) {
            console.log(error);
        }
    })
}
