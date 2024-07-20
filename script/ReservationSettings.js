


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
                    if (item.oclabel || item.ocper) {
                        $('#reservationTable tbody').append(`
                            <tr class="align-middle">
                                <td class="text-center">${item.oclabel ? item.oclabel : ''}</td>
                                <td><input type="text" class="form-control" name="reservation%" value="${item.ocper ? item.ocper : ''}"></td>
                                
                            </tr>
                        `);
                    }
                    if (item.bclabel || item.bcper) {
                        $('#reservationTable tbody').append(`
                            <tr class="align-middle">
                                <td class="text-center">${item.bclabel ? item.bclabel : ''}</td>
                                <td><input type="text" class="form-control" name="reservation%" value="${item.bcper ? item.bcper : ''}"></td>
                                
                            </tr>
                        `);
                    }
                    if (item.bcmlabel || item.bcmper) {
                        $('#reservationTable tbody').append(`
                            <tr class="align-middle">
                                <td class="text-center">${item.bcmlabel ? item.bcmlabel : ''}</td>
                                <td><input type="text" class="form-control" name="reservation%" value="${item.bcmper ? item.bcmper : ''}"></td>
                               
                            </tr>
                        `);
                    }
                    if (item.dnclabel || item.dncper) {
                        $('#reservationTable tbody').append(`
                            <tr class="align-middle">
                                <td class="text-center">${item.dnclabel ? item.dnclabel : ''}</td>
                                <td><input type="text" class="form-control" name="reservation%" value="${item.dncper ? item.dncper : ''}"></td>
                               
                            </tr>
                        `);
                    }
                    if (item.mbclabel || item.mbcper) {
                        $('#reservationTable tbody').append(`
                            <tr class="align-middle">
                                <td class="text-center">${item.mbclabel ? item.mbclabel : ''}</td>
                                <td><input type="text" class="form-control" name="reservation%" value="${item.mbcper ? item.mbcper : ''}"></td>
                                
                            </tr>
                        `);
                    }
                    if (item.sclabel || item.scper) {
                        $('#reservationTable tbody').append(`
                            <tr class="align-middle">
                                <td class="text-center">${item.sclabel ? item.sclabel : ''}</td>
                                <td><input type="text" class="form-control" name="reservation%" value="${item.scper ? item.scper : ''}"></td>
                                
                            </tr>
                        `);
                    }
                    if (item.scalabel || item.scaper) {
                        $('#reservationTable tbody').append(`
                            <tr class="align-middle">
                                <td class="text-center">${item.scalabel ? item.scalabel : ''}</td>
                                <td><input type="text" class="form-control" name="reservation%" value="${item.scaper ? item.scaper : ''}"></td>
                                
                            </tr>
                        `);
                    }
                    if (item.stlabel || item.stper) {
                        $('#reservationTable tbody').append(`
                            <tr class="align-middle">
                                <td class="text-center">${item.stlabel ? item.stlabel : ''}</td>
                                <td><input type="text" class="form-control" name="reservation%" value="${item.stper ? item.stper : ''}"></td>
                                
                            </tr>
                        `);
                    }
                    if (item.community || item.percentage) {
                        $('#reservationTable tbody').append(`
                            <tr class="align-middle">
                                <td class="text-center">${item.community ? item.community : ''}</td>
                                <td><input type="text" class="form-control" name="reservation%" value="${item.percentage ? item.percentage : ''}"></td>
                            </tr>
                        `);
                    }
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

// Initialize the date picker
$('#dateGetter').datepicker({
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
                if (item.oclabel || item.ocper) {
                    $('#reservationTable tbody').append(`
                        <tr class="align-middle">
                            <td class="text-center">${item.oclabel ? item.oclabel : ''}</td>
                            <td><input type="text" class="form-control" name="reservation%" value="${item.ocper ? item.ocper : ''}"></td>
                            
                        </tr>
                    `);
                }
                if (item.bclabel || item.bcper) {
                    $('#reservationTable tbody').append(`
                        <tr class="align-middle">
                            <td class="text-center">${item.bclabel ? item.bclabel : ''}</td>
                            <td><input type="text" class="form-control" name="reservation%" value="${item.bcper ? item.bcper : ''}"></td>
                           
                        </tr>
                    `);
                }
                if (item.bcmlabel || item.bcmper) {
                    $('#reservationTable tbody').append(`
                        <tr class="align-middle">
                            <td class="text-center">${item.bcmlabel ? item.bcmlabel : ''}</td>
                            <td><input type="text" class="form-control" name="reservation%" value="${item.bcmper ? item.bcmper : ''}"></td>
                            
                        </tr>
                    `);
                }
                if (item.dnclabel || item.dncper) {
                    $('#reservationTable tbody').append(`
                        <tr class="align-middle">
                            <td class="text-center">${item.dnclabel ? item.dnclabel : ''}</td>
                            <td><input type="text" class="form-control" name="reservation%" value="${item.dncper ? item.dncper : ''}"></td>
                           
                        </tr>
                    `);
                }
                if (item.mbclabel || item.mbcper) {
                    $('#reservationTable tbody').append(`
                        <tr class="align-middle">
                            <td class="text-center">${item.mbclabel ? item.mbclabel : ''}</td>
                            <td><input type="text" class="form-control" name="reservation%" value="${item.mbcper ? item.mbcper : ''}"></td>
                            
                        </tr>
                    `);
                }
                if (item.sclabel || item.scper) {
                    $('#reservationTable tbody').append(`
                        <tr class="align-middle">
                            <td class="text-center">${item.sclabel ? item.sclabel : ''}</td>
                            <td><input type="text" class="form-control" name="reservation%" value="${item.scper ? item.scper : ''}"></td>
                            
                        </tr>
                    `);
                }
                if (item.scalabel || item.scaper) {
                    $('#reservationTable tbody').append(`
                        <tr class="align-middle">
                            <td class="text-center">${item.scalabel ? item.scalabel : ''}</td>
                            <td><input type="text" class="form-control" name="reservation%" value="${item.scaper ? item.scaper : ''}"></td>
                          
                        </tr>
                    `);
                }
                if (item.stlabel || item.stper) {
                    $('#reservationTable tbody').append(`
                        <tr class="align-middle">
                            <td class="text-center">${item.stlabel ? item.stlabel : ''}</td>
                            <td><input type="text" class="form-control" name="reservation%" value="${item.stper ? item.stper : ''}"></td>
                         
                        </tr>
                    `);
                }
                if (item.community || item.percentage) {
                    $('#reservationTable tbody').append(`
                        <tr class="align-middle">
                            <td class="text-center">${item.community ? item.community : ''}</td>
                            <td><input type="text" class="form-control" name="reservation%" value="${item.percentage ? item.percentage : ''}"></td>
                            
                        </tr>
                    `);
                }   
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
       const OCLabel = $('#OCLabel').val();
       const OCPer = $('#OCPer').val();
       const BCLabel = $('#BCLabel').val();
       const BCPer = $('#BCPer').val();
       const BCMLabel = $('#BCMLabel').val();
       const BCMPer = $('#BCMPer').val();
       const DNCLabel = $('#DNCLabel').val();
       const DNCPer = $('#DNCPer').val();
       const MBCLabel = $('#MBCLabel').val();
       const MBCPer = $('#MBCPer').val();
       const SCLabel = $('#SCLabel').val();
       const SCPer = $('#SCPer').val();
       const SCALabel = $('#SCALabel').val();
       const SCAPer = $('#SCAPer').val();
       const STLabel = $('#STLabel').val();
       const STPer = $('#STPer').val();
       const addDate = $('#dateGetter').val();
       var data = [];
       $('#tableData tr').each(function(){
        var community = $(this).find('input[name^="Label"]').val();
        var per = $(this).find('input[name^="Per"]').val();
        if (community && per){
            data.push({
                community:community,
                per:per
            });
        }
       })
 

        $.ajax({
            url: 'phpScripts/AddDataReservation.php',
            method: 'POST',
            data: {
                OCLabel:OCLabel,OCPer:OCPer,BCLabel:BCLabel,BCPer:BCPer,BCMLabel:BCMLabel,BCMPer:BCMPer,DNCLabel:DNCLabel,DNCPer:DNCPer,MBCLabel:MBCLabel,MBCPer:MBCPer,SCLabel:SCLabel,SCPer:SCPer,SCALabel:SCALabel,SCAPer:SCAPer,STLabel:STLabel,STPer:STPer,addDate:addDate,data:JSON.stringify(data)
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


//update the data 
$('#save').on('click', function() {
    const addDate = $('#datePicker').val();
    var data = [];
    
    $('#reservationTable tbody tr').each(function(){
        var community = $(this).find('td:first').text();
        var percentage = $(this).find('input[name="reservation%"]').val();
        if (community && percentage){
            data.push({
                community: community,
                percentage: percentage,
            });
        }
    });
    console.log(addDate,data);

    $.ajax({
        url: 'phpScripts/UpdateReservation.php',
        method: 'POST',
        data: {
            addDate: addDate,
            data: JSON.stringify(data)
        },
        success: function(response) {
            Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'success',
                title: 'Changes Updated Successfully',
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

//Add Community Button Script

$(document).ready(function(){
    var index = 1;
    $('#addCommunityBtn').on('click',function(){
        var html = `<tr>
        <td><input type="text" name="Label${index}" class="form-control" id="Label${index}"></td> 
        <td><input type="text" id="Per${index}" name="Per${index}" class="form-control"></td>
        </tr>`;
        $('#tableData').append(html);
        index += 1;
    });
});
