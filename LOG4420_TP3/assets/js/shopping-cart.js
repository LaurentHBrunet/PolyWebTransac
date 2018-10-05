var products = []
var totalPrice = 0;
$(document).ready(function () {
    $.ajax({
        url: "http://localhost:8000/data/products.json"
    }).done(function (data) {
        showShoppingCart(data);
        updateCartBadge();
        // Button Listeners
        $("#remove-all-items-button").click(function () {
            var doDelete = confirm("Voulez-vous supprimer tous les produits du panier?");
            if (doDelete) {
                emptyCart();
                showShoppingCart();
                updateCartBadge();
            }
        });
    });

});

function showShoppingCart(data) {
    products = data;
    var cart = getCart();
    // TODO sort cart
    if (cart != null) {
        $(".shopping-cart-table").removeClass("invisible");
        $(".shopping-cart-footer").removeClass("invisible");
        $.each(cart, function (key, value) {
            var product = products.find(x => x.id == key);
            var row = $("<tr></tr>");
            row.attr('id', product.id);
            var xColumn = newTd().append("<button>X</button>");
            row.append(xColumn);
            // link
            row.append(newLink(product));
            // price
            var priceColumn = newTd();
            priceColumn.addClass("price");
            priceColumn.text(product.price);
            row.append(priceColumn);
            // quantity
            row.append(newQuantityColumn(value));
            // total
            totalPrice += parseInt(value * product.price);
            row.append("<td id=\"total-amount\")>" + parseInt(value * product.price) + " $</td>")
            $(".shopping-cart-table").append(row);
        });
        $("tr").last().addClass("table-footer");
        updateTotalPrice(totalPrice);
    } else {
        $(".shopping-cart-table").addClass("invisible");
        $(".shopping-cart-footer").addClass("invisible");
        $("<p>Aucun produit dans le panier.</p>").insertBefore(".shopping-cart-table");
    }
}

function newTd() {
    return $("<td></td>");
}

function newLink(product) {
    var link = $("<a href=\"product.html?id=" + product.id + "\">" + product.name + "</a>");
    var td = newTd();
    td.append(link);
    return td;
}

function newQuantityColumn(quantity) {
    return $("<td><button>-</button>" + quantity + "<button>+</button></td>");
}

function updateTotalPrice(total) {
    $(".shopping-cart-total").html("Total: <strong>" + total + " $</strong>");
}