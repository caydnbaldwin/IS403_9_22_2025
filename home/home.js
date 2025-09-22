// SocialSphere Home Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    console.log('SocialSphere Home Page Loaded');
    
    // Check if user is logged in
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
        console.log('No user logged in, redirecting to landing page...');
        window.location.href = '../index.html';
        return;
    }
    
    // Get user data
    const users = JSON.parse(localStorage.getItem('socialSphereUsers'));
    const userData = users[currentUser];
    
    if (!userData) {
        console.log('User data not found, redirecting to landing page...');
        localStorage.removeItem('currentUser');
        window.location.href = '../index.html';
        return;
    }
    
    // Initialize page with user data
    initializePage(userData);
    
    // Set up event listeners
    setupEventListeners();
    
    function initializePage(user) {
        // Update navigation
        document.getElementById('navUsername').textContent = user.username;
        
        // Update welcome message
        const welcomeMessage = document.getElementById('welcomeMessage');
        const personalizedMessage = document.getElementById('personalizedMessage');
        
        const timeOfDay = getTimeOfDay();
        welcomeMessage.textContent = `${timeOfDay}, ${user.username}!`;
        
        const daysSinceJoined = getDaysSinceJoined(user.createdAt);
        let personalMessage = '';
        
        if (daysSinceJoined === 0) {
            personalMessage = "Welcome to SocialSphere! We're excited to have you join our community.";
        } else if (daysSinceJoined === 1) {
            personalMessage = "Great to see you back! Ready to explore more of what SocialSphere has to offer?";
        } else {
            personalMessage = `Welcome back! You've been part of our community for ${daysSinceJoined} days. Let's continue your journey!`;
        }
        
        personalizedMessage.textContent = personalMessage;
        
        // Update user stats
        document.getElementById('userPoints').textContent = user.points || 0;
        document.getElementById('userAchievements').textContent = (user.achievements || []).length;
        
        // Update member since
        const memberSince = document.getElementById('memberSince');
        if (daysSinceJoined === 0) {
            memberSince.textContent = 'Today';
        } else if (daysSinceJoined === 1) {
            memberSince.textContent = '1 Day';
        } else {
            memberSince.textContent = `${daysSinceJoined} Days`;
        }
        
        // Award welcome achievement if not already awarded
        awardWelcomeAchievement(user);
        
        // Update progress circle
        updateProgressCircle(user);
        
        console.log('Page initialized for user:', user.username);
    }
    
    function getTimeOfDay() {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 17) return 'Good afternoon';
        return 'Good evening';
    }
    
    function getDaysSinceJoined(createdAt) {
        const created = new Date(createdAt);
        const now = new Date();
        const diffTime = Math.abs(now - created);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    }
    
    function awardWelcomeAchievement(user) {
        const users = JSON.parse(localStorage.getItem('socialSphereUsers'));
        
        if (!user.achievements) {
            user.achievements = [];
        }
        
        const hasWelcomeAchievement = user.achievements.some(achievement => 
            achievement.id === 'welcome'
        );
        
        if (!hasWelcomeAchievement) {
            const welcomeAchievement = {
                id: 'welcome',
                name: 'Welcome to SocialSphere',
                description: 'Account Created',
                points: 10,
                earnedAt: new Date().toISOString()
            };
            
            user.achievements.push(welcomeAchievement);
            user.points = (user.points || 0) + welcomeAchievement.points;
            
            // Update localStorage
            users[currentUser] = user;
            localStorage.setItem('socialSphereUsers', JSON.stringify(users));
            
            // Update display
            document.getElementById('userPoints').textContent = user.points;
            document.getElementById('userAchievements').textContent = user.achievements.length;
            
            // Show achievement notification
            showAchievementNotification(welcomeAchievement);
            
            console.log('Welcome achievement awarded to:', user.username);
        }
    }
    
    function updateProgressCircle(user) {
        // Calculate progress based on achievements
        const totalPossibleAchievements = 4; // Welcome, First Post, Social Butterfly, Explorer
        const currentAchievements = (user.achievements || []).length;
        const progressPercentage = Math.round((currentAchievements / totalPossibleAchievements) * 100);
        
        // Update progress display
        document.getElementById('progressPercentage').textContent = `${progressPercentage}%`;
        
        // Update progress ring
        const circle = document.querySelector('.progress-ring-circle.active');
        const radius = circle.r.baseVal.value;
        const circumference = 2 * Math.PI * radius;
        const offset = circumference - (progressPercentage / 100 * circumference);
        
        circle.style.strokeDasharray = circumference;
        circle.style.strokeDashoffset = offset;
    }
    
    function showAchievementNotification(achievement) {
        // Create achievement notification
        const notification = document.createElement('div');
        notification.className = 'achievement-notification';
        notification.innerHTML = `
            <div class="achievement-notification-content">
                <i class="fas fa-trophy"></i>
                <div class="achievement-text">
                    <div class="achievement-title">Achievement Unlocked!</div>
                    <div class="achievement-name">${achievement.name}</div>
                    <div class="achievement-points">+${achievement.points} points</div>
                </div>
            </div>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 1rem;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            z-index: 1000;
            animation: slideInRight 0.5s ease-out;
        `;
        
        document.body.appendChild(notification);
        
        // Remove notification after 5 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.5s ease-in';
            setTimeout(() => {
                notification.remove();
            }, 500);
        }, 5000);
    }
    
    function setupEventListeners() {
        // Logout functionality
        document.getElementById('logoutBtn').addEventListener('click', function(e) {
            e.preventDefault();
            logout();
        });
        
        // Action card buttons
        const actionButtons = document.querySelectorAll('.action-card .btn-primary');
        actionButtons.forEach((button, index) => {
            button.addEventListener('click', function() {
                const actions = ['create-post', 'find-friends', 'explore'];
                const action = actions[index];
                console.log(`Action clicked: ${action}`);
                
                // Show coming soon message
                showComingSoonMessage(this.closest('.action-card').querySelector('h4').textContent);
            });
        });
        
        // Add hover effects to stat cards
        const statCards = document.querySelectorAll('.stat-card');
        statCards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-5px) scale(1.05)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(-5px) scale(1)';
            });
        });
    }
    
    function logout() {
        // Clear current user
        localStorage.removeItem('currentUser');
        
        // Show logout message
        const notification = document.createElement('div');
        notification.className = 'logout-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-sign-out-alt"></i>
                <span>Logging out...</span>
            </div>
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 2rem;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            z-index: 1000;
            text-align: center;
            color: #2d3748;
        `;
        
        document.body.appendChild(notification);
        
        // Redirect after 1 second
        setTimeout(() => {
            window.location.href = '../index.html';
        }, 1000);
        
        console.log('User logged out');
    }
    
    function showComingSoonMessage(feature) {
        const modal = document.createElement('div');
        modal.className = 'coming-soon-modal';
        modal.innerHTML = `
            <div class="modal-backdrop">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3><i class="fas fa-rocket me-2"></i>Coming Soon!</h3>
                        <button class="close-btn">&times;</button>
                    </div>
                    <div class="modal-body">
                        <p>The <strong>${feature}</strong> feature is currently under development and will be available soon!</p>
                        <p>Stay tuned for updates as we continue to improve SocialSphere.</p>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-primary close-modal">Got it!</button>
                    </div>
                </div>
            </div>
        `;
        
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 1000;
        `;
        
        document.body.appendChild(modal);
        
        // Close modal functionality
        const closeModal = () => modal.remove();
        modal.querySelector('.close-btn').addEventListener('click', closeModal);
        modal.querySelector('.close-modal').addEventListener('click', closeModal);
        modal.querySelector('.modal-backdrop').addEventListener('click', function(e) {
            if (e.target === this) closeModal();
        });
    }
    
    // Add CSS for animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes slideOutRight {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
        
        .coming-soon-modal .modal-backdrop {
            background: rgba(0, 0, 0, 0.5);
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 1rem;
        }
        
        .coming-soon-modal .modal-content {
            background: white;
            border-radius: 16px;
            max-width: 500px;
            width: 100%;
            overflow: hidden;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        }
        
        .coming-soon-modal .modal-header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 1.5rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .coming-soon-modal .modal-body {
            padding: 2rem;
            color: #2d3748;
        }
        
        .coming-soon-modal .modal-footer {
            padding: 1rem 2rem 2rem;
        }
        
        .coming-soon-modal .close-btn {
            background: none;
            border: none;
            color: white;
            font-size: 1.5rem;
            cursor: pointer;
            padding: 0;
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            transition: background 0.3s ease;
        }
        
        .coming-soon-modal .close-btn:hover {
            background: rgba(255, 255, 255, 0.1);
        }
    `;
    document.head.appendChild(style);
    
    console.log('Home page fully loaded for user:', currentUser);
});