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

$(document).ready(() => {
    let url = location.href.replace(/\/$/, "");
   
    if (location.hash) {
      const hash = url.split("#");
      $('#v-pills-tab a[href="#'+hash[1]+'"]').tab("show");
      url = location.href.replace(/\/#/, "#");
      history.replaceState(null, null, url);
      setTimeout(() => {
        $(window).scrollTop(0);
      }, 400);
    } 
     
    $('a[data-bs-toggle="pill"]').on("click", function() {
      let newUrl;
      const hash = $(this).attr("href");
      newUrl = url.split("#")[0] + hash;
      newUrl += "/";
      history.replaceState(null, null, newUrl);
    });
  });