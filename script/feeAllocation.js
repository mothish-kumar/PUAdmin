//department Option Getter
$(document).ready(function(){
   $.ajax({
     url:'phpScripts/getOptionsDept.php',
     type:'GET',
     dataType:'json',
     success: function(data){
        var $departmentOptions = $('#departments');
        $.each(data, function(index,item){
           $departmentOptions.append(
              $('<option>',{value: item.id , text:item.name})
           );
        });
     },
     error: function(jqXHR, textStatus, errorThrown) {
        console.log('Error: ' + textStatus + ' - ' + errorThrown);
    }
   });
  });

//Course Option Getter
$(document).ready(function(){
   $('#departments').on('change',function(){
      var selectedDepartment = $(this).val();
      if (selectedDepartment) {
         $.ajax({ 
             url: 'phpScripts/getOptionsCourse.php',
             type: 'GET',
             data: { department_id: selectedDepartment },
             dataType: 'json',
             success: function(data){
                 var $courseOptions = $('#courses');
                 $courseOptions.empty(); // Clear existing options
                 $.each(data, function(index, item){
                     $courseOptions.append(
                         $('<option>', { value: item.id, text: item.course_name })
                     );
                 });
             },
             error: function(jqXHR, textStatus, errorThrown) {
                 console.log('Error: ' + textStatus + ' - ' + errorThrown);
             }
         });
     } else {
         // Clear course options if no department is selected
         $('#course').empty().append($('<option>', { selected: true, disabled: true, text: 'Select Degree' }));
     }
   });
  });

   //Admission Year Options Getter
$(document).ready(function(){
   $.ajax({
     url:'phpScripts/getOptionsAdmissionYear.php',
     type:'GET',
     dataType:'json',
     success: function(data){
        var $admissionYearOptions = $('#admissionYear');
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