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
    var arrayIds = new Array();

    //Sort cart
    for (var id in cart) {
        arrayIds.push(id);
    }

    arrayIds.sort(function(id1, id2) {
        if (products.find(x => x.id == id1).name < products.find(x => x.id == id2).name) {
            return -1;
        }
        if (products.find(x => x.id == id1).name > products.find(x => x.id == id2).name) {
            return 1;
        }
        return 0;
    });

    if (cart != null) {
        $(".shopping-cart-table").removeClass("invisible");
        $(".shopping-cart-footer").removeClass("invisible");

        $.each(arrayIds, function(index, productId) {
            var product = products.find(x => x.id == productId);
            var productQuantity = cart[productId];

            var row = $("<tr></tr>");
            row.attr('id', product.id);
            
            //remove all items button
            var xColumn = newTd().append("<button>X</button>");
            $(xColumn).find("button").addClass("remove-item-button");
            row.append(xColumn);
            setupRemoveItemButton(row, productId);

            // link
            row.append(newLink(product));
            // price
            var priceColumn = newTd();
            priceColumn.addClass("unit-price");
            priceColumn.text(product.price.toString().replace(".", ",") + "$");;
            row.append(priceColumn);
            // quantity
            var quantityColumn = newQuantityColumn(productQuantity );
            row.append(quantityColumn);
            setupQuantityColumnButtons(row, productId); 

            // total
            totalPrice += parseInt(productQuantity * product.price);
            row.append("<td class=\"price\")>" + parseFloat(productQuantity * product.price).toFixed(2).replace(".",",") + "$</td>")
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
    return $("<td><button class=\"remove-quantity-button\">-</button>" + "<span class=\"quantity\">" +  quantity + "</span><button class=\"add-quantity-button\">+</button></td>");
}

function updateTotalPrice(total) {
    var cart = getCart();
    var totalPrice = 0;
    $.each(cart, function (key, value) {
        var product = products.find(x => x.id == key);
        totalPrice += value * product.price;
    });
    
    $(".shopping-cart-total").html("Total: <strong id=\"total-amount\">" + totalPrice.toFixed(2).toString().replace(".",",") + "</strong>");
}

function setupRemoveItemButton(row, productId) {
    $(row).find(".remove-item-button").click( () => {
        if (confirm("Voulez-vous supprimer le produit du panier?")) {
            var cart = getCart();
            delete cart[productId];
            localStorage.setItem(CART,JSON.stringify(cart));
            updateTotalPrice();
            updateCartBadge();
            $(row).remove();

            if (Object.keys(cart).length == 0) {
                emptyCart();
                $(".shopping-cart-table").addClass("invisible");
                $(".shopping-cart-footer").addClass("invisible");
                $("<p>Aucun produit dans le panier.</p>").insertBefore(".shopping-cart-table");
            }
        }
    });
}

function setupQuantityColumnButtons(row, cartProductKey) {
    var cart = getCart();
    if (cart[cartProductKey] == 1) {
        $(row).find(".remove-quantity-button").attr("disabled", true);
    }

    $(row).find(".remove-quantity-button").click( () => {
        var cart = getCart();
        let newProductQuantity = cart[cartProductKey] - 1;
        cart[cartProductKey] = newProductQuantity;
        localStorage.setItem(CART,JSON.stringify(cart));

        updateProductQuantity(row, newProductQuantity, cartProductKey);
    });

    $(row).find(".add-quantity-button").click( () => {
        var cart = getCart();
        let newProductQuantity = parseInt(cart[cartProductKey]) + 1;
        cart[cartProductKey] = newProductQuantity;
        localStorage.setItem(CART,JSON.stringify(cart));

        updateProductQuantity(row, newProductQuantity, cartProductKey);
    });
}

function updateProductQuantity(row, newProductQuantity, productKey) {
    $(row).find(".quantity").html(newProductQuantity);

    if (newProductQuantity == 1) {
        $(row).find(".remove-quantity-button").attr("disabled", true);
    } else {
        $(row).find(".remove-quantity-button").attr("disabled", false);
    }

    let updatedProductPrice = products.find(x => x.id == productKey).price * newProductQuantity;
    $(row).find(".price").html(updatedProductPrice.toFixed(2).toString().replace(".",",") + "$");
    updateTotalPrice();
    updateCartBadge();
}
