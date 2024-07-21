 //Admission Year Options Getter
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

  //Course Options Getter
  $(document).ready(function(){
   $.ajax({ 
       url: 'phpScripts/courseOptionGetter.php',
       type: 'GET',
       dataType: 'json',
       success: function(data){
           var $ele = $('#courses');
           $.each(data, function(index, item){
               $ele.append(
                   $('<option>', { value: item.id, text: item.course_name })
               );
           });
           //MultiSelect Option
           new MultiSelectTag('courses')
       },
       error: function(jqXHR, textStatus, errorThrown) {
           console.log('Error: ' + textStatus + ' - ' + errorThrown);
       }
   });
});
  //Date picker
  $('.datePicker').datepicker({
   format: 'yyyy-mm-dd',
   autoclose: true,
   todayHighlight: true,
   orientation: 'bottom auto'
}).on('show', function(e) {
   // Custom event handler for when the date picker is shown
   $('.datepicker-dropdown').css('width', 'auto');
   $('.datepicker-dropdown').css('margin-top', '10px');
});
 //reset button functionality
 $('#resetBtn').click(function(){

   $('#courses').each(function() {
      $('.item-container').css('display','none');
  });

});

//Automatic button disable when End date cross
$(document).ready(function(){
    function checkDate() {
        var closeDate = $('#applyNowBtnEnd').val();
        var currentDate = new Date().toISOString().split('T')[0];

        if (closeDate && closeDate < currentDate) {
            $('#applyNow').prop('checked', false);
         }
        }
      // Check date when the page loads
      checkDate();

      
});


    $(document).ready(function(){
        //save Button functionality
         $('#saveBtn').click(function(){
            const admissionYearOptionsText =$('#admissionYearOptions option:selected').text();
            const pagetxt = $('#pagetxt').val();
            const lastPaymentDate = $('#lastPaymentDate').val();
            const applyNow = $('#applyNow').is(':checked') ? 'Enabled' : 'Disabled';
            const applyNowBtnStart = $('#applyNowBtnStart').val();
            const applyNowBtnEnd = $('#applyNowBtnEnd').val();
            const applicantLogin = $('#applicantLogin').is(':checked') ? 'Enabled' : 'Disabled';
            const loginBtnStart = $('#loginBtnStart').val();
            const loginBtnEnd = $('#loginBtnEnd').val();
            const pageLink = $('#pageLink').val();
            
            // Get the text of all selected courses
            const coursesText = $('#courses option:selected').map(function() {
                return {
                    value: $(this).val(),
                    text: $(this).text()
                };
            }).get();
            // Create a FormData object
            const formData = new FormData();
            formData.append('admissionYearOptions', admissionYearOptionsText);
            formData.append('pagetxt',pagetxt);
            formData.append('lastPaymentDate', lastPaymentDate);
            formData.append('applyNow', applyNow);
            formData.append('applyNowBtnStart', applyNowBtnStart);
            formData.append('applyNowBtnEnd', applyNowBtnEnd);
            formData.append('applicantLogin', applicantLogin);
            formData.append('loginBtnStart', loginBtnStart);
            formData.append('loginBtnEnd', loginBtnEnd);
            formData.append('pageLink', pageLink);
            formData.append('courses', JSON.stringify(coursesText));
            
            if ($('#prospectusPdf')[0].files[0]) {
                formData.append('prospectusPdf', $('#prospectusPdf')[0].files[0]);
            }
            if ($('#instructionPdf')[0].files[0]) {
                formData.append('instructionPdf', $('#instructionPdf')[0].files[0]);
            }
            if ($('#homePagePdf')[0].files[0]) {
                formData.append('homePagePdf', $('#homePagePdf')[0].files[0]);
            }
            $.ajax({
                url: 'phpScripts/onlineApplicationSettings.php',
                type: 'POST',
                data: formData,
                processData: false,
                contentType: false,
                dataType: 'json',
                success: function(response) {
                   if(response.success){
                      Swal.fire({
                         toast: true,
                         position: 'top-end',
                         icon: 'success',
                         title: ' Settings Saved Successfully',
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
                   else{
                      Swal.fire({
                         toast: true,
                         position: 'top-end',
                         icon: 'error',
                         title: 'Something Went wrong'+response.message,
                         showConfirmButton: false, 
                         timerProgressBar: true,
                         timer: 3000,
                         customClass: {
                             popup: 'swalContainer',
                             title: 'swalTitleError'
                         }
                     }); 
                   }
                   
                },
                error: function(xhr, status, error) {
                  console.error('Server Error:', error);
                   Swal.fire({
                      toast: true,
                      position: 'top-end',
                      icon: 'error',
                      title: 'Server Busy Now Try Again Later',
                      showConfirmButton: false, 
                      timerProgressBar: true,
                      timer: 3000,
                      customClass: {
                          popup: 'swalContainer',
                          title: 'swalTitleError'
                      }
                  });
                }
            });
          });
        
        function populateFormFields(settings) {
            $('#admissionYearOptions option:selected').text(settings.admission_year_options);
            $('#pagetxt').val(settings.page_txt);
            $('#lastPaymentDate').val(settings.last_payment_date);
        
            if (settings.apply_now === 'Enabled') {
                $('#applyNow').prop('checked', true);
            } else {
                $('#applyNow').prop('checked', false);
            }
            $('#applyNowBtnStart').val(settings.appl_now_btn_start);
            $('#applyNowBtnEnd').val(settings.apply_now_btn_end);
        
            if (settings.applicant_login === 'Enabled') {
                $('#applicantLogin').prop('checked', true);
            } else {
                $('#applicantLogin').prop('checked', false);
            }
            $('#loginBtnStart').val(settings.login_btn_start);
            $('#loginBtnEnd').val(settings.login_btn_end);
        
            $('#pageLink').val(settings.page_link);
            
            // Set PDF file paths for view buttons
            $('#prospectusPdf').data('filepath', settings.prospectus_pdf);
            $('#instructionPdf').data('filepath', settings.instruction_pdf);
            $('#homePagePdf').data('filepath', settings.home_page_pdf);
 
            //Course data's
            var coursesData = JSON.parse(settings.courses);
            $.each(coursesData,function(index,item){
                var html = `<div class="item-container" style="color: rgb(3, 114, 178); border-color: rgb(3, 114, 178); background: rgb(192, 230, 252);"><div class="item-label" data-value="${item.value}" style="color: rgb(3, 114, 178);">${item.text}</div><svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="item-close-svg">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg></div>`
            $('.input-container').append(html);
            });

        }
         // AJAX request to fetch application settings
         $.ajax({
            url: 'phpScripts/onlineApplicationSettings.php',
            type: 'GET',
            dataType: 'json',
            success: function(response) {
                if (response.success) {
                    populateFormFields(response.data);
                } else {
                    Swal.fire({
                        toast: true,
                        position: 'top-end',
                        icon: 'error',
                        title: 'Something Went wrong',
                        showConfirmButton: false, 
                        timerProgressBar: true,
                        timer: 3000,
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
                    timer: 3000,
                    customClass: {
                        popup: 'swalContainer',
                        title: 'swalTitleError'
                    }
                });
            }
        });
        $('#prospectusViewBtn').click(function() {
            const data = $('#prospectusPdf').data('filepath');
            if(data){
                const filePath = 'asserts/pdf/Prospectus.pdf';
                window.open(filePath, '_blank');
            }
            else{
                Swal.fire({
                    toast: true,
                    position: 'top-end',
                    icon: 'error',
                    title: 'No Pdf File Found',
                    showConfirmButton: false, 
                    timerProgressBar: true,
                    timer: 3000,
                    customClass: {
                        popup: 'swalContainer',
                        title: 'swalTitleError'
                    }
                });
            }
        });
    
        $('#instructionViewBtn').click(function() {
            const data = $('#instructionPdf').data('filepath');
            if(data){
                const filePath = 'asserts/pdf/Instruction.pdf';
                window.open(filePath, '_blank');
            }
            else{
                Swal.fire({
                    toast: true,
                    position: 'top-end',
                    icon: 'error',
                    title: 'No Pdf File Found',
                    showConfirmButton: false, 
                    timerProgressBar: true,
                    timer: 3000,
                    customClass: {
                        popup: 'swalContainer',
                        title: 'swalTitleError'
                    }
                });
            }
        });
    
        $('#homeViewBtn').click(function() {
            const data = $('#homePagePdf').data('filepath');
            if(data){
                const filePath = 'asserts/pdf/GuideLines.pdf';
                window.open(filePath, '_blank');
            }
            else{
                Swal.fire({
                    toast: true,
                    position: 'top-end',
                    icon: 'error',
                    title: 'No Pdf File Found',
                    showConfirmButton: false, 
                    timerProgressBar: true,
                    timer: 3000,
                    customClass: {
                        popup: 'swalContainer',
                        title: 'swalTitleError'
                    }
                });
            }
        });
     });

//delete Button Script
$(document).ready(function() {  
    $('#prospectusDeleteBtn').click(function() {
        deletePdf('prospectus_pdf');
    });

    $('#instructionDeleteBtn').click(function() {
        deletePdf('instruction_pdf');
    });

    $('#homeDeleteBtn').click(function() {
        deletePdf('home_page_pdf');
    });

    function deletePdf(field) {
        // Confirm deletion
        Swal.fire({
            toast: true,
            position: 'top-end',
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
            customClass: {
                popup: 'swalContainer',
                title: 'swalTitleError'
            }
        }).then((result) => {
            if (result.isConfirmed) {
                // AJAX request to delete PDF path
                $.ajax({
                    url: 'phpScripts/deletePdf.php',
                    type: 'POST',
                    dataType: 'json',
                    data: { field: field },
                    success: function(response) {
                        if (response.success) {
                            Swal.fire({
                                toast: true,
                                position: 'top-end',
                                icon: 'success',
                                title: 'Deleted Successfully',
                                showConfirmButton: true,
                                confirmButtonText : 'OK',
                                confirmButtonColor: '#2C3E50',
                                timerProgressBar: false,
                                customClass: {
                                    popup: 'swalContainer',
                                    title: 'swalTitleSuccess'
                                }
                            }).then((result) => {
                                location.reload(); // Reload the page or update UI as needed
                            });
                        } else {
                            Swal.fire(
                                'Error!',
                                'Failed to delete the PDF file.',
                                'error'
                            );
                        }
                    },
                    error: function(xhr, status, error) {
                        console.error('Error deleting PDF:', error);
                        Swal.fire({
                            toast: true,
                            position: 'top-end',
                            icon: 'error',
                            title: 'Something Went wrong',
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
        });
    }
});



