var product = [];

$.urlParam = function(name) {
    return new RegExp('[?&]' + name + '=[0-9a-zA-Z]*').exec(window.location.href)[0].split("=")[1];
}

$(document).ready(function() {
    $.ajax({
        url: "http://localhost:8000/data/products.json"
    }).done(function( data ) {
        var id = $.urlParam('id');
         product = data.filter(function( obj ) {
            return obj.id == id;
          })[0];
        if (product != null) {
            // Display Product

            $("#product-name").text(product.name);
            $("#product-image").attr("src", "assets/img/" + product.image)
            $("#product-desc").append(product.description);
            $.each( product.features, function( key, value ) {
                $("#product-features").append("<li>" + value + "</li>");
            });
            $("#product-price").append("Prix: <strong>" + product.price + "</strong>");
        } else {
            // Show Error Message
            $("main").empty();
            $("main").append("<h1>Page Non Trouvée</h1>");
        }
    });

    // Bind form to action
    $("#add-to-cart-form").submit(function(event) {
        event.preventDefault();
        var cart = getCart();
        if (cart){
            if (cart[product.id] == null) {
                cart[product.id] = 0;
            }
            cart[product.id] = parseInt(cart[product.id]) +  parseInt($("#quantity").val());
        } else {
            cart = {};
            cart[product.id] = $("#quantity").val();
        }
        localStorage.setItem(CART,JSON.stringify(cart));
        updateCartBadge();
        alert(localStorage.getItem(CART));
    });
})
