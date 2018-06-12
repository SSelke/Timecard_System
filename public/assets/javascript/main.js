//Toggles active class for navbar in admin view
$('a[href="' + this.location.pathname + '"]').addClass('active', function(){
    console.log('a[href="' + this.location.pathname + '"]');
});

$("#delete-employee").click(function(){
    $(this).toggleClass("btn-outline-danger");
    $(".toggle-danger").toggleClass("d-none");
    $(".toggle-danger").toggleClass("visible");
});
