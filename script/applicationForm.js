//Department Options Getter
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

//Course Options Getter
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
                 var $courseOptions = $('#course');
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


// form Submission
$(document).ready(function() {
    let currentPage = 1;

    function loadApplications() {
        const programme = $('#departments option:selected').text();
        const course = $('#course option:selected').text();
        const year = $('#admissionYearOptions option:selected').text();
        const recordsPerPage = $('#records_per_page').val();
        const searchQuery = $('#searchInput').val();

        $.ajax({
            url: 'phpScripts/formApplications.php',
            method: 'POST',
            data: {
                programme: programme,
                course: course,
                year: year,
                records_per_page: recordsPerPage,
                search_query: searchQuery,
                page: currentPage
            },
            success: function(response) {
                try {
                    const data = JSON.parse(response);
                    if (data.error) {
                        console.error(data.error);
                        return;
                    }
                    $('#application-data').empty();
                    data.applications.forEach((app, index) => {
                        $('#application-data').append(`
                            <tr>
                                <td>${index + 1 + (currentPage - 1) * recordsPerPage}</td>
                                <td>${app.application_no}</td>
                                <td>${app.course}</td>
                                <td>${app.applicant_name}</td>
                                <td><button class="btn btn-primary">Action</button></td>
                                <td><button class="btn btn-secondary">Print</button></td>
                            </tr>
                        `);
                    });
                    $('#entry-count').text(`Showing ${data.count} of ${data.total} entries`);
                } catch (error) {
                    console.error("Error parsing JSON response:", error);
                }
            },
            error: function(xhr, status, error) {
                console.error("AJAX error:", status, error);
            }
        });
    }

    $('#applicationForm').submit(function(e) {
        e.preventDefault();
        currentPage = 1;
        loadApplications();
    });

    $('#nextPage').click(function() {
        currentPage++;
        loadApplications();
    });

    $('#prevPage').click(function() {
        if (currentPage > 1) {
            currentPage--;
            loadApplications();
        }
    });

    // Dynamically update results when records per page or search input changes
    $('#records_per_page, #searchInput').on('input', function() {
        currentPage = 1;
        loadApplications();
    });

    // Initial load
    loadApplications();
});




