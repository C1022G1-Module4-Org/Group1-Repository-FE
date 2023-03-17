showList();

function showList(){
    $.ajax({
        type: "GET",
        dataType: "json",
        url: "http://localhost:8080/home/blog",
        success: function (data){
            console.log(data);
            let element = '';
            for (let i = 0; i < data.length; i++) {
                element += `<tr>`
                element += `<th scope="row">${i+1}</th>`
                element += `<td>${data[i].content}</td>`
                element += `<td>${data[i].title}</td>`
                element += `<td>${data[i].author}</td>`
                element += `<td>${data[i].category}</td>`
                element += `</tr>`

                // element += `
                //     <div class="card shadow" style="width: 18rem;">
                //         <img src="https://image.winudf.com/v2/image/Y29tLnN0eWxlLmtpZHNoYWlyc3R5bGVfc2NyZWVuXzJfa213YXk0Mjk/screen-2.jpg?fakeurl=1&type=.jpg" alt="">
                //         <div class="card-body">
                //             <h5 class="card-title">${data.content}</h5>
                //             <p class="card-text">${data.author}</p>
                //         </div>
                //     </div>
                // `
            }
            $('#blogList').html(element);
        }
    })
}
