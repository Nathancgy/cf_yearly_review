let totalPages = 13;
let currentPage = 0;

document.addEventListener('DOMContentLoaded', () => {
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) {
        console.log('Loading overlay display on page load:', loadingOverlay.style.display);
    }
    
    if (window.location.pathname.endsWith('report.html')) {
        try {
            const userData = JSON.parse(localStorage.getItem('userData'));
            if (!userData) {
                throw new Error('User data not found');
            }
            initializeReport(userData);
        } catch (error) {
            console.error('Error initializing report:', error);
            alert('Error loading report. Redirecting to welcome page.');
            window.location.href = 'index.html';
        }
    } else if (window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/')) {
        const userForm = document.getElementById('user-form');
        if (userForm) {
            userForm.addEventListener('submit', handleFormSubmit);
        }
    }
});

async function handleFormSubmit(event) {
    event.preventDefault();
    const handle = document.getElementById('handle').value;
    const timezone = document.getElementById('timezone').value;
    const loadingOverlay = document.getElementById('loading-overlay');
    
    try {
        loadingOverlay.classList.remove('hidden');
        const userData = await fetchUserData(handle, timezone);
        localStorage.setItem('userData', JSON.stringify(userData));
        
        // Instead of directly changing window.location, let's use a timeout
        // This ensures that the localStorage is set before navigation
        setTimeout(() => {
            window.location.href = 'report.html';
        }, 100);
    } catch (error) {
        console.error('Error fetching user data:', error);
        loadingOverlay.classList.add('hidden');
        alert('Error fetching user data: ' + error.message + '. Please try again.');
    }
}

function initializeReport(userData) {
    console.log('Initializing report with user data:', userData);
    loadPageContent(currentPage, userData);
    const prevButton = document.getElementById('prev-page');
    const nextButton = document.getElementById('next-page');
    
    console.log('Prev button:', prevButton);
    console.log('Next button:', nextButton);
    
    prevButton.addEventListener('click', () => {
        console.log('Previous button clicked');
        navigatePage(-1, userData);
    }); 
    nextButton.addEventListener('click', () => {
        console.log('Next button clicked');
        navigatePage(1, userData);
    });
    updateNavigationButtons();
}

function navigatePage(direction, userData) {
    console.log('Navigating, current page:', currentPage);
    currentPage += direction;
    if (currentPage < 0) currentPage = 0;
    if (currentPage >= totalPages) currentPage = totalPages - 1;
    console.log('New page:', currentPage);
    loadPageContent(currentPage, userData);
    updateNavigationButtons();
}

function updateNavigationButtons() {
    const prevButton = document.getElementById('prev-page');
    const nextButton = document.getElementById('next-page');
    prevButton.style.display = currentPage === 0 ? 'none' : 'block';
    nextButton.style.display = currentPage === totalPages - 1 ? 'none' : 'block';
    
    console.log('Updated button visibility - Prev:', prevButton.style.display, 'Next:', nextButton.style.display);
}

function loadPageContent(pageIndex, userData) {
    console.log('Loading page content for page:', pageIndex + 1);
    const pageContent = document.getElementById('page-content');
    pageContent.innerHTML = '';
    const pageFile = `pages/page${pageIndex + 1}/page${pageIndex + 1}.html`;
    fetch(pageFile)
        .then(response => response.text())
        .then(html => {
            pageContent.innerHTML = html;
            const script = document.createElement('script');
            script.src = `pages/page${pageIndex + 1}/page${pageIndex + 1}.js`;
            script.onload = () => {
                if (typeof window[`initPage${pageIndex + 1}`] === 'function') {
                    window[`initPage${pageIndex + 1}`](userData);
                }
            };
            document.body.appendChild(script);
        })
        .catch(err => {
            console.error('Error loading page content:', err);
            pageContent.innerHTML = '<p>Error loading page content.</p>';
        });
}
