$().ready(function() {
    $("#orderNumber").html(localStorage.orderCount);
    $("#lastOrderName").html(localStorage.lastOrderName);
})