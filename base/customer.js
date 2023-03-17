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
function saveCustomer() {
    let name1 = document.getElementById("name1").value;
    let phoneNumber = document.getElementById("phoneNumber").value;
    let address = document.getElementById("address").value;
    let customerType = document.getElementById("customerType").value;
    var objectJson={"name1": name1,
        "phoneNumber":phoneNumber,
        "address":address,
        "customerType":customerType}
    $.ajax({
        type: "POST", url: `http://localhost:8080/customers`,
        data : JSON.stringify(objectJson),

        headers: {
            "Content-Type": "application/json",
        }, success: alert("thanh cong"),

        error: function (error) {
            console.log(error);
        }
    })
    console.log(objectJson);

};



