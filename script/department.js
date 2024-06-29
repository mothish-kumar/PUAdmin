//Add Button Function -POST
$(document).ready(function() {
   // Load data from the database
   loadDepartments();

   // Add new department
   $('#addbtn').click(function() {
       var newName = $('#newName').val();
       var newCode = $('#newCode').val();
       var newContact = $('#newContact').val();
       var newEmail = $('#newEmail').val();
       $.ajax({
           url: 'phpScripts/add_department.php',
           type: 'POST',
           data: {
               name: newName,
               code: newCode,
               contact: newContact,
               email: newEmail
           },
           success: function(response) {
               var res = JSON.parse(response);
               if(res.status === "success") {
                   $('#addModal').modal('hide');
                   Swal.fire({
                     toast: true,
                     position: 'top-end',
                     icon: 'success',
                     title: 'Department Added Successfully',
                     showConfirmButton: true,
                     confirmButtonText : 'OK',
                     confirmButtonColor: '#2C3E50',
                     timerProgressBar: false,
                     customClass: {
                         popup: 'swalContainer',
                         title: 'swalTitleSuccess'
                     }
                 }).then((result) => {
                     if (result.isConfirmed) {
                         location.reload();
                     }
                 });
               } else {
                Swal.fire({
                   toast: true,
                   position: 'top-end',
                   icon: 'error',
                   title: res.message,
                   showConfirmButton: false, 
                   timerProgressBar: true,
                   customClass: {
                       popup: 'swalContainer',
                       title: 'swalTitleError'
                   }
               });
               }
           },
           error: function(xhr, status, error) {
            Swal.fire({
               toast: true,
               position: 'top-end',
               icon: 'error',
               title: 'Server Busy Now Try Again Later',
               showConfirmButton: false, 
               timerProgressBar: true,
               customClass: {
                   popup: 'swalContainer',
                   title: 'swalTitleError'
               }
           });
           }
       });
   });
});


//Get Data from Backend -GET
function loadDepartments() {
   $.ajax({
       url: 'phpScripts/get_departments.php',
       type: 'GET',
       success: function(response) {
           if (response.success) {
               var departments = response.data;
               var departmentTable = $('#departmentTable');
               departmentTable.empty();

               $.each(departments, function(index, department) {
                   departmentTable.append(`
                       <tr>
                           <td style="display:none;">${department.id}</td>
                           <td><span>${department.name}</span><input type="text" class="form-control" style="display:none;" value="${department.name}"></td>
                           <td><span>${department.code}</span><input type="text" class="form-control" style="display:none;" value="${department.code}"></td>
                           <td><span>${department.contact}</span><input type="text" class="form-control" style="display:none;" value="${department.contact}"></td>
                           <td><span>${department.email}</span><input type="email" class="form-control" style="display:none;" value="${department.email}"></td>
                           <td><button class="btn btn-info" onclick="editRow(this)">Edit</button><button class="btn btn-primary" style="display:none;" onclick="saveRow(this)">Save</button></td>
                           <td><button class="btn btn-danger" onclick="deleteRow(${department.id})">Delete</button></td>
                       </tr>
                   `);
               });
           } else {
               Swal.fire({
                  toast: true,
                  position: 'top-end',
                  icon: 'error',
                  title: 'Some Error on Loading',
                  showConfirmButton: false, 
                  timerProgressBar: true,
                  customClass: {
                      popup: 'swalContainer',
                      title: 'swalTitleError'
                  }
              });
           }
       },
       error: function(xhr, status, error) {
         Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'error',
            title: 'Server Busy Now Try Again Later',
            showConfirmButton: false, 
            timerProgressBar: true,
            customClass: {
                popup: 'swalContainer',
                title: 'swalTitleError'
            }
        });
       }
   });
}


//Edit function
function editRow(button) {
   var row = $(button).closest('tr');
   row.find('span').hide();
   row.find('input').show();
   row.find('.btn-info').hide();
   row.find('.btn-primary').show();
}

//Updated Data Send to Backend
function saveRow(button) {
   var row = $(button).closest('tr');
   var id = row.find('td:first').text();
   var name = row.find('input').eq(0).val();
   var code = row.find('input').eq(1).val();
   var contact = row.find('input').eq(2).val();
   var email = row.find('input').eq(3).val();

   $.ajax({
       url: 'phpScripts/update_department.php',
       type: 'POST',
       data: {
           id: id,
           name: name,
           code: code,
           contact: contact,
           email: email
       },
       success: function(response) {
           if (response.success) {
            Swal.fire({
               toast: true,
               position: 'top-end',
               icon: 'success',
               title: 'Department Updated Successfully',
               showConfirmButton: true,
               confirmButtonText : 'OK',
               confirmButtonColor: '#2C3E50',
               timerProgressBar: false,
               customClass: {
                   popup: 'swalContainer',
                   title: 'swalTitleSuccess'
               }
           }).then((result) => {
               if (result.isConfirmed) {
                   location.reload();
               }
           });
           } else {
            Swal.fire({
               toast: true,
               position: 'top-end',
               icon: 'error',
               title: 'Error on Updation Please Try Again Later',
               showConfirmButton: false, 
               timerProgressBar: true,
               customClass: {
                   popup: 'swalContainer',
                   title: 'swalTitleError'
               }
           });
           }
       },
       error: function(xhr, status, error) {
         Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'error',
            title: 'Server Busy Now Try Again Later',
            showConfirmButton: false, 
            timerProgressBar: true,
            customClass: {
                popup: 'swalContainer',
                title: 'swalTitleError'
            }
        });
       }
   });
}


// Delete the data function
function deleteRow(id) {
    $.ajax({
        url: 'phpScripts/delete_department.php',
        type: 'POST',
        data: { id: id },
        success: function(response) {
            if (response.success) {
             Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'success',
                title: 'Department Deleted Successfully',
                showConfirmButton: true,
                confirmButtonText : 'OK',
                confirmButtonColor: '#2C3E50',
                timerProgressBar: false,
                customClass: {
                    popup: 'swalContainer',
                    title: 'swalTitleSuccess'
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    location.reload();
                }
            });
            } else {
             Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'error',
                title: 'Error on Deleting Please Try Again Later',
                showConfirmButton: false, 
                timerProgressBar: true,
                customClass: {
                    popup: 'swalContainer',
                    title: 'swalTitleError'
                }
            });
            }
        },
        error: function(xhr, status, error) {
          Swal.fire({
             toast: true,
             position: 'top-end',
             icon: 'error',
             title: 'Server Busy Now Try Again Later',
             showConfirmButton: false, 
             timerProgressBar: true,
             customClass: {
                 popup: 'swalContainer',
                 title: 'swalTitleError'
             }
         });
        }
    });
}
