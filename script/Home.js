
        // Type Animation Script
        document.addEventListener('DOMContentLoaded', function() {
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

            // PDF Viewer
            pdfjsLib.getDocument('asserts/pdf/Guidelines to fill .pdf').promise.then(doc => {
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