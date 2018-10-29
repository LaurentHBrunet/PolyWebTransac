$().ready(function() {
    $("#confirmation-number").html(localStorage.orderCount);
    $("#name").html(localStorage.lastOrderName);
})