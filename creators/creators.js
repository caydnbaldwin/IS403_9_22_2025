// SocialSphere Creators Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize page animations and interactions
    initializeAnimations();
    initializeInteractions();
    initializeFunFacts();
});

// Initialize entrance animations
function initializeAnimations() {
    const cards = document.querySelectorAll('.creator-card');
    
    // Create intersection observer for scroll-triggered animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    cards.forEach(card => {
        observer.observe(card);
    });
}

// Initialize card interactions
function initializeInteractions() {
    const creatorCards = document.querySelectorAll('.creator-card');
    
    creatorCards.forEach(card => {
        // Add hover effects with mouse tracking
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
        
        // Add click interaction for mobile
        card.addEventListener('click', function() {
            const creatorName = this.querySelector('.creator-name').textContent;
            showCreatorDetails(creatorName);
        });
    });
    
    // Add profile image rotation on hover
    const profileImages = document.querySelectorAll('.profile-img');
    profileImages.forEach(img => {
        img.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05) rotate(5deg)';
        });
        
        img.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1) rotate(0deg)';
        });
    });
}

// Initialize fun facts counter animation
function initializeFunFacts() {
    const factNumbers = document.querySelectorAll('.fact-item h4');
    
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };
    
    const factObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const finalNumber = element.textContent;
                
                // Only animate numbers, not infinity symbol
                if (finalNumber !== '∞') {
                    animateCounter(element, parseInt(finalNumber));
                }
                
                factObserver.unobserve(element);
            }
        });
    }, observerOptions);
    
    factNumbers.forEach(number => {
        factObserver.observe(number);
    });
}

// Animate counter numbers
function animateCounter(element, target) {
    let current = 0;
    const increment = target / 50; // 50 steps for smooth animation
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current).toLocaleString();
    }, 30);
}

// Show creator details (for mobile interaction)
function showCreatorDetails(creatorName) {
    const creatorInfo = getCreatorInfo(creatorName);
    
    // Create a simple alert for now (could be enhanced with modal)
    if (creatorInfo) {
        const message = `${creatorInfo.name} - ${creatorInfo.role}\n\n${creatorInfo.fact}`;
        
        // On mobile, show alert; on desktop, this won't trigger due to hover effects
        if (window.innerWidth <= 768) {
            alert(message);
        }
    }
}

// Get creator information
function getCreatorInfo(name) {
    const creators = {
        'Alex Rivera': {
            name: 'Alex Rivera',
            role: 'Lead Developer',
            fact: 'Built his first website at age 12 and has been coding for over 15 years. Alex can solve a Rubik\'s cube in under 30 seconds while debugging code!'
        },
        'Sarah Chen': {
            name: 'Sarah Chen',
            role: 'UI/UX Designer',
            fact: 'Former professional ballet dancer who brings grace and elegance to every design. Sarah once designed an entire app interface during a 6-hour flight using only her iPad!'
        },
        'Marcus Johnson': {
            name: 'Marcus Johnson',
            role: 'Product Manager',
            fact: 'Former NASA engineer who worked on Mars rover missions. Marcus can still remember the exact coordinates of every rover landing site and loves stargazing!'
        },
        'Emma Rodriguez': {
            name: 'Emma Rodriguez',
            role: 'Security Specialist',
            fact: 'Ethical hacker who once helped the FBI catch cybercriminals. Emma speaks 6 languages fluently and can pick most locks in under 2 minutes!'
        }
    };
    
    return creators[name];
}

// Add smooth scrolling for back link
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('back-link') || e.target.closest('.back-link')) {
        e.preventDefault();
        
        // Add a subtle page transition effect
        document.body.style.opacity = '0.8';
        setTimeout(() => {
            window.location.href = '../index.html';
        }, 200);
    }
});

// Add keyboard navigation
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        // Go back to home page on escape
        window.location.href = '../index.html';
    }
});

// Random facts generator (Easter egg)
let clickCount = 0;
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('fact-icon')) {
        clickCount++;
        if (clickCount >= 5) {
            showEasterEgg();
            clickCount = 0;
        }
    }
});

function showEasterEgg() {
    const easterEggFacts = [
        "The team has consumed over 500 energy drinks during development!",
        "Sarah once designed wireframes on a napkin that became the final UI!",
        "Alex's rubber duck debugging companion is named 'Quackers'!",
        "Marcus has a collection of 47 NASA mission patches!",
        "Emma can hack into her own smart fridge (for science)!"
    ];
    
    const randomFact = easterEggFacts[Math.floor(Math.random() * easterEggFacts.length)];
    
    // Create a fun notification
    const notification = document.createElement('div');
    notification.innerHTML = `
        <div style="
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(45deg, #f093fb, #ff6b9d);
            color: white;
            padding: 1rem;
            border-radius: 10px;
            box-shadow: 0 10px 20px rgba(0,0,0,0.2);
            z-index: 1000;
            max-width: 300px;
            animation: slideIn 0.5s ease-out;
        ">
            <strong>🎉 Easter Egg!</strong><br>
            ${randomFact}
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 4 seconds
    setTimeout(() => {
        notification.remove();
    }, 4000);
}

// Add CSS animation for easter egg
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);