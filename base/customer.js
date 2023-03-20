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
    let name1 = $('#name1').val();
    let phoneNumber = $('#phoneNumber').val();
    let address = $("#address").val();
    let customerTypeDTO = $("#customerTypeDTO").val();
    saveCustomer(name1, phoneNumber, address, customerTypeDTO);
});

function saveCustomer (name1, phoneNumber, address, customerTypeDTO) {
    debugger
    $.ajax ({
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        url: `http://localhost:8080/customers`,
        type: 'post',
        data: JSON.stringify({
            name1: name1,
            phoneNumber: phoneNumber,
            address: address,
            customerTypeDTO: {id:customerTypeDTO},
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
  <option>-- Chọn danh mục --</option>`

    for (let customerType of customerTypes) {
        element += `<option value="${customerType.id}">`
        element +=customerType.name ;
        `</option>`
    }

    `</select>`;
    $("#customerTypeDTO").html(element);
}

$(document).ready(function () {
    getSelectCustomerTypeList();
});

