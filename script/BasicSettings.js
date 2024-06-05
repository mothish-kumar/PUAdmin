//toggle Button Script
const togglebtn = document.querySelector(".toggle-btn");

togglebtn.addEventListener("click", function () {
  document.querySelector("#sidebar").classList.toggle("expand");
});

//LogOut Script
$(document).ready(function() {
  $('#logoutButton').click(function(e) {
      e.preventDefault(); 
      // Display a SweetAlert notification
      Swal.fire({
          toast: true,
          icon:null,
          iconHtml:'<i class="fa-solid fa-circle-info fa-lg" style="color:#2C3E50;"></i>',
          iconAnimation: 'pop',
          position:'top-end',
          title: 'Are you sure you want to log out?',
          showCancelButton: true,
          confirmButtonText: 'Yes, logout',
          confirmButtonColor: '#2C3E50',
          cancelButtonText: 'Cancel',
          cancelButtonColor: '#2C3E50',
          customClass: {
            popup: 'swalContainer',
            title: 'swalTitle',
        },
      }).then((result) => {
          if (result.isConfirmed) {
              window.location.href = 'Masterlogin.html';
          }
      });
  });
});

//Header Script
   $.ajax({
      url:'phpScripts/BasicSettings.php',
      method:'GET',
      success:function(responce){
         var data = JSON.parse(responce);
         $(document).ready(function(){
            if (data.success){
               $('.hl-1').text(data.headerLine1);  
               $('.hl-2').text(data.headerLine2); 
               $('.hl-3').text(data.headerLine3);  
               $('.li-1').attr('src', data.logoImage1); 
               $('.li-2').attr('src', data.logoImage2); 
            }
         });
      }
         ,
      error: function (xhr, status, error) {
          console.error('AJAX Error:', status, error);
      }
   });


