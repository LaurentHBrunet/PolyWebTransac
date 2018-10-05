var products = [];
var filteredObjects = [];
var sortBy = "price-ascending";

$.ajax({
    url: "http://localhost:8000/data/products.json"
}).done(function( data ) {
    products = data;
    filteredObjects = products;
    showData(filteredObjects);
});


// Category click listeners
$("#product-categories").children("button").click(function() {
    $("#product-categories").children("button").removeClass("selected")
    $(this).addClass("selected");
    filterCategory(this.value);
  });

// Sorting click listeners
$("#product-criteria").children("button").click(function() {
    $("#product-criteria").children("button").removeClass("selected")
    $(this).addClass("selected");
    sortBy = this.value;
    showData(filteredObjects);
  });

// Clicking on product listener
$("a").click(function() {
    fetch('localhost:8000/product', { qs: { a: 1, b: 2 } })
});

function filterCategory(filter) {
    if (filter == "all") {
        filteredObjects = products
    } else {
        //$("#products-list").empty()
        filteredObjects = products.slice().filter(function( obj ) {
            return obj.category == filter
          });
        }
        showData(filteredObjects);
  }

function showData(data) {
    data = sortData(data)
    $("#products-list").empty()
    updateProductCount(data)
    $.each( data, function( key, value ) {
    var $link = $("<a href=\"product.html?id=" + value.id + "\" class=\"hover-gray flex-vertical product-container\"></a>");
    $link.append("<h2>" + value.name + "</h2>")
    .append("<img src=\"assets/img/" + value.image + "\" alt=\"apple-tv\">")
    .append("<p>" + value.price + "</p>");
    $("#products-list").append($link);
      });
}

function sortData(data) {
    switch(sortBy) {
        case "price-descending": {
            return data.sort(function(a, b){return b.price-a.price});
        }
        case "price-ascending": {
            return data.sort(function(a, b){return a.price-b.price});
        }
        case "name-ascending": {
            return data.sort(function(a, b){return ((a.name < b.name) ? -1 : ((a.name > b.name) ? 1 : 0));});
        }
        case "name-descending": {
            return data.sort(function(a, b){return ((b.name < a.name) ? -1 : ((b.name > a.name) ? 1 : 0));});
        }
    }
}

function updateProductCount(products) {
    $("#products-count").text(products.length + " produits")
}