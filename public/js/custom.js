$('.selectpicker').selectpicker();

$(document).on("click", ".browse", function () {
    var file = $(this).parents().find(".file");
    file.trigger("click");
});
// $('input[type="file"]').change(function (e) {
//     var fileName = e.target.files[0].name;
//     $("#file").val(fileName);

//     var reader = new FileReader();

//     // read the image file as a data URL.
//     reader.readAsDataURL(this.files[0]);
// });

$(document).ready(function() {       
	$('#variations').multiselect({		
		nonSelectedText: 'Select Variation'				
	});
});