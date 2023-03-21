function movePage(nextPage) {
    loadPromotion(nextPage);
}

function renderPage(promotions) {
    let page = "";
    if (promotions.number == promotions.totalPages - 1 && promotions.number > 0) {
        page += `
    <button class="page-item btn btn-primary " 
    onclick="movePage(${promotions.number - 1})">
    <i class="ti-angle-left"></i>
    </button>
    `
    }
    for (let i = 1; i <= promotions.totalPages; i++) {
        let pageItem = $(`<button class="page-item number btn btn-primary"
                      onclick="movePage(${i - 1})">
                      ${i}
                      </button>`);
        if (i === promotions.number + 1) {
            pageItem.addClass("active");
        } else {
            pageItem.removeClass("active");
        }
        page += pageItem.prop('outerHTML');
    }

    if (promotions.number == 0 && promotions.number < promotions.totalPages) {
        page += `
    <button class="page-item btn btn-primary" 
    onclick="movePage(${promotions.number + 1})">
    <i class="ti-angle-right"></i>
    </button>
    `
    }
    $("#paging").html(page);
}

// List
// -danh sách sản phẩm cần được render lên browser
function renderPromotion(promotions) {
    let stt = 1;
    let elements = "";
    for (let promotion of promotions) {
        elements +=
            `<tr>
        <td >${stt++}</td>
        <td >${promotion.name}</td>
        <td >${promotion.startDay}</td>
        <td >${promotion.endDay}</td>
         <td >${promotion.discount}</td>
        <td >${promotion.promotionTypeDto.name}</td>
        <td>
        <button class="btn btn-primary btn-sm edit" type="button" title="update" 
                id="show-emp" data-toggle="modal" data-target="#update"
                onclick="getPromotionInfoUpdate(${promotion.id})">
                Update
            </button>
            </td>
        <td>
        <button type="button"
                className="btn btn-danger"
                data-toggle="modal" data-target="#exampleModal"
                onclick="getPromotionInfo(${promotion.id}, '${promotion.name}')">
            Xóa
        </button>
        </td>
    </tr>`;

        // hiện tại đươc hiển thị trên browser
        $("#listPromotions").html(elements);
    }

}

function loadPromotion(page) {
    let search = document.getElementById("idSearch").value;
    $.ajax({
        type: "GET", url: `http://localhost:8080/promotion?page=${page ? page : "0"}&name=` + search,
        headers: {

            "Content-Type": "application/json",
        }, success: function (data) {
            renderPromotion(data.content);
            renderPage(data);
        }, error: function (error) {
            console.log(error);
        }
    })

};
$(document).ready(function () {
    loadPromotion();
});


// Delete
function getPromotionInfo(id, name) {
    document.getElementById("deleteId").value = id;
    document.getElementById("deleteName").innerText = name;
}

$("#delete-promotion").submit(function (event) {

    event.preventDefault();
    let id = $("#deleteId").val();
    deletePromotion(id);
});

function deletePromotion(id) {

    $.ajax({
        type: "delete",
        url: `http://localhost:8080/promotion/${id}`,
        success: function (data) {
            console.log("Delete Success");
            loadPromotion();

            $('#exampleModal').hide();
            $('body').removeClass('modal-open');
            $('.modal-backdrop').remove();
        },
        error: function (error) {
            console.log("Erorr!");
        },
    });
}

// add
$("#addPromotionForm").submit(function (event) {

    event.preventDefault();
    let name = $('#name1').val();
    let startday = $('#startDay').val();
    let endDay = $("#endDay").val();
    let discount = $("#discount").val();
    let promotionTypeDTO = $("#category").val();
    savePromotion(name, startday, endDay, discount, promotionTypeDTO);
});

function savePromotion(name, startday, endDay, discount, promotionTypeDTO) {

    $.ajax({
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        url: `http://localhost:8080/promotion`,
        type: 'POST',
        data: JSON.stringify({
            name: name,
            startday: startday,
            endDay: endDay,
            discount: discount,
            promotionTypeDTO: {id: promotionTypeDTO},
        }),
        success: function (data) {
            alert("add promotion success!");
            $('#addPromotion').hide();
            $('body').removeClass('modal-open');
            $('.modal-backdrop').remove();
        },
        error: function () {
            alert("Error!");
        },
    })
}

function getSelectPromotionTypeList() {
    $.ajax({
        type: "GET",
        url: `http://localhost:8080/promotion-type`,
        headers: {
            "Content-Type": "application/json",
        },
        success: function (data) {
            showPromotionTypeSelectOption(data);
        },
        error: function (error) {
            console.log(error);
        },
    });
}

function showPromotionTypeSelectOption(promotionTypes) {
    let element = "";
    element += `
  <select class="form-control" id="category" name="category">
  `

    for (let promotionType of promotionTypes) {
        element += `<option value="${promotionType.name}">`
        element += promotionType.name;
        `</option>`
    }

    `</select>`;
    $("#promotionType").html(element);
    $("#promotion-typeDTO").html(element);
}

$(document).ready(function () {
    getSelectPromotionTypeList();
});
// update
$("#update-promotion").submit(function (event) {
    debugger
    event.preventDefault();
    let id = $("#update-id").val();
    let name = $('#update-name').val();
    let startday = $('#update-startDay').val();
    let endday = $("#update-endDay").val();
    let discount = $("#update-discount").val();
    let promotionTypeDTO = $("#category").val();
    updatePromotion(id, name, startday, endday, discount, promotionTypeDTO);
})

function updatePromotion(id, name, startday, endday, discount, promotionTypeDTO) {

    $.ajax({
        type: "PUT",
        url: `http://localhost:8080/promotion/${id}`,
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        data: JSON.stringify({
            id: id,
            name: name,
            startday: startday,
            endday: endday,
            discount: discount,
            promotionTypeDTO: {id: promotionTypeDTO},
        }),
        success: function (data) {
            alert("Edit success!");
            $("#update").hide();
            $("body").removeClass("modal-open");
            $(".modal-backdrop").remove();
            loadPromotion();
        },
        error: function () {
            alert("Erorr!");
        },
    })
}

function getPromotionInfoUpdate(id) {
    $.ajax({
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        type: "get",
        url: `http://localhost:8080/promotion/${id}`,
        success: function (data) {
            getSelectPromotionTypeList();
            let element = "";
            let promotion = data;
            element +=
                `
      <div class="form-group">
        <div id="thongbao" class="text-danger" style="text-align: center;"></div>
      </div>
      <div class="form-group">
        <input type="hidden" id="update-id" value="${promotion.id}">
      </div>
      <div class="form-group">
        <label for="update-name" class="control-label col-xs-3">Tên khuyến mãi</label>
        <div class="col-md-12">
          <input type="text" class="form-control" id="update-name" value="${promotion.name}">
        </div>
      </div>
      <div class="form-group">
        <label for="update-startDay" class="control-label col-xs-3">ngày bắt đầu</label>
        <div class="col-md-12">
          <input type="text" class="form-control" id="update-startDay" value="${promotion.startday}">
        </div>
      </div>
      <div class="form-group">
        <label for="update-endDay" class="control-label col-xs-3">ngày kết thúc</label>
        <div class="col-md-12">
          <input required type="text" class="form-control" id="update-endDay" name="update-endDay" value="${promotion.endDay}">
        </div>
      </div>
      <div class="form-group">
        <label for="update-discount" class="control-label col-xs-3">Discount</label>
        <div class="col-md-12">
          <input required type="text" class="form-control" id="update-endDay" name="update-discount" value="${promotion.discount}">
        </div>
      </div>
      <div class="form-group">
        <label class="control-label">Danh mục</label>
        <div class="col-md-12" id="promotion-typeDTO">
        </div>
      </div>
      <div class="modal-footer text-center flex items-center gap-2">
        <button type="submit" id="btnSave" class="btn btn-success">Lưu</button>
        <button class="btn btn-danger" data-dismiss="modal">Hủy bỏ</a>
      </div>
      `
            $("#update-promotion").html(element);
        },
        error: function (error) {
            console.log(error);
        }
    })
}