function renderEmployee(employees , append){
    let elements = ``;
    for (let employee of employees){
        elements += `
        <tr>
        <td>${employee.name}</td>
        <td>${employee.dateOfBirth}</td>
        <td>${employee.gender}</td>
        <td>${employee.address}</td>
        <td>${employee.phoneNumber}</td>
        <td>${employee.levelEmployeeDTO.name}</td>
        <td><a href="employee" class="btn btn-sm btn-primary">Edit</a></td>
        <td>
        <button type="button"
                class="btn btn-danger btn-sm"
                data-toggle="modal" data-target="#exampleModal"
                onClick="getCustomerInfo(${employee.id}, '${employee.name}')">
            Delete
        </button>
</td>
</tr>`
    }
    if (append){
        $("#listEmployee").append(elements);
    }else {
        $("#listEmployee").html(elements);
    }
}
function loadEmployee(page, append){
    let name = $("#name").val();
    $.ajax({
        type: "GET",
        url: "http://localhost:8080/employee",
        headers: {
            "Content-Type" : "application/json",
        },
        success: function (data){
            renderEmployee(data.content,append);
        },
        error: function (error){
            console.log(error);
        },
    });
}
$(document).ready(function (){
    loadEmployee();
})

function getEmployeeInfo(id,name){
    document.getElementById("deleteId").value = id;
    document.getElementById("deleteName").innerText = "Xoá employee" + name;
}
$("#delete-blog").submit(function (event){
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
            loadEmployee();

            $('#exampleModal').hide();
            $('body').removeClass('modal-open');
            $('.modal-backdrop').remove();
        },
        error: function (error) {
            console.log("Lỗi, không xóa được");
        },
    });
}