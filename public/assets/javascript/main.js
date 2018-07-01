//Toggles active class for navbar in admin view
$('a[href="' + this.location.pathname + '"]').addClass('active', function(){
    console.log('a[href="' + this.location.pathname + '"]');
});

$("#delete-employee").click(function(){
    $(this).toggleClass("btn-outline-danger");
    $(".toggle-danger").toggleClass("d-none");
    $(".toggle-danger").toggleClass("visible");
});

$("#delete-message").click(function(){
    $(".toggle-danger").toggleClass("d-none");
    $(".toggle-danger").toggleClass("visible");
});


// $(".toggle").click(function () {
//     if ((".showing").length > 0) {
//         $(".showing").each(function () {
//             $(this).removeClass("showing").toggleClass("hidden");
//             $("#message-inbox").click(function () {
//                 $("#message-head").text("Message Inbox");
//                 $(".inbox").toggleClass("showing");
//             });

//             $("#message-sent").click(function () {
//                 $("#message-head").text("Sent Messages");
//                 $(".sent").toggleClass("showing");
//             });

//             $("#message-archived").click(function () {
//                 $("#message-head").text("Archived Messages");
//                 $(".archived").toggleClass("showing");  
//             });
//         });
//     }
// });

