//Department Options Getter
$(document).ready(function(){
    $.ajax({
      url:'phpScripts/getOptionsDept.php',
      type:'GET',
      dataType:'json',
      success: function(data){
         var $departmentOptions = $('#departmentOptions');
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
// Adding the data to database
$(document).ready(function(){
    $('#addCoursebtn').click(function(){
        var department = $('#departmentOptions').val() ;
        var newCourse = $('#newCourse').val();
        var expandCourse = $('#expandCourse').val();
        var years = $('#years').val();
        var semester = $('#semester').val();
        if (department && newCourse && expandCourse && years && semester){
            $.ajax({
                url:'phpScripts/addCourse.php',
                type:'POST',
                data:{
                    department : department,
                    newCourse : newCourse,
                    expandCourse : expandCourse,
                    years:years,
                    semester:semester
                },
                success:function(response){
                    Swal.fire({
                        toast: true,
                        position: 'top-end',
                        icon: 'success',
                        title: 'Course Added Successfully',
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
        else{
            Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'error',
                title: 'Please Enter details',
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

//Get Data from backend 
function loadCourses() {
    $.ajax({
        url: 'phpScripts/getCourses.php',
        type: 'GET',
        dataType: 'json',
        success: function(response) {
            if (response.success) {
                var coursesByDepartment = response.data;
                var courseTable = $('#CoursesTable');
                courseTable.empty();
                $.each(coursesByDepartment, function(index, item) {
                    var courses = item.courses.split('|').map(course => course.trim());
                    var coursesHtml = courses.map(course => `
                        <div>
                            <span>${course}</span>
                            <input type='text' class='form-control' style='display:none;' value='${course}'>
                        </div>
                    `).join('');
                    var Cexpand = item.Cexpand.split('|').map(Ecourse => Ecourse.trim());
                    var CexpandHtml = Cexpand.map(Ecourse => `
                        <div>
                            <span>${Ecourse}</span>
                            <input type='text' class='form-control' style='display:none;' value='${Ecourse}'>
                        </div>
                    `).join('');
                    var Cyear = item.Cyear.split('|').map(year => year.trim());
                    var CyearHtml = Cyear.map(year => `
                        <div>
                            <span>${year}</span>
                            <input type='text' class='form-control' style='display:none;' value='${year}'>
                        </div>
                    `).join('');
                    var Csemester = item.Csemester.split('|').map(semester => semester.trim());
                    var CsemesterHtml = Csemester.map(semester => `
                        <div>
                            <span>${semester}</span>
                            <input type='text' class='form-control' style='display:none;' value='${semester}'>
                        </div>
                    `).join('');
                   

                    courseTable.append(`
                        <tr>
                            <td>${item.department}</td>
                            <td class = "mt-1">${coursesHtml}</td>
                            <td class = "mt-1">${CexpandHtml}</td>
                            <td class = "mt-1 text-center">${CyearHtml}</td>
                            <td class = "mt-1 text-center">${CsemesterHtml}</td>
                            <td>
                                <button class='btn btn-info' onclick='editRow(this)'>Edit</button>
                                <button class='btn btn-primary' style='display:none;' onclick='saveRow(this, "${item.department}")'>Save</button>
                            </td>
                            <td>
                                <button class='btn btn-danger' onclick='deleteRow("${item.department}")'>Delete</button>
                            </td>
                        </tr>`);
                });
            }
        },
        error: function() {
            alert('An error occurred while loading the courses.');
        }
    });
 }

//Edit Function

function editRow(button) {
    var row = $(button).closest('tr');
    row.find('span').hide();
    row.find('input').show();
    row.find('.btn-info').hide();
    row.find('.btn-primary').show();
}

// updata Function

function saveRow(button, department) {
    var row = $(button).closest('tr');
    var courses = row.find('input').map(function() {
        return $(this).val();
    }).get();

    $.ajax({
        url: 'phpScripts/editCourse.php',
        type: 'POST',
        dataType: 'json',
        data: {
            department: department,
            courses: courses
        },
        success: function(response) {
            if (response.success) {
                loadCourses();
            } else {
                alert('Failed to save the changes: ' + response.error);
            }
        },
        error: function() {
            alert('An error occurred while saving the changes.');
        }
    });
}

//delete Function

function deleteRow(department) {
    $.ajax({
        url: 'phpScripts/deleteCourse.php',
        type: 'POST',
        data: { department: department },
        success: function(response) {
            if (response.success) {
                loadCourses();
            } else {
                alert('Failed to delete the courses.');
            }
        }
    });
}
 // load Data
$(document).ready(function() {
    loadCourses();
});