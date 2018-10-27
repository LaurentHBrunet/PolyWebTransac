$().ready(function() {
    $("#order-form").validate({
        rules: {
            "first-name": {
                required: true,
                minlength: 2
            }, 
            "last-name": {
                required: true,
                minlength: 2
            },
            "email": {
                required: true,
                email: true
            },
            "phone": {
                required: true,
                phoneUS: true
            },
            "credit-card": {
                required: true,
                creditcard: true
            },
            "expiration-date": {
                required: true,
                creditCardExpiration: true 
            }
        },
        messages: {
            "first-name": {
                required: "Ce champ est obligatoire.",
                minlength: "Veuillez fournir au moins 2 caractères." 
            }, 
            "last-name": {
                required: "Ce champ est obligatoire.",
                minlength: "Veuillez fournir au moins 2 caractères." 
            },
            "email": {
                required: "Ce champ est obligatoire.",
                email: "Veuillez fournir une adresse courriel valide."
            },
            "phone": {
                required: "Ce champ est obligatoire.",
                phoneUS: "Veuillez fournir un numéro de téléphone valide."
            },
            "credit-card": {
                required: "Ce champ est obligatoire.",
                creditcard: "Veuillez fournir un numéro de carte de crédit valide."
            },
            "expiration-date": {
                required: "Ce champ est obligatoire."
            }
        }
    });
});

jQuery.validator.addMethod("creditCardExpiration", function(value, element) {
    var pattern =  /^(0[1-9]|1[0-2])\/([0-9][0-9])$/
    return pattern.test(value);
}, "La date d’expiration de votre carte de crédit est invalide.");

$("#order-form").submit(() => {
    if($("#order-form").valid()) {
        emptyCart();

        if (localStorage.orderCount) {
            localStorage.orderCount = Number(localStorage.orderCount) + 1;
        } else {
            localStorage.orderCount = 1;
        }

        localStorage.lastOrderName = $("#first-name").val() +" "+$("#last-name").val();
    }
});





