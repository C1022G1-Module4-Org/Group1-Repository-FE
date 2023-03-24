function movePage(page) {
    getEmployeeList(page);
}

function renderPage(employeeList) {
    let pageable = "";
    if (
        employeeList.number <= employeeList.totalPages - 1 &&
        employeeList.number > 0
    ) {
        pageable += `
    <button class="page-item btn btn-dark btn-sm" 
    onclick="movePage(${employeeList.number - 1})">
    Previous
    </button>
    `;
    }
    for (let i = 1; i <= employeeList.totalPages; i++) {
        let pageItem = $(`<button class="page-item number btn btn-dark btn-sm"
                      onclick="movePage(${i - 1})">
                      ${i}
                      </button>`);
        if (i === employeeList.number + 1) {
            pageItem.addClass("active1");
        } else {
            pageItem.removeClass("active1");
        }
        pageable += pageItem.prop("outerHTML");
    }

    if (employeeList.number >= 0 && employeeList.number < employeeList.totalPages - 1) {
        pageable += `
    <button class="page-item btn btn-dark btn-sm" 
    onclick="movePage(${employeeList.number + 1})">
    Next
    </button>
    `;
    }
    $("#pagination").html(pageable);
}

function getEmployeeIdAndName(id, name) {
    document.getElementById("deleteId").value = id;
    document.getElementById("deleteName").innerText = name;
}

// list
function renderEmployeeList(employeeList) {
    debugger;
    let elements = "";
    let stt = (employeeList.number)*employeeList.size + 1;
        for (let employee of employeeList.content) {
            elements += `<tr>
          <td>${stt++}</td>
          <td>${employee.name}</td>
          <td>${employee.dateOfBirth}</td>
          <td>${employee.gender}</td>
          <td>${employee.address}</td>
          <td>${employee.phoneNumber}</td>
          <td>${employee.levelEmployeeDTO.name}</td>
          <td>
                        <button class="btn btn-primary btn-sm edit" type="button" title="Sửa" 
                id="show-emp" data-toggle="modal" data-target="#update"
                onclick="getEmployeeInfo(${employee.id})">Sửa
            </button>
</td>
          <td>  
              <button type="button"
                class="btn btn-danger btn-sm"
                data-toggle="modal" data-target="#exampleModal"
                onclick="getEmployeeIdAndName(${employee.id}, '${employee.name}')"> Xoá
              </button>
          </td>
          </tr>`;
    }
    $("#list-employee").html(elements);
}
function getEmployeeList(page) {
    let search = $("#search").val();
    $.ajax({
        type: "get",
        url: `http://localhost:8080/employee?name=${search}&page=${
            page ? page : "0"
        }`,
        headers: {
            "Content-Type": "application/json",
        },
        success: function (data) {
            console.log(data)
            if (data.totalElements === 0){
                document.getElementById("listNull").innerHTML = "Danh sách rỗng";
            }else {
                document.getElementById("listNull").innerHTML = "";
            }
            renderEmployeeList(data);
            renderPage(data);
        },
        error: function (error) {
            console.log(error);
        },
    });
}

$(document).ready(function () {
    getEmployeeList();
});

// delete
$("#delete-employee").submit(function (event) {
    event.preventDefault();
    let id = $("#deleteId").val();
    deleteEmployee(id);
});

function deleteEmployee(id) {
    $.ajax({
        type: "delete",
        url: `http://localhost:8080/employee/${id}`,
        success: function (data) {
            console.log("Xóa thành công");
            $("#exampleModal").hide();
            $("body").removeClass("modal-open");
            $(".modal-backdrop").remove();
            getEmployeeList();
        },
        error: function (error) {
            console.log("Lỗi, không xóa được");
        },
    });
}

// add
$("#add-employee").submit(function (event) {
    debugger;
    event.preventDefault();
    let name = $("#name").val();
    let dateOfBirth = $("#date").val();
    let gender = $("#gender").val();
    let address = $("#address").val();
    let phoneNumber = $("#phoneNumber").val();
    let levelEmployeeDTO = $("#level-employee").val();
    addEmployee(name, dateOfBirth, gender, address, phoneNumber, levelEmployeeDTO);
});

function addEmployee(name, dateOfBirth, gender, address, phoneNumber, levelEmployeeDTO) {
    let mes = "";
    $.ajax({
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        url: `http://localhost:8080/employee`,
        type: "post",
        data: JSON.stringify({
            name: name,
            dateOfBirth: dateOfBirth,
            gender: gender,
            address: address,
            phoneNumber: phoneNumber,
            levelEmployeeDTO: {id: levelEmployeeDTO},
        }),
        success: function (data) {
            alert("Thêm nhân viên thành công!");
            $("#addEmployee").hide();
            $("body").removeClass("modal-open");
            $(".modal-backdrop").remove();
            getEmployeeList();
        },
        error: function (data) {
            debugger;
            console.log(Object.keys(data.responseJSON))
            for (let key of Object.keys(data.responseJSON)) {
                const cusKey = `${key[0].toUpperCase()}${key.substring(1)}`;
                if (document.getElementById(`add${cusKey}Valid`)) {
                    document.getElementById(`add${cusKey}Valid`).innerText = data.responseJSON[key] ?? '';
                }
            }
        },
    })
}

function getSelectLevelEmployeeList() {
    $.ajax({
        type: "GET",
        url: `http://localhost:8080/level-employee?name=${""}`,
        headers: {
            "Content-Type": "application/json",
        },
        success: function (data) {
            showLevelEmployeeSelectOption(data);
            showLevelEmployeeSelectOptionCreate(data)
        },
        error: function (error) {
            console.log(error);
        },
    });
}

function showLevelEmployeeSelectOptionCreate(levelEmployees) {
    let element = "";
    element += `
  <select class="form-control" id="level-employee" name="level-employee">`;

    for (let levelEmployee of levelEmployees) {
        element += `<option value="${levelEmployee.id}">`;
        element += levelEmployee.name;
        `</option>`;
    }

    `</select>`;
    $("#levelEmployeeDTO").html(element);
}

function showLevelEmployeeSelectOption(levelEmployees) {
    let element = "";
    element += `
  <select class="form-control" id="level-employee-update" name="level-employee">`;
    for (let levelEmployee of levelEmployees) {
        element += `<option value="${levelEmployee.id}">`;
        element += levelEmployee.name;
        `</option>`;
    }
    `</select>`;
    $("#level-employeeDTO").html(element);
}

$(document).ready(function () {
    getSelectLevelEmployeeList();
});

//UPDATE
$("#update-performing").submit(function (event) {
    event.preventDefault();
    let id = $("#update-id").val();
    let name = $("#update-name").val();
    let dateOfBirth = $("#update-dateOfBirth").val();
    let gender = $("#update-gender").val();
    let address = $("#update-address").val();
    let phoneNumber = $("#update-phoneNumber").val();
    let levelEmployeeDTO = $("#level-employee-update").val();
    updateEmployee(id, name, dateOfBirth, gender, address, phoneNumber, levelEmployeeDTO);
})

function updateEmployee(id, name, dateOfBirth, gender, address, phoneNumber, levelEmployeeDTO) {
    debugger
    $.ajax({
        type: "PUT",
        url: `http://localhost:8080/employee/edit/${id}`,
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        data: JSON.stringify({
            id: id,
            name: name,
            dateOfBirth: dateOfBirth,
            gender: gender,
            address: address,
            phoneNumber: phoneNumber,
            levelEmployeeDTO: {id: levelEmployeeDTO},
        }),
        success: function (data) {
            alert("Sửa thông tin nhân viên thành công!");
            $("#update").hide();
            $("body").removeClass("modal-open");
            $(".modal-backdrop").remove();
            getEmployeeList();
        },
        error: function () {
            alert("Lỗi khi sửa thông tin nhân viên!");
        },
    })
}

function getEmployeeInfo(id) {
    $.ajax({
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        type: "get",
        url: `http://localhost:8080/employee/detail/${id}`,
        success: function (data) {
            getSelectLevelEmployeeList();
            let element = "";
            let employee = data;
            element +=
                `
      <div class="form-group">
        <div id="thongbao" class="text-danger" style="text-align: center;"></div>
      </div>
      <div class="form-group">
        <input type="hidden" id="update-id" value="${employee.id}">
      </div>
      <div class="form-group">
        <label for="update-name" class="control-label col-xs-3">Tên nhân viên</label>
        <div class="col-md-12">
          <input type="text" class="form-control" id="update-name" value="${employee.name}">
        </div>
      </div>
      <div class="form-group">
        <label for="update-dateOfBirth" class="control-label col-xs-3">Ngày sinh</label>
        <div class="col-md-12">
          <input type="date" class="form-control" id="update-dateOfBirth" value="${employee.dateOfBirth}">
        </div>
      </div>
      <div class="form-group">
        <label for="update-gender" class="control-label col-xs-3">Giới tính</label>
        <div class="col-md-12">
          <select name="" id="update-gender">
          <option value="Nam">Nam</option>
          <option value="Nữ">Nữ</option>
</select>
        </div>
      </div>
          <div class="form-group">
        <label for="update-address" class="control-label col-xs-3">Địa chỉ</label>
        <div class="col-md-12">
          <input type="text" class="form-control" id="update-address" value="${employee.address}">
        </div>
      </div>
                <div class="form-group">
        <label for="update-phoneNumber" class="control-label col-xs-3">Số điện thoại</label>
        <div class="col-md-12">
          <input type="text" class="form-control" id="update-phoneNumber" value="${employee.phoneNumber}">
        </div>
      </div>
       <div class="form-group">
        <label class="control-label">Trình độ</label>
        <div class="col-md-12" id="level-employeeDTO">
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