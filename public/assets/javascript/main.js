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

// var days = getDaysArray(2018, 7)

// console.log(days);



// function getDaysArray(year, month) {
//     const names = Object.freeze(
//         ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']);
//     const date = new Date(year, month - 1, 1);
//     const result = [];
//     while (date.getMonth() == month - 1) {
//         result.push(`${date.getDate()}-${names[date.getDay()]}`);
//         date.setDate(date.getDate() + 1);
//     }
//     return result;
// }
