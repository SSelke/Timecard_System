$(document).ready(function(){
    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    var date = new Date();
    var month = date.getMonth();
    var year = date.getFullYear();
    $("#calendar-month-year").html(monthNames[month] + " " + year);
});

