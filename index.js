// SocialSphere Landing Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    console.log('SocialSphere Landing Page Loaded');
    
    // Add smooth scrolling for any internal links
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Add hover effects for buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Initialize localStorage for user management if not exists
    if (!localStorage.getItem('socialSphereUsers')) {
        localStorage.setItem('socialSphereUsers', JSON.stringify({}));
        console.log('Initialized empty user dictionary');
    }
    
    // Check if user is already logged in and redirect to home
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
        console.log('User already logged in, redirecting to home...');
        // Uncomment the line below if you want auto-redirect for logged in users
        // window.location.href = 'home/home.html';
    }
});