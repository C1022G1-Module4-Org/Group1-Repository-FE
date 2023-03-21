
function renderLevelEmployeeList(levelEmployeeList) {
    let elements = "";
    let stt = 1;

    for (let levelEmployee of levelEmployeeList.content) {
        elements += `<tr>
          <td>${stt++}</td>
          <td>${levelEmployee.name}</td>
          </tr>`;
    }
    $("#list-level-employee").html(elements);
}
function getLevelEmployeeList() {
    $.ajax({
        type: "get",
        url: `http://localhost:8080/level-employee`,
        headers: {
            "Content-Type": "application/json",
        },
        success: function (data) {
            renderLevelEmployeeList(data);
        },
        error: function (error) {
            console.log(error);
        },
    });
}
$(document).ready(function () {
    getLevelEmployeeList();
});

$("#add-level-employee").submit(function (event) {
    debugger;
    event.preventDefault();
    let name = $("#name-level-employee").val();
    addLevelEmployee(name);
});

function addLevelEmployee(name) {
    $.ajax({
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        url: `http://localhost:8080/level-employee`,
        type: "post",
        data: JSON.stringify({
            name: name,
        }),
        success: function (data) {
            alert("Thêm loại trình độ thành công!");
            $("#addLevelEmployee").hide();
            $("body").removeClass("modal-open");
            $(".modal-backdrop").remove();
            getLevelEmployeeList();
        },
        error: function () {
            alert("Lỗi khi thêm loại trình độ!");
        },
    });
}