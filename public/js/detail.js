$(".ingre-box").change(function(){
    if ($('.ingre-box:checked').length == $('.ingre-box').length) {
       document.getElementById("complete-ingre").style.visibility = "visible";
    }
    else {
        document.getElementById("complete-ingre").style.visibility = "hidden";
    }
});

$("#ingre-all").click(function(){
    $("input[type=checkbox].ingre-box").prop('checked', $(this).prop('checked'));
});


$("#complete-step").click(function() {
    var complete_step = document.getElementById("complete-all-step");
    if(complete_step.style.visibility == "hidden") {
        complete_step.style.visibility = "visible";
        var but_complete = document.querySelector("#complete-step");
        but_complete.className = "btn btn-secondary";
    }
    else {
        complete_step.style.visibility = "hidden";
        var but_complete = document.querySelector("#complete-step");
        but_complete.className = "btn btn-success";
    }
});

$("#save-icon").click(function() {
    var save_icon = document.querySelector("i#save");
    var save_status = document.querySelector("span#save-status");
    if(save_icon.className == "fa fa-bookmark-o") {
        save_icon.className = "fa fa-bookmark";
        save_status.innerHTML = "You have saved this recipe."
    } else {
        save_icon.className = "fa fa-bookmark-o";
        save_status.innerHTML = "Save this recipe!"
    }
})