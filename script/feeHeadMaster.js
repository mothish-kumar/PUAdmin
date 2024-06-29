$(document).ready(function(){
   let currentPage = 1;
   $('#addbtn').click(function(){

      var feeName = $('#feeName').val();
      var feeDescr = $('#feeDescr').val();

      $.ajax({
         url:'phpScripts/addFeeHeadMaster.php',
         type:'POST',
         data:{
            feeName:feeName,
            feeDescr:feeDescr
         },
         success:function(response){
            var res = JSON.parse(response);
            if(res.status === "success"){
               $('#addModal').modal('hide');
               Swal.fire({
                 toast: true,
                 position: 'top-end',
                 icon: 'success',
                 title: 'Fee Head Added Successfully',
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
            }
            else {
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

   function loadData(){
      //data get from HTML page
      const recordsPerPage = $('#records_per_page').val();
        const searchQuery = $('#searchInput').val();
        //Conact with Backend
      $.ajax({
         url:'phpScripts/getFeeHeadMaster.php',
         method:'GET',
         data:{
            records_per_page: recordsPerPage,
            search_query: searchQuery,
            page: currentPage
         },
         success:function(data){
            if (data.success){
               $('#feeHeadMasterTable').empty();
               data.data.forEach((i,index) =>{
                  $('#feeHeadMasterTable').append(`
                     <tr>
                     <td style="display:none;">${i.id}</td>
                     <td>${index + 1 + (currentPage - 1) * recordsPerPage}</td>
                     <td>
                     <span>${i.feeName}</span>
                     <input type="text" class="form-control" style="display:none;" value="${i.feeName}">
                     </td>
                     <td>
                     <button class="btn btn-info" onclick="editFunc(this)">Edit</button>
                     <button class="btn btn-primary" style="display:none;" onclick="saveFunc(this)">Save</button>
                     </td>
                     <td><button class="btn btn-danger" onclick="deleteFunc(${i.id})">Delete</button></td>
                     </tr>
                     `);
               });
               $('#entry-count').text(`Showing ${data.count} of ${data.total} entries`);
            }
            else{
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

   //Button Click Handler
   $('#nextPage').click(function() {
      currentPage++;
      loadData();
  });

  $('#prevPage').click(function() {
      if (currentPage > 1) {
          currentPage--;
          loadData();
      }
  });

  // Dynamically update results when records per page or search input changes
  $('#records_per_page, #searchInput').on('input', function() {
      currentPage = 1;
      loadData();
  });

  // Initial load
  loadData();

});

  //Edit Function
  function editFunc(button){
   var row = $(button).closest('tr');
   row.find('span').hide();
   row.find('input').show();
   row.find('.btn-info').hide();
   row.find('.btn-primary').show();
  }

  //Updated Data Send to Backend
  function saveFunc(button) {
   var row = $(button).closest('tr');
   var id = row.find('td:first').text();
   var feeName = row.find('input').eq(0).val();
   console.log(id,feeName);
   $.ajax({
       url: 'phpScripts/updateFeeHeadMaster.php',
       type: 'POST',
       data: {
           id: id,
           feeName: feeName,
       },
       success: function(response) {
         var res = JSON.parse(response);
           if (res.success) {
            Swal.fire({
               toast: true,
               position: 'top-end',
               icon: 'success',
               title: 'Fee Head Updated Successfully',
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

  //Delete Function
  function deleteFunc(id){
   $.ajax({
      url: 'phpScripts/deleteFeeHeadMaster.php',
      type: 'POST',
      data: { id: id },
      success: function(response) {
         var res = JSON.parse(response);
          if (res.success) {
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

