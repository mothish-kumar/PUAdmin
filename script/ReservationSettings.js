


 // Fetch the nearest date and initialize the date picker
 $.ajax({
    url: 'phpScripts/getNearestDate.php',
    method: 'GET',
    dataType: 'json',
    success: function(response) {
        const nearestDate = response.date;
        $('#datePicker').datepicker({
            format: 'yyyy-mm-dd',
            autoclose: true,
            todayHighlight: true,
            orientation: 'bottom auto',
            defaultViewDate: nearestDate
        }).datepicker('setDate', nearestDate);
        console.log("Nearest Date",nearestDate);
        // Automatically load data for the nearest date
        loadReservationData(nearestDate);
    },
    error: function() {
        Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'error',
            title: 'Failed to Load Default Date',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            customClass: {
                popup: 'swalContainer',
                title: 'swalTitleError'
            }
        });
    }
});

// Function to load reservation data
function loadReservationData(date) {
    $.ajax({
        url: 'phpScripts/searchReservation.php',
        method: 'POST',
        data: { date: date },
        dataType: 'json',
        success: function(data) {
            $('#reservationTable tbody').empty();
            if(data.length > 0){
                data.forEach(function(item) {
                    $('#reservationTable tbody').append(`
                        <tr class="align-middle">
                            <td class="text-center">${item.community}</td>
                            <td><input type="text" class="form-control" name="reservation%" value="${item.reservation}"></td>
                            <td><input type="checkbox" name="check" value="${item.id}"></td>
                        </tr>
                    `);
                });
                $('#save').removeClass('d-none'); //shows the update button
            } else {
                Swal.fire({
                    toast: true,
                    position: 'top-end',
                    icon: 'error',
                    title: 'No Data Found',
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: true,
                    customClass: {
                        popup: 'swalContainer',
                        title: 'swalTitleError'
                    }
                });
                $('#save').addClass('d-none');
            }
        },
        error: function() {
            Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'error',
                title: 'Failed To Load Data',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                customClass: {
                    popup: 'swalContainer',
                    title: 'swalTitleError'
                }
            });
        }
    });
}

// Initialize the date picker
$('#datePicker').datepicker({
    format: 'yyyy-mm-dd',
    autoclose: true,
    todayHighlight: true,
    orientation: 'bottom auto'
}).on('show', function(e) {
    // Custom event handler for when the date picker is shown
    $('.datepicker-dropdown').css('width', 'auto');
    $('.datepicker-dropdown').css('margin-top', '10px');
});

//Seach Button Scripts
$('#searchButton').on('click', function() {
   const date = $('#datePicker').val();
   $.ajax({
       url: 'phpScripts/searchReservation.php',
       method: 'POST',
       data: { date: date },
       dataType: 'json',
       success: function(data) {
           $('#reservationTable tbody').empty();
           if(data.length > 0){
            data.forEach(function(item) {
                $('#reservationTable tbody').append(`
                    <tr class="align-middle">
                        <td class="text-center">${item.community}</td>
                        <td><input type="text" class="form-control" name="reservation%" value="${item.reservation}"></td>
                        <td><input type="checkbox" name="check" value="${item.id}"></td>
                    </tr>
                `);
            });
            $('#save').removeClass('d-none'); //shows the update button
           }
           else{
            Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'error',
                title: 'No Data Found',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                customClass: {
                    popup: 'swalContainer',
                    title: 'swalTitleError'
                }
            });

            $('#save').addClass('d-none');
           }
       },
       error: function() {
         Swal.fire({
             toast: true,
             position: 'top-end',
             icon: 'error',
             title: 'Failed To Load Data',
             showConfirmButton: false,
             timer: 3000,
             timerProgressBar: true,
             customClass: {
                 popup: 'swalContainer',
                 title: 'swalTitleError'
             }
         });
      }
   });
});

//Adding New Record
$(document).ready(function() {
    $('#AddButton').on('click', function() {
        const community = $('#community').val();
        const reservation = $('#reservation').val();

        $.ajax({
            url: 'phpScripts/AddDataReservation.php',
            method: 'POST',
            data: {
                community: community,
                reservation: reservation
            },
            success: function(response) {
                Swal.fire({
                    toast: true,
                    position: 'top-end',
                    icon: 'success',
                    title: 'Record Added Successfully',
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


//Remove a record
$('#deleteButton').on('click', function() {
    const ids = $('input[name="check"]:checked').map(function() {
        return $(this).val();
    }).get();
    $.ajax({
        url: 'phpScripts/DeleteDataReservation.php',
        method: 'POST',
        data: { ids: ids },
        success: function(response) {
            Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'success',
                title: 'Record Removed Successfully',
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
                title: 'Failed to Remove data',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                customClass: {
                    popup: 'swalContainer',
                    title: 'swalTitleError'
                }
            });
        }
    });
});

//update the data 
$('#save').on('click', function() {
    const data = [];
    $('#reservationTable tbody tr').each(function() {
        const id = $(this).find('input[name="check"]').val();
        const reservation = $(this).find('input[name="reservation%"]').val();
        data.push({ id: id, reservation: reservation });
    });

    $.ajax({
        url: 'phpScripts/UpdateReservation.php',
        method: 'POST',
        data: { data: data },
        success: function(response) {
            Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'success',
                title: 'Changes Updated Successfully',
                showConfirmButton: false,
                timer: 1500,
                timerProgressBar: true,
                customClass: {
                    popup: 'swalContainer',
                    title: 'swalTitleSuccess'
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
                timer: 1500,
                timerProgressBar: true,
                customClass: {
                    popup: 'swalContainer',
                    title: 'swalTitleError'
                }
            });
        }
    });
});

