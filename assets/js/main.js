// Main JavaScript functionality
class PortfolioApp {
    constructor() {
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupScrollEffects();
        this.setupCareerChat();
        this.loadFeaturedContent();
        this.setupBackToTop();
        this.setupLazyLoading();
    }

    // Navigation functionality
    setupNavigation() {
        const navbar = document.getElementById('navbar');
        const hamburger = document.getElementById('hamburger');
        const navMenu = document.getElementById('nav-menu');
        const navLinks = document.querySelectorAll('.nav-link');

        // Sticky navbar on scroll
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });

        // Mobile menu toggle
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close mobile menu when clicking on links
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });

        // Smooth scrolling for navigation links
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href.startsWith('#')) {
                    e.preventDefault();
                    const target = document.querySelector(href);
                    if (target) {
                        target.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                }
            });
        });
    }

    // Scroll effects and animations
    setupScrollEffects() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                }
            });
        }, observerOptions);

        // Observe sections for fade-in animation
        const sections = document.querySelectorAll('section');
        sections.forEach(section => {
            observer.observe(section);
        });

        // Active navigation highlighting
        const navObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    const navLink = document.querySelector(`a[href="#${id}"]`);
                    
                    // Remove active class from all nav links
                    document.querySelectorAll('.nav-link').forEach(link => {
                        link.classList.remove('active');
                    });
                    
                    // Add active class to current nav link
                    if (navLink) {
                        navLink.classList.add('active');
                    }
                }
            });
        }, { threshold: 0.5 });

        sections.forEach(section => {
            if (section.id) {
                navObserver.observe(section);
            }
        });
    }

    // Contact functionality (removed form, using direct contact methods)
    setupContactMethods() {
        // Contact tiles are now direct links, no form processing needed
        console.log('Contact methods initialized - using direct email/phone links');
    }

    // Career chat functionality
    setupCareerChat() {
        const chatModal = document.getElementById('career-chat-modal');
        const chatLinks = document.querySelectorAll('.chat-link, a[href="#career-chat"]');
        const closeBtn = chatModal.querySelector('.close');
        const chatInput = document.getElementById('chat-input');
        const sendBtn = document.getElementById('send-chat');
        const chatMessages = document.getElementById('chat-messages');

        // Open chat modal
        chatLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                chatModal.style.display = 'block';
                chatInput.focus();
            });
        });

        // Close chat modal
        closeBtn.addEventListener('click', () => {
            chatModal.style.display = 'none';
        });

        window.addEventListener('click', (e) => {
            if (e.target === chatModal) {
                chatModal.style.display = 'none';
            }
        });

        // Send message
        sendBtn.addEventListener('click', () => {
            this.sendChatMessage();
        });

        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendChatMessage();
            }
        });

        // Load chat responses
        this.loadChatResponses();
        
        // Add initial suggestions
        this.addChatSuggestions();
    }

    async loadChatResponses() {
        try {
            const response = await fetch('assets/data/chat-responses.json');
            this.chatResponses = await response.json();
        } catch (error) {
            console.error('Error loading chat responses:', error);
            this.chatResponses = this.getDefaultChatResponses();
        }
    }

    getDefaultChatResponses() {
        return {
            greetings: [
                "Hello! Great to connect with you. What would you like to know about QA careers?",
                "Hi there! I'm excited to chat about quality assurance and testing. What's on your mind?",
                "Hey! Thanks for reaching out. How can I help you with your QA journey?"
            ],
            qa_career: [
                "QA is an amazing field! At Amazon, I work on automation, SDK testing, and performance optimization. The key is to start with manual testing fundamentals, then move into automation tools like Selenium and Appium.",
                "Getting into QA requires curiosity and attention to detail. I'd recommend starting with basic testing concepts, learning SQL, and getting hands-on with tools like Postman for API testing.",
                "The QA field is evolving rapidly with AI and automation. Focus on learning programming (Python/Java), understanding CI/CD pipelines, and developing both technical and analytical skills."
            ],
            amazon_culture: [
                "Amazon's culture is unique - we're customer-obsessed and data-driven. The leadership principles guide everything we do. It's fast-paced but incredibly rewarding.",
                "Working at Amazon has taught me to think big and dive deep. The learning opportunities are endless, and you're constantly challenged to innovate and improve processes.",
                "Amazon values ownership and results. As a QAE, I own the quality of our products end-to-end, which means collaborating across teams and thinking like a customer."
            ],
            testing_tools: [
                "I work with a variety of tools: Selenium for web automation, Maestro for mobile testing, Postman for API testing, and Jenkins for CI/CD. The key is choosing the right tool for each scenario.",
                "My tech stack includes Python, Java, Selenium, Appium, Cypress, and AWS services. I also use performance testing tools for TTFF and memory profiling.",
                "Tool selection depends on your project needs. For beginners, I'd recommend starting with Selenium WebDriver, Postman, and learning a programming language like Python or Java."
            ],
            default: [
                "That's a great question! Could you be more specific about what aspect of QA or testing you'd like to discuss?",
                "I'd love to help you with that. Can you tell me more about your specific situation or what you're trying to achieve?",
                "Interesting topic! Feel free to ask me about QA careers, testing methodologies, automation, or working at Amazon."
            ]
        };
    }

    sendChatMessage() {
        const chatInput = document.getElementById('chat-input');
        const message = chatInput.value.trim();
        
        if (!message) return;

        // Add user message
        this.addChatMessage(message, 'user');
        chatInput.value = '';

        // Generate bot response
        setTimeout(() => {
            const response = this.generateChatResponse(message);
            this.addChatMessage(response, 'bot');
        }, 1000);
    }

    addChatMessage(message, sender) {
        const chatMessages = document.getElementById('chat-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        messageContent.textContent = message;
        
        messageDiv.appendChild(messageContent);
        chatMessages.appendChild(messageDiv);
        
        // Add suggestions after bot message
        if (sender === 'bot') {
            setTimeout(() => {
                this.addChatSuggestions();
            }, 500);
        }
        
        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    generateChatResponse(userMessage) {
        const message = userMessage.toLowerCase();
        
        // Enhanced keyword matching for responses
        if (message.includes('hello') || message.includes('hi') || message.includes('hey') || message.includes('greetings')) {
            return this.getRandomResponse('greetings');
        } else if (message.includes('contact') || message.includes('reach') || message.includes('email') || message.includes('phone')) {
            return this.getRandomResponse('contact');
        } else if (message.includes('help') || message.includes('assist') || message.includes('support')) {
            return this.getRandomResponse('help');
        } else if (message.includes('qa') || message.includes('career') || message.includes('job') || message.includes('quality assurance')) {
            return this.getRandomResponse('qa_career');
        } else if (message.includes('amazon') || message.includes('culture') || message.includes('work') || message.includes('leadership')) {
            return this.getRandomResponse('amazon_culture');
        } else if (message.includes('tool') || message.includes('selenium') || message.includes('postman') || message.includes('appium')) {
            return this.getRandomResponse('testing_tools');
        } else if (message.includes('automation') || message.includes('framework') || message.includes('script')) {
            return this.getRandomResponse('automation');
        } else if (message.includes('performance') || message.includes('ttff') || message.includes('memory') || message.includes('speed')) {
            return this.getRandomResponse('performance_testing');
        } else if (message.includes('mobile') || message.includes('android') || message.includes('ios') || message.includes('fire tv')) {
            return this.getRandomResponse('mobile_testing');
        } else if (message.includes('api') || message.includes('rest') || message.includes('endpoint') || message.includes('service')) {
            return this.getRandomResponse('api_testing');
        } else if (message.includes('advice') || message.includes('tip') || message.includes('guidance') || message.includes('recommend')) {
            return this.getRandomResponse('career_advice');
        } else if (message.includes('interview') || message.includes('hiring') || message.includes('application') || message.includes('join amazon')) {
            return this.getRandomResponse('amazon_interview');
        } else if (message.includes('learn') || message.includes('study') || message.includes('course') || message.includes('book')) {
            return this.getRandomResponse('learning_resources');
        } else if (message.includes('balance') || message.includes('life') || message.includes('stress') || message.includes('time')) {
            return this.getRandomResponse('work_life_balance');
        } else {
            return this.getRandomResponse('default');
        }
    }

    getRandomResponse(category) {
        const responses = this.chatResponses?.[category] || this.getDefaultChatResponses()[category];
        return responses[Math.floor(Math.random() * responses.length)];
    }
    

    
    // Chat Suggestions
    addChatSuggestions() {
        const chatMessages = document.getElementById('chat-messages');
        const existingSuggestions = chatMessages.querySelector('.chat-suggestions');
        
        if (existingSuggestions) {
            existingSuggestions.remove();
        }
        
        const suggestions = [
            'Tell me about QA career paths',
            'How is Amazon culture?',
            'What testing tools do you use?',
            'Performance testing tips',
            'Mobile testing strategies',
            'How to contact you?'
        ];
        
        const suggestionsDiv = document.createElement('div');
        suggestionsDiv.className = 'chat-suggestions';
        suggestionsDiv.innerHTML = `
            <div class="suggestions-title">Quick questions:</div>
            <div class="suggestions-buttons">
                ${suggestions.map(suggestion => 
                    `<button class="suggestion-btn" onclick="document.getElementById('chat-input').value='${suggestion}'; document.getElementById('send-chat').click();">${suggestion}</button>`
                ).join('')}
            </div>
        `;
        
        chatMessages.appendChild(suggestionsDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Load featured content
    async loadFeaturedContent() {
        try {
            await Promise.all([
                this.loadFeaturedProjects(),
                this.loadFeaturedBlog()
            ]);
        } catch (error) {
            console.error('Error loading featured content:', error);
        }
    }

    async loadFeaturedProjects() {
        try {
            const response = await fetch('assets/data/projects.json');
            const projects = await response.json();
            const featuredProjects = projects.filter(p => p.featured).slice(0, 3);
            
            const container = document.getElementById('featured-projects');
            if (container) {
                container.innerHTML = featuredProjects.map(project => 
                    this.createProjectCard(project)
                ).join('');
            }
        } catch (error) {
            console.error('Error loading projects:', error);
            this.loadDefaultProjects();
        }
    }

    async loadFeaturedBlog() {
        try {
            const response = await fetch('assets/data/blog-posts.json');
            const posts = await response.json();
            const featuredPosts = posts.filter(p => p.featured).slice(0, 3);
            
            const container = document.getElementById('featured-blog');
            if (container) {
                container.innerHTML = featuredPosts.map(post => 
                    this.createBlogCard(post)
                ).join('');
            }
        } catch (error) {
            console.error('Error loading blog posts:', error);
            this.loadDefaultBlog();
        }
    }

    createProjectCard(project) {
        return `
            <div class="project-card">
                <div class="card-content">
                    <h3 class="card-title">${project.title}</h3>
                    <p class="card-description">${project.description}</p>
                    <div class="card-tags">
                        ${project.technologies.map(tech => `<span class="tag">${tech}</span>`).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    createBlogCard(post) {
        return `
            <div class="blog-card">
                <div class="card-content">
                    <h3 class="card-title">${post.title}</h3>
                    <p class="card-description">${post.excerpt}</p>
                    <div class="card-meta">
                        <span class="date">${new Date(post.date).toLocaleDateString()}</span>
                        <span class="read-time">${post.readTime} min read</span>
                    </div>
                </div>
            </div>
        `;
    }

    loadDefaultProjects() {
        const defaultProjects = [
            {
                id: 'amazon-appstore-automation',
                title: 'Amazon Appstore Automation Framework',
                description: 'Comprehensive automation framework for testing Amazon Appstore applications across multiple platforms.',
                technologies: ['Python', 'Selenium', 'Pytest', 'Jenkins'],
                featured: true
            },
            {
                id: 'fire-tv-performance-testing',
                title: 'Fire TV Performance Testing Suite',
                description: 'Performance testing framework for Fire TV applications focusing on TTFF and memory optimization.',
                technologies: ['Java', 'Appium', 'Maestro', 'Performance Testing'],
                featured: true
            },
            {
                id: 'sdk-automation-framework',
                title: 'SDK Automation & Validation',
                description: 'Automated testing framework for SDK validation and compatibility testing across devices.',
                technologies: ['Kotlin', 'Android Studio', 'API Testing', 'CI/CD'],
                featured: true
            }
        ];

        const container = document.getElementById('featured-projects');
        if (container) {
            container.innerHTML = defaultProjects.map(project => 
                `<div class="project-card">
                    <div class="card-content">
                        <h3 class="card-title">${project.title}</h3>
                        <p class="card-description">${project.description}</p>
                        <div class="card-tags">
                            ${project.technologies.map(tech => `<span class="tag">${tech}</span>`).join('')}
                        </div>
                    </div>
                </div>`
            ).join('');
        }
    }

    loadDefaultBlog() {
        const defaultPosts = [
            {
                id: 'qa-automation-best-practices',
                title: 'QA Automation Best Practices at Scale',
                excerpt: 'Learn the key principles for building maintainable and scalable automation frameworks in enterprise environments.',
                date: '2024-01-15',
                readTime: 8,
                featured: true
            },
            {
                id: 'performance-testing-mobile-apps',
                title: 'Performance Testing for Mobile Applications',
                excerpt: 'Deep dive into mobile app performance testing techniques, tools, and metrics that matter.',
                date: '2024-01-10',
                readTime: 12,
                featured: true
            },
            {
                id: 'amazon-qa-culture',
                title: 'Quality Culture at Amazon: Lessons Learned',
                excerpt: 'Insights into how Amazon maintains high quality standards and what QA engineers can learn from it.',
                date: '2024-01-05',
                readTime: 6,
                featured: true
            }
        ];

        const container = document.getElementById('featured-blog');
        if (container) {
            container.innerHTML = defaultPosts.map(post => 
                `<div class="blog-card">
                    <div class="card-content">
                        <h3 class="card-title">${post.title}</h3>
                        <p class="card-description">${post.excerpt}</p>
                        <div class="card-meta">
                            <span class="date">${new Date(post.date).toLocaleDateString()}</span>
                            <span class="read-time">${post.readTime} min read</span>
                        </div>
                    </div>
                </div>`
            ).join('');
        }
    }

    // Back to top functionality
    setupBackToTop() {
        const backToTopBtn = document.createElement('div');
        backToTopBtn.className = 'back-to-top';
        backToTopBtn.innerHTML = '↑';
        backToTopBtn.setAttribute('aria-label', 'Back to top');
        document.body.appendChild(backToTopBtn);

        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        });

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Lazy loading for images
    setupLazyLoading() {
        const images = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('loading');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => {
            imageObserver.observe(img);
        });
    }

    // Utility function to show toast notifications
    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        
        document.body.appendChild(toast);
        
        // Show toast
        setTimeout(() => {
            toast.classList.add('show');
        }, 100);
        
        // Hide toast after 5 seconds
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 5000);
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PortfolioApp();
});

// Service Worker registration for PWA capabilities
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}