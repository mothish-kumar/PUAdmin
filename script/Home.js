
        // Type Animation Script
        $(document).ready(function(){
            
                // PDF Viewer
                pdfjsLib.getDocument('./asserts/pdf/GuideLines.pdf').promise.then(doc => {
                    const pdfContainer = document.getElementById('pdf-container');
                    let pages = doc.numPages;
                    for (let i = 1; i <= pages; i++) {
                        doc.getPage(i).then(page => {
                            var canvas = document.createElement('canvas');
                            var context = canvas.getContext('2d');
                            var viewport = page.getViewport({ scale: 1 });
                            canvas.classList.add('pdf-page');
    
                            // Set canvas size to match parent container's width
                            const containerWidth = pdfContainer.clientWidth;
                            const scale = containerWidth / viewport.width;
                            const scaledViewport = page.getViewport({ scale: scale });
                            
                            canvas.width = scaledViewport.width;
                            canvas.height = scaledViewport.height;
                            
                            page.render({
                                canvasContext: context,
                                viewport: scaledViewport
                            });
                            pdfContainer.appendChild(canvas);
                        });
                    }
                });
    
    
                // Scroll to Next Page
                const showPdfButton = document.getElementById('show-pdf-button');
                showPdfButton.addEventListener('click', function() {
                    const pdfViewerCard = document.getElementById('pdf-viewer-card');
                    pdfViewerCard.style.display = 'block';
                    pdfViewerCard.scrollIntoView({ behavior: 'smooth' });
                });
                 // Handle window resize to adjust canvas sizes
                 window.addEventListener('resize', function() {
                    const pdfContainer = document.getElementById('pdf-container');
                    const canvases = pdfContainer.querySelectorAll('canvas');
                    canvases.forEach(canvas => {
                        const context = canvas.getContext('2d');
                        const page = canvas.page;
                        const containerWidth = pdfContainer.clientWidth;
                        const scale = containerWidth / page.view[2];
                        const viewport = page.getViewport({ scale: scale });
                        
                        canvas.width = viewport.width;
                        canvas.height = viewport.height;
                        page.render({
                            canvasContext: context,
                            viewport: viewport
                        });
                    });
                });
        
        });

//get the data from database
$.ajax({
    url: 'phpScripts/onlineApplicationSettings.php',
    type: 'GET',
    dataType: 'json',
    success: function(response) {
        if (response.success) {
           data = response.data
           // Admission Year
           $('#admyear').text(data.admission_year_options);
           //page text 
           $('#typing-text').text(data.page_txt);
           const text = document.getElementById('typing-text');
           const textContent = text.innerText;
           text.innerHTML = '';

           let index = 0; 

           function type() {
               if (index < textContent.length) {
                   text.innerHTML += textContent[index];
                   index++;
                   setTimeout(type, 100); // Adjust typing speed here
               } else {
                   text.style.borderRight = 'none'; // Remove cursor at the end
               }
           }
           type();
           //applyNow and applicantLogin Buttons
           if (data.apply_now === 'Disabled'){
            $('#applNowBtn').attr("disabled", "disabled");
           }
           if(data.applicant_login === 'Disabled'){
            $('#applicantLoginBtn').attr("disabled", "disabled");
           }
           //download Options
            $(document).ready(function(){
                $("#prospectusBtn").click(function() {
                    
                    var prospectusPdfPath = './asserts/pdf/Prospectus.pdf';
                    console.log(prospectusPdfPath);
                    $("#prospectusLink").attr("href", prospectusPdfPath);
                    $("#prospectusLink")[0].click();
                });
                $("#instructionBtn").click(function() {
                    
                    var instructionPdfPath = './asserts/pdf/Instruction.pdf';
                    console.log(instructionPdfPath );
                    $("#instructionLink").attr("href", instructionPdfPath);
                    $("#instructionLink")[0].click();
                });
            });


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
