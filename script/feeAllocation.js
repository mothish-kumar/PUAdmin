$(document).ready(function () {
  //Department Option Getter
  $.ajax({
      url: 'phpScripts/getOptionsDept.php',
      type: 'GET',
      dataType: 'json',
      success: function (data) {
          var $departmentOptions = $('#departments');
          $.each(data, function (index, item) {
              $departmentOptions.append(
                  $('<option>', { value: item.id, text: item.name })
              );
          });
      },
      error: function (jqXHR, textStatus, errorThrown) {
          console.log('Error: ' + textStatus + ' - ' + errorThrown);
      }
  });

  //Course Option Getter
  $('#departments').on('change', function () {
      var selectedDepartment = $(this).val();
      if (selectedDepartment) {
          $.ajax({
              url: 'phpScripts/getOptionsCourse.php',
              type: 'GET',
              data: { department_id: selectedDepartment },
              dataType: 'json',
              success: function (data) {
                  var $courseOptions = $('#courses');
                  $courseOptions.empty(); // Clear existing options
                  $.each(data, function (index, item) {
                      $courseOptions.append(
                          $('<option>', { value: item.id, text: item.course_name })
                      );
                  });
              },
              error: function (jqXHR, textStatus, errorThrown) {
                  console.log('Error: ' + textStatus + ' - ' + errorThrown);
              }
          });
      } else {
          // Clear course options if no department is selected
          $('#course').empty().append($('<option>', { selected: true, disabled: true, text: 'Select Degree' }));
      }
  });

  //Admission Year Options Getter
  $.ajax({
      url: 'phpScripts/getOptionsAdmissionYear.php',
      type: 'GET',
      dataType: 'json',
      success: function (data) {
          var $admissionYearOptions = $('#admissionYear');
          $.each(data, function (index, item) {
              $admissionYearOptions.append(
                  $('<option>', { value: item.id, text: item.start_year + '-' + item.end_year })
              );
          });
      },
      error: function (jqXHR, textStatus, errorThrown) {
          console.log('Error: ' + textStatus + ' - ' + errorThrown);
      }
  });

  //Dynamic column getter
  // Event listener for radio buttons
  $('input[name="columnSelection"]').on('change', function () {
      const selection = $(this).attr('id');
      $('#inputContainer').empty(); // Clear existing input boxes
      console.log("Get Values", selection);
      if (selection === 'year') {
          $('#inputContainer').append('<input type="number" id="yearInput" class="form-control" placeholder="Enter number of years">');
      } else if (selection === 'semester') {
          $('#inputContainer').append('<input type="number" id="semesterInput" class="form-control" placeholder="Enter number of semesters">');
      }
  });

  // Event listener for the search button in the modal
  $('#modalSearchButton').on('click', function () {
      let columns = [];
      const yearInput = $('#yearInput').val();
      const semesterInput = $('#semesterInput').val();

      if (yearInput) {
          for (let i = 1; i <= yearInput; i++) {
              columns.push(`Year ${i}`);
          }
      } else if (semesterInput) {
          for (let i = 1; i <= semesterInput; i++) {
              columns.push(`Semester ${i}`);
          }
      }

      updateTableHeaders(columns);
      populateFeeData(columns)

  });

  // Function to update table headers
  function updateTableHeaders(columns) {
      const $tableHead = $('#data-head');
      $tableHead.empty();

      let headersHtml = '<tr><th scope="col">#</th><th scope="col">Fee Name</th>';
      columns.forEach(column => {
          headersHtml += `<th scope="col">${column}</th>`;
      });
      headersHtml += '</tr>';

      $tableHead.append(headersHtml);
  }
  // Function to update table data's Structure
  function populateFeeData(columns) {
    $.ajax({
        url: 'phpScripts/getFeeData.php',
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            const $tableBody = $('#data');
            $tableBody.empty();
            $.each(data, function (index, item) {
                let rowHtml = `<tr><td>${index + 1}</td><td>${item.feeName}</td>`;
                columns.forEach(column => {
                    rowHtml += `<td><input type="text" class="form-control" name="${column}[]"></td>`;
                });
                rowHtml += '</tr>';
                $tableBody.append(rowHtml);
            });
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log('Error: ' + textStatus + ' - ' + errorThrown);
        }
    });
}
 // Event listener for the add button in the modal
 $('#addbtn').on('click', function (event) {
    event.preventDefault();
    var department = $('#departments').find("option:selected").text();
    var course = $('#courses').find("option:selected").text();
    var quota = $('#quota').find("option:selected").text();
    var admissionYear = $('#admissionYear').find("option:selected").text();
    let tableData = [];
            $('#data tr').each(function () {
                let row = {};
                row.feeName = $(this).find('td:eq(1)').text();
                $(this).find('input').each(function (index, input) {
                    let columnName = $(input).attr('name').slice(0, -2); // remove the '[]' at the end
                    if (!row[columnName]) {
                        row[columnName] = [];
                    }
                    row[columnName].push($(input).val());
                });
                tableData.push(row);
            });
  $.ajax({
      url: 'phpScripts/saveFeeData.php',
      type: 'POST',
      data: {
        department:department,
        course:course,
        quota:quota,
        admissionYear:admissionYear,
        tableData:JSON.stringify(tableData)
      },
      success: function (response) {
        var res = JSON.parse(response);
        if(res.success){
            Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'success',
                title: ' New Fees Added Successfully',
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
      error: function (jqXHR, textStatus, errorThrown) {
          Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Failed to save fees data!'
          });
      }
  });
 });

 //Search Option Getter
 $.ajax({
    url: 'phpScripts/getOptionsAdmissionYear.php',
    type: 'GET',
    dataType: 'json',
    success: function (data) {
        var $year= $('#admissionYearSearch');
        $.each(data, function (index, item) {
            $year.append(
                $('<option>', { value: item.id, text: item.start_year + '-' + item.end_year })
            );
        });
    },
    error: function (jqXHR, textStatus, errorThrown) {
        console.log('Error: ' + textStatus + ' - ' + errorThrown);
    }
});
//Search Option Function
$('#mainSearchButton').on('click',function(event){
    event.preventDefault();
    let currentPage = 1;
     //Button Click Handler
     $('#nextPage').click(function(event) { 
        event.preventDefault();
        currentPage++;
        loadData();
    });
    
    $('#prevPage').click(function(event) {
        event.preventDefault();
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
    //Initial Load
    loadData();
});

//View Button Function
window.viewBtn = function(event,button) {
    event.preventDefault(); 
    var row = $(button).closest('tr');
    var id = row.find('td').eq(0).text();
    $.ajax({
        url:'phpScripts/ViewFeeDetails.php',
        method:'GET',
        data:{id:id},
        success:function(data){
           if (data.success){
            populateModalWithData(data.data);
            $('#updateTable').modal('show');
           }
           else{
              Swal.fire({
                 toast: true,
                 position: 'top-end',
                 icon: 'error',
                 title: data.message,
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
function populateModalWithData(data) {
    $('#update-data').empty(); // Clear existing data
    var $tableBody = $('#update-data');
    var id = data.id;
    // Iterate over each fee object in the data array
    data.dynamic_data.forEach(function(item, index) {
        var rowHtml = `<tr><td style = "display:none;">${id}</td><td>${index + 1}</td><td>${item.feeName}</td>`;

        // Iterate over each year's data for the current fee
        Object.keys(item).forEach(function(key) {
            if (key !== 'feeName') {
                rowHtml += `<td><input type ="text" class="form-control"  value = "${item[key][0]}"></td>`; 
            }
        });

        rowHtml += '</tr>';
        $tableBody.append(rowHtml);
    });
}
// Update Button
$('.updateBtn').on('click', function(event) {
    event.preventDefault();
    var updatedData = [];
    var id = $('#update-data tr:first').find('td:eq(0)').text();

    $('#update-data tr').each(function() {
        var row = {};
        row.feeName = $(this).find('td:eq(2)').text();
        $(this).find('input').each(function(index, input) {
            let columnName = $(input).closest('td').index(); 
            row[`column${columnName}`] = $(input).val();
        });
        updatedData.push(row);
    });
    $.ajax({
        url: 'phpScripts/updateFeeData.php',
        type: 'POST',
        data: {
          id:id,
          updatedData:JSON.stringify(updatedData)
        },
        success: function (response) {
          if(response.success){
              Swal.fire({
                  toast: true,
                  position: 'top-end',
                  icon: 'success',
                  title: ' Fee Updated Successfully',
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
                    $('#updateTable').modal('hide');
                    loadData();
                  }
              });
          }
          else{
              Swal.fire({
                  toast: true,
                  position: 'top-end',
                  icon: 'error',
                  title: response.message,
                  showConfirmButton: false, 
                  timerProgressBar: true,
                  customClass: {
                      popup: 'swalContainer',
                      title: 'swalTitleError'
                  }
              });
          }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to update fees data!'
            });
        }
    });


});

//delete Button
$('.deleteBtn').on('click',function(event){
    event.preventDefault();
    var id = $('#update-data tr:first').find('td:eq(0)').text();
    $.ajax({
        url: 'phpScripts/deleteFeeData.php',
        type: 'POST',
        data: {
          id:id,
        },
        success: function (response) {
          if(response.success){
              Swal.fire({
                  toast: true,
                  position: 'top-end',
                  icon: 'success',
                  title: ' Deleted Successfully',
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
                    $('#updateTable').modal('hide');
                      loadData();
                  }
              });
          }
          else{
              Swal.fire({
                  toast: true,
                  position: 'top-end',
                  icon: 'error',
                  title: response.message,
                  showConfirmButton: false, 
                  timerProgressBar: true,
                  customClass: {
                      popup: 'swalContainer',
                      title: 'swalTitleError'
                  }
              });
          }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to delete fees data!'
            });
        }
    });

});
});
// Load Global Function
let currentPage = 1;
function loadData(){
    const recordsPerPage = $('#records_per_page').val();
    const searchQuery = $('#searchInput').val();
    const admissionYear = $('#admissionYearSearch option:selected').text();
    $.ajax({
        url:'phpScripts/getFeeDetails.php',
        method:'GET',
        data:{
           records_per_page: recordsPerPage,
           search_query: searchQuery,
           page: currentPage,
           admission_year: admissionYear
        },
        success:function(data){
           if (data.success){
              $('#application-data').empty();
              data.data.forEach((i,index) =>{
                 $('#application-data').append(`
                    <tr>
                    <td style="display:none;">${i.id}</td>
                    <td>${index + 1 + (currentPage - 1) * recordsPerPage}</td>
                    <td>
                        <span>${i.admission_year}</span>
                        <input type="text" class="form-control" style="display:none;" value="${i.admission_year}">
                    </td>
                    <td>
                        <span>${i.department} & ${i.course}</span>
                        <input type="text" class="form-control" style="display:none;" value="${i.department} & ${i.course}">
                    </td>
                    <td>
                        <span>${i.quota}</span>
                        <input type="text" class="form-control" style="display:none;" value="${i.quota}">
                    </td>
                    <td>
                        <button class="btn btn-info" onclick="viewBtn(event,this)">View</button>
                    </td>
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
