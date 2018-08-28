$(".logout-button").click(function() {
    window.location.href = "logout"
})

$(document).ready(() => {

    $("#uButton").click(() => {
        var tagsA = []
        var sharedA = []

        if ($('form input[type=radio]:checked').val() != '' && $('#input[name=pic]').val() != '' && $("div#tags").children().text() != '' && $("div#shared").children().text() != '' && $("#description").val() != "") {

            $("div#tags").children().each(function(index) {
               if($(this).text()!=''){
                    tagsA.push($(this).text())
               }

            });

            $("div#shared").children().each(function(index) {
                if($(this).text()!=''){
                    sharedA.push($(this).text())
                }
            });

            console.log(tagsA);
            console.log(sharedA);
//                    $.ajax({
//                        type: 'POST',
//                        url: url,
//                        data: postedData,
//                        dataType: 'json',
//                        success: callback
//                    });
//
            $.ajax({
                url: "/addMeme",
                method: "POST",
                data: {
                    tags: tagsA,
                    shared: sharedA
                },
                success: function(result) {
                    if (result === "Success") {
                        alert("Successfully added")
                        //$("div[data-id="+id+"]").remove()
                    } else {
                        alert("Something went wrong")
                    }
                }
            });

            alert('you have successfully uploaded a meme')

        } else {
            alert('something is missing')
        }

        $('input.main-input').attr("placeholder", "@user,something");


        //alert($(mainInput).val())
        //alert($('input[name=visibility]:checked').val();)

        // alert($('#upload').val())
        /*
        if ($('#visibility').val() === '' || $('#tag').val() === ''||$('#sharedUser').val()===0||$('#upload')files.length === 0 ) {
            alert("missing items please fill it out");
        }else if($('#visibility').val() != '' && $('#tags').val() != '' && $('#upload')files.length != 0 ){
             alert("upload successfully ");
        }*/
        $('#uploadModal .close').click();
    })

    $('form input[type=radio]').click(function() {
        if ($(this).val() == "private") {
            $('#sharedUser').css("visibility", "visible")
            $('.sharedLabel').css("visibility", "visible")
        } else {
            $('#sharedUser').css("visibility", "hidden")
            $('.sharedLabel').css("visibility", "hidden")
        }


    })




})
