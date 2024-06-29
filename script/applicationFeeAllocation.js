//Admission Year Options Getter for Models
$(document).ready(function(){
 $.ajax({
   url:'phpScripts/getOptionsAdmissionYear.php',
   type:'GET',
   dataType:'json',
   success: function(data){
      var $admissionYearOptions = $('#admissionYearOptions');
      $.each(data, function(index,item){
         $admissionYearOptions.append(
            $('<option>',{value: item.id , text:item.start_year +'-'+ item.end_year})
         );
      });
   },
   error: function(jqXHR, textStatus, errorThrown) {
      console.log('Error: ' + textStatus + ' - ' + errorThrown);
  }
 });
}); 

//Admission Year Option getter for search bar options
$(document).ready(function(){
   $.ajax({
     url:'phpScripts/getOptionsAdmissionYearSearch.php',
     type:'GET',
     dataType:'json',
     success: function(data){
        var $admissionYear = $('#admissionYear');
        $.each(data, function(index,year){
           $admissionYear.append(
              $('<option value="' + year + '">' + year + '</option>')
           );
        });
     },
     error: function(jqXHR, textStatus, errorThrown) {
        console.log('Error: ' + textStatus + ' - ' + errorThrown);
    }
   });
  }); 
  

//Excel Format File Download Scripts
$(document).ready(function(){
    // Handle the download button click
    $('#downloadExcel').click(function() {
      window.location.href = 'phpScripts/downloadExcel.php';
    });
});

//Adding the data to the backend Script

$(document).ready(function() {
   $('#addfeebtn').click(function(e) {
       e.preventDefault();
       
       var formData = new FormData($('#addApplicationFee')[0]);
       var admissionYear = $('#admissionYearOptions option:selected').text();
       formData.append('admissionYear', admissionYear);  
       $.ajax({
           url: 'phpScripts/importExcel.php',
           type: 'POST',
           data: formData,
           processData: false,
           contentType: false,
           success: function(response) {
            Swal.fire({
               toast: true,
               position: 'top-end',
               icon: 'success',
               title: ' Fees Data Added Successfully',
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
           },
           error: function(jqXHR, textStatus, errorThrown) {
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

$(document).ready(function(){

   loadData();
//Get Data From Backend function

function loadData(){
   var admissionYear = $('#admissionYear option:selected').text();
   $.ajax({
      url:'phpScripts/getFeeAllocationData.php',
      type:'GET',
      dataType:'json',
      data: { admissionYear: admissionYear },
      success:function(response){
         if(response.success){
            var feesAllocation = response.data;
            var applicationFeeAllocationTable = $('#applicationFeeAllocationTable');
            applicationFeeAllocationTable.empty();
            $.each(feesAllocation,function(index,item){
               applicationFeeAllocationTable.append(`
                  <tr>
                  <td style = "display:none;" >${item.id}</td>
                  <td><span>${item.course}</span><input type="text" class="form-control" style="display:none;" value="${item.course}"></td>
                  <td><span>${item.OC}</span><input type="text" class="form-control" style="display:none;" value="${item.OC}"></td>
                  <td><span>${item.BC}</span><input type="text" class="form-control" style="display:none;" value="${item.BC}"></td>
                  <td><span>${item.BCMuslim}</span><input type="text" class="form-control" style="display:none;" value="${item.BCMuslim}"></td>
                  <td><span>${item.DNC}</span><input type="text" class="form-control" style="display:none;" value="${item.DNC}"></td>
                  <td><span>${item.MBC}</span><input type="text" class="form-control" style="display:none;" value="${item.MBC}"></td>
                  <td><span>${item.SC}</span><input type="text" class="form-control" style="display:none;" value="${item.SC}"></td>
                  <td><span>${item.SCA}</span><input type="text" class="form-control" style="display:none;" value="${item.SCA}"></td>
                  <td><span>${item.ST}</span><input type="text" class="form-control" style="display:none;" value="${item.ST}"></td>
                  <td>
                      <button type="button" class="btn btn-primary editButton">Edit</button>
                      <button type="button" class="btn btn-success saveButton" style="display:none;">Save</button>
                  </td>
                  </tr>
                  `);
            });
         }
      },
      error: function(jqXHR, textStatus, errorThrown) {
         Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'error',
            title: 'No data Found',
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

//SearchButton Handler
$('#searchButton').click(function() {
   loadData();
});

// Event listener for Edit button click
$(document).on('click', '.editButton', function() {
   var row = $(this).closest('tr');
   row.find('span').hide();
   row.find('input').show();
   row.find('.editButton').hide();
   row.find('.saveButton').show();
});

// Event listener for Save button click
$(document).on('click', '.saveButton', function() {
   var row = $(this).closest('tr');
   var formData = {
      id: row.find('td:eq(0)').text(),
      course: row.find('input:eq(0)').val(),
      OC: row.find('input:eq(1)').val(),
      BC: row.find('input:eq(2)').val(),
      BCMuslim: row.find('input:eq(3)').val(),
      DNC: row.find('input:eq(4)').val(),
      MBC: row.find('input:eq(5)').val(),
      SC: row.find('input:eq(6)').val(),
      SCA: row.find('input:eq(7)').val(),
      ST: row.find('input:eq(8)').val()
   };
   console.log(formData)

   // Perform AJAX call to save data
   $.ajax({
       url: 'phpScripts/saveApplicationFeesData.php',
       type: 'POST',
       dataType: 'json',
       data: formData,
       success: function(response) {
           if (response.success) {
               loadData();
               Swal.fire({
                  toast: true,
                  position: 'top-end',
                  icon: 'success',
                  title: ' Data Updated Successfully',
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
                     loadData();
                  }
              });
               // Restore UI state after saving
               row.find('span').show();
               row.find('input').hide();
               row.find('.editButton').show();
               row.find('.saveButton').hide();
           } else {
            Swal.fire({
               toast: true,
               position: 'top-end',
               icon: 'error',
               title: 'Errom on Updating Please Try Again Sometimes',
               showConfirmButton: false, 
               timerProgressBar: true,
               customClass: {
                   popup: 'swalContainer',
                   title: 'swalTitleError'
               }
           });
           }
       },
       error: function(jqXHR, textStatus, errorThrown) {
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
