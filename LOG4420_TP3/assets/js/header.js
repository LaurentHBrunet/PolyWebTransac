const CART = "cart";

$(document).ready(function() {
    updateCartBadge();
});


function updateCartBadge() {
    var cart = getCart();
    if (cart != null) {
        // $("#count").addClass("count");
        $("#count").removeClass("invisible");
        // $("#count").removeAttr("hidden");
        var total = 0;
        $.each(cart, function(key, value) {
            total += parseInt(value);
            });
        if (total > 99) {
            $(".shopping-cart > .count").text("99+");
        } else {
            $(".shopping-cart > .count").text(total);
        }
    } else {
        // Hide cart badge
        $("#count").addClass("invisible");
        // $("#count").addAttr("hidden");
        // $("#count").text("");

        // $("#count").removeClass("count");
    }
}

function getCart() {
    return JSON.parse(localStorage.getItem(CART))
}

function emptyCart() {
    localStorage.removeItem(CART);
    updateCartBadge();
}

