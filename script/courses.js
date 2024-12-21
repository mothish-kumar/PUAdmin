//Department Options Getter
$(document).ready(function(){
    $.ajax({
      url:'phpScripts/getOptionsDept.php',
      type:'GET',
      dataType:'json',
      success: function(data){
         var $departmentOptions = $('#departmentOptions');
         var $departmentOptionsE = $('#departmentOptionsE');
         $.each(data, function(index,item){
            $departmentOptions.append(
               $('<option>',{value: item.id , text:item.name})
            );
            $departmentOptionsE.append(
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
                        <div class = "mt-2">
                            <span>${course}</span>
                            <input type='text' class='form-control' style='display:none;' value='${course}'>
                        </div>
                    `).join('');
                    var Cexpand = item.Cexpand.split('|').map(Ecourse => Ecourse.trim());
                    var CexpandHtml = Cexpand.map(Ecourse => `
                        <div class = "mt-2">
                            <span>${Ecourse}</span>
                            <input type='text' class='form-control' style='display:none;' value='${Ecourse}'>
                        </div>
                    `).join('');
                    var Cyear = item.Cyear.split('|').map(year => year.trim());
                    var CyearHtml = Cyear.map(year => `
                        <div class = "mt-2">
                            <span>${year}</span>
                            <input type='text' class='form-control' style='display:none;' value='${year}'>
                        </div>
                    `).join('');
                    var Csemester = item.Csemester.split('|').map(semester => semester.trim());
                    var CsemesterHtml = Csemester.map(semester => `
                        <div class = "mt-2">
                            <span>${semester}</span>
                            <input type='text' class='form-control' style='display:none;' value='${semester}'>
                        </div>
                    `).join('');
                    var ids = item.id.split('|').map(id => id.trim());
                    var editBtnHtml = ids.map(id=> `
                        <div class = "mt-1">
                             <button class='btn btn-info mt-1 btn-sm' onclick = "editRow(${id})">Edit</button>
                        </div>
                    `).join('');

                    var deleteBtnHtml = ids.map(id => `
                        <div class = "mt-1">
                            <button class='btn btn-danger mt-1 btn-sm' onclick='deleteRow("${id}")'>Delete</button>
                        </div>
                    `).join('');
                   

                    courseTable.append(`
                        <tr>
                            <td>${item.department}</td>
                            <td class = "mt-1">${coursesHtml}</td>
                            <td class = "mt-1">${CexpandHtml}</td>
                            <td class = "mt-1 text-center">${CyearHtml}</td>
                            <td class = "mt-1 text-center">${CsemesterHtml}</td>
                            <td class = "mt-1">${editBtnHtml}</td>
                            <td class = "mt-1">${deleteBtnHtml}</td>
                        </tr>`);
                });
            }
        },
        error: function() {
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

//Edit Function

function editRow(id) {
   var model = new bootstrap.Modal($('#editRow')) 
    model.show();

    $.ajax({
        url:'phpScripts/getCourseE.php',
        type:'POST',
        data:{
            id:id
        },
        success:function(response){
            if (response.success){
                const data = response.data;
                $('#departmentOptionsE').val(data.department_id) ;
                $('#newCourseE').val(data.course_name);
                $('#expandCourseE').val(data.expand_course);
                $('#yearsE').val(data.years);
                $('#semesterE').val(data.semester);
            }
            else{
                Swal.fire({
                    toast: true,
                    position: 'top-end',
                    icon: 'error',
                    title: 'Something went Wrong please try Again',
                    showConfirmButton: false, 
                    timerProgressBar: true,
                    customClass: {
                        popup: 'swalContainer',
                        title: 'swalTitleError'
                    }
                });
            }
        }
    });
    $('#updateCoursebtn').click(function(){
        var departmentE = $('#departmentOptionsE').val() ;
        var newCourseE = $('#newCourseE').val();
        var expandCourseE = $('#expandCourseE').val();
        var yearsE = $('#yearsE').val();
        var semesterE = $('#semesterE').val();
        console.log(departmentE,newCourseE,expandCourseE,yearsE,semesterE,id)
            $.ajax({
                url:'phpScripts/editCourse.php',
                type:'POST',
                data:{
                    id:id,
                    department : departmentE,
                    newCourse : newCourseE,
                    expandCourse : expandCourseE,
                    years:yearsE,
                    semester:semesterE
                },
                success:function(response){
                    Swal.fire({
                        toast: true,
                        position: 'top-end',
                        icon: 'success',
                        title: 'Course Updated Successfully',
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
    });

}

function deleteRow(id) {
    $.ajax({
        url: 'phpScripts/deleteCourse.php',
        type: 'POST',
        data: { id: id },
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