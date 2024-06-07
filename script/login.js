//Load Header.html
$(function(){
    $('#headerbar').load('./header.html');
});
//login Script
$(document).ready(function() {
   $('#login_btn').click('submit', function(e) {
      e.preventDefault();
       const userid = $('#userid').val().trim();
       const passwd = $('#passwd').val().trim();
       //form validation
       if (userid === "" && passwd === "") {
         // Display warning message for both empty fields using SweetAlert2
         Swal.fire({
             icon: 'warning',
             title: 'Please Enter the User Id and Password',
             timer: 3000, 
             showConfirmButton: false,
             timerProgressBar: true,
             toast: true, 
             position: 'top-end',
             customClass: {
               popup: 'swalContainer',
               title: 'swalTitleError',
           }
         });
         return;
     }
      else if (userid == "" || userid == null) {
         Swal.fire({
             toast: true,
             position: 'top-end',
             icon: 'warning',
             title: ' Please Enter the User Id',
             showConfirmButton: false,
             timer: 3000,
             timerProgressBar: true,
             customClass: {
               popup: 'swalContainer',
               title: 'swalTitleError',
           }
         });
         return;
     } 
     else if (passwd == "" || passwd == null) {
         Swal.fire({
             toast: true,
             position: 'top-end',
             icon: 'warning',
             title: ' Please Enter the Password',
             showConfirmButton: false,
             timer: 3000,
             timerProgressBar: true,
             customClass: {
                popup: 'swalContainer',
                title: 'swalTitleError',
            }
         });
         return;
     }
     //Send To the Backend Server
       $.ajax({
           url: 'phpScripts/login.php',
           type: 'POST',
           data: {
               userid: userid,
               passwd: passwd
           },
           success: function(response) {
            let jsonResponse = JSON.parse(response);

            if (jsonResponse.success) {
               Swal.fire({
                  toast: true,
                  position: 'top-end',
                  icon: 'success',
                  title: 'Login successful...',
                  showConfirmButton: false,
                  timer: 1500,
                  timerProgressBar: true,
                  customClass: {
                     popup: 'swalContainer',
                     title: 'swalTitleSuccess',
                 },
                  didClose: () => {
                      window.location.href = 'BasicSettings.html';
                  }
              });
            } else {
                // Display the error message from the server
                Swal.fire({
                  toast: true,
                  position: 'top-end',
                  icon: 'error',
                  title: jsonResponse.message,
                  showConfirmButton: false,
                  timer: 3000,
                  timerProgressBar: true,
                  customClass: {
                     popup: 'swalContainer',
                     title: 'swalTitleError',
                 }
              });
            }
           },
           error: function(xhr, status, error) {
            Swal.fire({
               toast: true,
               position: 'top-end',
               icon: 'error',
               title: 'Server Are Busy Now Please Try Again: ',
               showConfirmButton: false,
               timer: 3000,
               timerProgressBar: true,
               customClass: {
                  popup: 'swalContainer',
                  title: 'swalTitleError',
              }
           });
           }
       });
   });
});
