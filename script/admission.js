//for Active and Inactive Status Button 
document.addEventListener('DOMContentLoaded', function() {
   const toggle = document.getElementById('activeToggle');
   const statusLabel = document.getElementById('statusLabel');

   toggle.addEventListener('change', function() {
     if (this.checked) {
       statusLabel.textContent = 'Active';
     } else {
       statusLabel.textContent = 'Inactive';
     }
   });
 });
 //Notes of active status function
 $(function () {
   $('[data-bs-toggle="popover"]').popover();
 });
 //Multiple Selection Scripts
    new MultiSelectTag('courses')

//For Posting the data to backend
$(document).ready(function() {
   $('#addbtn').click(function(e) {
       e.preventDefault(); 

       // Gather form data
       var formData = {
           startYear: $('#startYear').val(),
           endYear: $('#endYear').val(),
           admissionMonth: $('#monthSelect').val(),
           courses: $('#courses').val(),
           activeStatus: $('#activeToggle').prop('checked') ? 'Active' : 'Inactive'
       };

       // Send AJAX request
       $.ajax({
           url: 'phpScripts/admissionOpen.php', 
           type: 'POST',
           data: formData,
           dataType: 'json', // Expecting JSON response from server
           success: function(response) {
               if (response.success) {
                   Swal.fire({
                       toast: true,
                       position: 'top-end',
                       icon: 'success',
                       title: 'Admission Added successfully!',
                       showConfirmButton: true,
                       confirmButtonText: 'OK',
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
                       title: 'Something Error.Please try again.',
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
                   title: 'Server error. Please try again later.',
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

//Get the data from backend
function loadAdmissions() {
   $.ajax({
       url: 'phpScripts/getAdmissionOpen.php',
       type: 'GET',
       dataType: 'json',
       success: function(response) {
           if (response.success) {
               var admissions = response.data;
               var admissionTable = $('#AdmissionOpenTable');
               admissionTable.empty();

               $.each(admissions, function(index, admission) {
                   admissionTable.append(`
                       <tr>
                           <td>${admission.start_year}-${admission.end_year}</td>
                           <td>${admission.admission_month}</td>
                           <td>${admission.active_status}</td>
                           <td>${admission.courses}</td>
                           <td><button class="btn btn-info" onclick="editRow(this)">Edit</button><button class="btn btn-primary" style="display:none;" onclick="saveRow(this,${admission.id})">Save</button></td>
                           <td><button class="btn btn-danger" onclick="deleteRow(${admission.id})">Delete</button></td>
                       </tr>
                   `);
               });
           } else {
               Swal.fire({
                   toast: true,
                   position: 'top-end',
                   icon: 'error',
                   title: 'Error fetching admissions',
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
               title: 'Please  Fill out all the field',
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

// Call loadAdmissions() when the page is ready
$(document).ready(function() {
   loadAdmissions();
});

// Edit Row function
function editRow(button) {
   var row = $(button).closest('tr');
   var startYearEndYear = row.find('td').eq(0).text().split('-');
   var admissionMonth = row.find('td').eq(1).text();
   var activeStatus = row.find('td').eq(2).text();
   var courses = row.find('td').eq(3).text().split(','); // Split courses into an array

   // Create the <select> element with options for multiple selection (multi-tags)
   var selectHTML = `
       <select id="Editedcourses" class="form-control" multiple>
           <option value="MCA">MCA</option>
           <option value="MBA">MBA</option>
           <option value="MSC CS">MSC CS</option>
           <option value="MSC DS">MSC DS</option>
           <option value="M COM">M COM</option>
           <option value="MS PHYSICS">MS PHYSICS</option>
           <option value="MSC CHEMISTRY">MSC CHEMISTRY</option>
       </select>
   `;

   var selectElement = $(selectHTML);

   // Set selected options based on the courses array
   selectElement.find('option').each(function() {
       if (courses.includes($(this).val())) {
           $(this).prop('selected', true);
       }
   });

   // Replace the courses cell with the <select> element
   row.find('td').eq(3).html(selectElement);

   // Initialize the multi-select tag library for the selected options
   new MultiSelectTag('Editedcourses');

   // Update other input fields as before
   row.find('td').eq(0).html('<input type="text" class="form-control" value="' + startYearEndYear.join('-') + '">');
   row.find('td').eq(1).html('<input type="text" class="form-control" value="' + admissionMonth + '">');
   row.find('td').eq(2).html(`
       <select class="form-control">
           <option value="Active" ${activeStatus === 'Active' ? 'selected' : ''}>Active</option>
           <option value="Inactive" ${activeStatus === 'Inactive' ? 'selected' : ''}>Inactive</option>
       </select>
   `);

   row.find('.btn-info').hide();
   row.find('.btn-primary').show();
}



// Save Row function
function saveRow(button, id) {
   var row = $(button).closest('tr');
   var startYearEndYear = row.find('input').eq(0).val().split('-');
   var startYear = startYearEndYear[0];
   var endYear = startYearEndYear[1];
   var admissionMonth = row.find('input').eq(1).val();
   var activeStatus = row.find('select').eq(0).val();
   var selectedCourses = row.find('#Editedcourses').val(); 
   var courses = selectedCourses.join(',');
   console.log(courses)
   
   var data = {
       id: id,
       startYear: startYear,
       endYear: endYear,
       admissionMonth: admissionMonth,
       activeStatus: activeStatus,
       courses: courses
   };

   $.ajax({
       url: 'phpScripts/updateAdmission.php',
       type: 'POST',
       data: data,
       dataType: 'json',
       success: function(response) {
           if (response && response.success) {
               Swal.fire({
                   toast: true,
                   position: 'top-end',
                   icon: 'success',
                   title: 'Admission Updated Successfully',
                   showConfirmButton: true,
                   confirmButtonText: 'OK',
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
                   title: 'Error on Update',
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
               title: 'Server Busy Now. Try Again Later.',
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

// delete row Function
// Delete Row function
function deleteRow(id) {
   $.ajax({
       url: 'phpScripts/deleteAdmission.php',
       type: 'POST',
       data: {
           id: id
       },
       dataType: 'json',
       success: function(response) {
           if (response.success) {
            Swal.fire({
               toast: true,
               position: 'top-end',
               icon: 'success',
               title: 'Admission Deleted Successfully',
               showConfirmButton: true,
               confirmButtonText: 'OK',
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
                   title: 'Error deleting admission',
                   text: response.error ? response.error : 'Unknown error',
                   showConfirmButton: false,
                   timer: 1500,
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
               title: 'Server Busy Now. Try Again Later.',
               showConfirmButton: false,
               timer: 1500,
               timerProgressBar: true,
               customClass: {
                   popup: 'swalContainer',
                   title: 'swalTitleError'
               }
           });
       }
   });
}







