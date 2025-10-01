// Projects page functionality
class ProjectsManager {
    constructor() {
        this.projects = [];
        this.filteredProjects = [];
        this.currentFilters = {
            search: '',
            category: 'all',
            status: 'all'
        };
        this.init();
    }

    async init() {
        try {
            await this.loadProjects();
        } catch (error) {
            console.log('Loading default projects');
            this.projects = this.getDefaultProjects();
            this.filteredProjects = [...this.projects];
        }
        this.setupEventListeners();
        this.renderProjects();
    }

    async loadProjects() {
        const response = await fetch('../assets/data/projects.json');
        this.projects = await response.json();
        this.filteredProjects = [...this.projects];
    }

    getDefaultProjects() {
        return [
            {
                id: 'amazon-appstore-automation',
                title: 'Amazon Appstore Automation Framework',
                description: 'Comprehensive end-to-end automation framework for testing Amazon Appstore applications across multiple platforms.',
                technologies: ['Python', 'Selenium', 'Pytest', 'Jenkins', 'Docker'],
                category: 'Web Testing',
                status: 'Active',
                featured: true
            },
            {
                id: 'fire-tv-performance-testing',
                title: 'Fire TV Performance Testing Suite',
                description: 'Advanced performance testing framework for Fire TV applications focusing on TTFF and memory optimization.',
                technologies: ['Java', 'Appium', 'Maestro', 'Performance Testing'],
                category: 'Performance Testing',
                status: 'Completed',
                featured: true
            },
            {
                id: 'sdk-automation-framework',
                title: 'SDK Automation & Validation Framework',
                description: 'Automated testing framework for SDK validation and compatibility testing across devices.',
                technologies: ['Kotlin', 'Android Studio', 'API Testing', 'CI/CD'],
                category: 'SDK Testing',
                status: 'Active',
                featured: true
            }
        ];
    }

    setupEventListeners() {
        // Search functionality
        const searchInput = document.getElementById('project-search');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.currentFilters.search = e.target.value.toLowerCase();
                this.applyFilters();
            });
        }

        // Category filter
        const categoryBtn = document.getElementById('category-filter-btn');
        const categoryMenu = document.getElementById('category-filter-menu');
        
        if (categoryBtn && categoryMenu) {
            categoryBtn.addEventListener('click', () => {
                categoryMenu.classList.toggle('show');
            });

            categoryMenu.addEventListener('click', (e) => {
                if (e.target.classList.contains('filter-option')) {
                    const category = e.target.dataset.category;
                    this.currentFilters.category = category;
                    
                    // Update UI
                    categoryMenu.querySelectorAll('.filter-option').forEach(opt => {
                        opt.classList.remove('active');
                    });
                    e.target.classList.add('active');
                    
                    categoryBtn.querySelector('span').textContent = e.target.textContent;
                    categoryMenu.classList.remove('show');
                    
                    this.applyFilters();
                }
            });
        }

        // Status filter
        const statusBtn = document.getElementById('status-filter-btn');
        const statusMenu = document.getElementById('status-filter-menu');
        
        if (statusBtn && statusMenu) {
            statusBtn.addEventListener('click', () => {
                statusMenu.classList.toggle('show');
            });

            statusMenu.addEventListener('click', (e) => {
                if (e.target.classList.contains('filter-option')) {
                    const status = e.target.dataset.status;
                    this.currentFilters.status = status;
                    
                    // Update UI
                    statusMenu.querySelectorAll('.filter-option').forEach(opt => {
                        opt.classList.remove('active');
                    });
                    e.target.classList.add('active');
                    
                    statusBtn.querySelector('span').textContent = e.target.textContent;
                    statusMenu.classList.remove('show');
                    
                    this.applyFilters();
                }
            });
        }

        // Close dropdowns when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.filter-dropdown')) {
                document.querySelectorAll('.filter-menu').forEach(menu => {
                    menu.classList.remove('show');
                });
            }
        });

        // Project modal
        this.setupProjectModal();
    }

    setupProjectModal() {
        const modal = document.getElementById('project-modal');
        const closeBtn = modal.querySelector('.close');

        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });

        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    }

    applyFilters() {
        this.filteredProjects = this.projects.filter(project => {
            // Search filter
            const matchesSearch = !this.currentFilters.search || 
                project.title.toLowerCase().includes(this.currentFilters.search) ||
                project.description.toLowerCase().includes(this.currentFilters.search) ||
                project.technologies.some(tech => tech.toLowerCase().includes(this.currentFilters.search));

            // Category filter
            const matchesCategory = this.currentFilters.category === 'all' || 
                project.category === this.currentFilters.category;

            // Status filter
            const matchesStatus = this.currentFilters.status === 'all' || 
                project.status === this.currentFilters.status;

            return matchesSearch && matchesCategory && matchesStatus;
        });

        this.renderProjects();
    }

    renderProjects() {
        const container = document.getElementById('projects-grid');
        const noResults = document.getElementById('no-results');

        if (this.filteredProjects.length === 0) {
            container.innerHTML = '';
            noResults.style.display = 'block';
            return;
        }

        noResults.style.display = 'none';
        container.innerHTML = this.filteredProjects.map(project => 
            this.createProjectCard(project)
        ).join('');

        // Add click listeners to project cards
        container.querySelectorAll('.project-card').forEach(card => {
            card.addEventListener('click', () => {
                const projectId = card.dataset.projectId;
                this.showProjectModal(projectId);
            });
        });
    }

    createProjectCard(project) {
        const statusBadge = project.status === 'Active' ? 'badge-success' : 'badge-info';
        const featuredBadge = project.featured ? '<span class="badge badge-primary">Featured</span>' : '';
        
        return `
            <div class="project-card" data-project-id="${project.id}">
                <div class="card-content">
                    <div class="card-header">
                        <h3 class="card-title">${project.title}</h3>
                        <div class="card-badges">
                            ${featuredBadge}
                            <span class="badge ${statusBadge}">${project.status}</span>
                        </div>
                    </div>
                    <p class="card-description">${project.description}</p>
                    <div class="card-tags">
                        ${project.technologies.map(tech => `<span class="tag">${tech}</span>`).join('')}
                    </div>
                    <div class="card-footer">
                        <span class="card-category">${project.category}</span>
                    </div>
                </div>
            </div>
        `;
    }

    showProjectModal(projectId) {
        const project = this.projects.find(p => p.id === projectId);
        if (!project) return;

        const modal = document.getElementById('project-modal');
        const modalBody = document.getElementById('project-modal-body');

        modalBody.innerHTML = this.createProjectModalContent(project);
        modal.style.display = 'block';
    }

    createProjectModalContent(project) {
        const achievements = project.achievements || [];
        const challenges = project.challenges || [];
        const learnings = project.learnings || [];
        const metrics = project.metrics || {};

        return `
            <div class="project-modal-header">
                <h2>${project.title}</h2>
                <div class="project-meta">
                    <span class="badge ${project.status === 'Active' ? 'badge-success' : 'badge-info'}">${project.status}</span>
                    <span class="project-category">${project.category}</span>
                    ${project.startDate ? `<span class="project-date">Started: ${new Date(project.startDate).toLocaleDateString()}</span>` : ''}
                </div>
            </div>

            <div class="project-modal-content">
                <div class="project-description">
                    <h3>Project Overview</h3>
                    <p>${project.longDescription || project.description}</p>
                </div>

                <div class="project-technologies">
                    <h3>Technologies Used</h3>
                    <div class="tech-grid">
                        ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                    </div>
                </div>

                ${Object.keys(metrics).length > 0 ? `
                    <div class="project-metrics">
                        <h3>Key Metrics</h3>
                        <div class="metrics-grid">
                            ${Object.entries(metrics).map(([key, value]) => `
                                <div class="metric-item">
                                    <span class="metric-value">${value}</span>
                                    <span class="metric-label">${this.formatMetricLabel(key)}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}

                ${achievements.length > 0 ? `
                    <div class="project-achievements">
                        <h3>Key Achievements</h3>
                        <ul>
                            ${achievements.map(achievement => `<li>${achievement}</li>`).join('')}
                        </ul>
                    </div>
                ` : ''}

                ${challenges.length > 0 ? `
                    <div class="project-challenges">
                        <h3>Challenges Overcome</h3>
                        <ul>
                            ${challenges.map(challenge => `<li>${challenge}</li>`).join('')}
                        </ul>
                    </div>
                ` : ''}

                ${learnings.length > 0 ? `
                    <div class="project-learnings">
                        <h3>Key Learnings</h3>
                        <ul>
                            ${learnings.map(learning => `<li>${learning}</li>`).join('')}
                        </ul>
                    </div>
                ` : ''}


            </div>
        `;
    }

    formatMetricLabel(key) {
        return key.replace(/([A-Z])/g, ' $1')
                 .replace(/^./, str => str.toUpperCase())
                 .replace(/([a-z])([A-Z])/g, '$1 $2');
    }
}

// Initialize projects manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ProjectsManager();
});

// Add CSS for project modal and additional styles
const additionalStyles = `
<style>
.page-header {
    padding: 120px 0 60px;
    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
    text-align: center;
}

.page-title {
    font-size: 3rem;
    color: var(--secondary-color);
    margin-bottom: 1rem;
}

.page-description {
    font-size: 1.2rem;
    color: var(--text-secondary);
    max-width: 600px;
    margin: 0 auto;
}

.breadcrumb-section {
    padding: 100px 0 20px;
    background-color: var(--background-light);
}

.search-filter-section {
    padding: 40px 0;
    background-color: var(--background-light);
    border-bottom: 1px solid var(--border-color);
}

.projects-section {
    padding: 60px 0;
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 1rem;
}

.card-badges {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
}

.card-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 1.5rem;
    padding-top: 1rem;
    border-top: 1px solid var(--border-color);
}

.card-category {
    font-size: 0.9rem;
    color: var(--text-light);
    font-weight: 500;
}

.btn-sm {
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
}

.project-modal-content {
    max-width: 800px;
    max-height: 90vh;
    overflow-y: auto;
}

.project-modal-header {
    padding: 2rem 2rem 1rem;
    border-bottom: 1px solid var(--border-color);
}

.project-meta {
    display: flex;
    gap: 1rem;
    margin-top: 1rem;
    flex-wrap: wrap;
}

.project-date {
    font-size: 0.9rem;
    color: var(--text-secondary);
}

.project-modal-content > div {
    padding: 1.5rem 2rem;
    border-bottom: 1px solid var(--border-color);
}

.project-modal-content > div:last-child {
    border-bottom: none;
}

.tech-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
}

.tech-tag {
    background-color: var(--primary-color);
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 20px;
    font-size: 0.9rem;
    font-weight: 500;
}

.metrics-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 1rem;
}

.metric-item {
    text-align: center;
    padding: 1rem;
    background-color: var(--background-gray);
    border-radius: var(--border-radius);
}

.metric-value {
    display: block;
    font-size: 2rem;
    font-weight: 700;
    color: var(--primary-color);
}

.metric-label {
    font-size: 0.9rem;
    color: var(--text-secondary);
}

.project-achievements ul,
.project-challenges ul,
.project-learnings ul {
    list-style: none;
    padding: 0;
}

.project-achievements li,
.project-challenges li,
.project-learnings li {
    padding: 0.5rem 0;
    padding-left: 1.5rem;
    position: relative;
}

.project-achievements li::before {
    content: '✓';
    position: absolute;
    left: 0;
    color: #28a745;
    font-weight: bold;
}

.project-challenges li::before {
    content: '⚡';
    position: absolute;
    left: 0;
}

.project-learnings li::before {
    content: '💡';
    position: absolute;
    left: 0;
}

.project-actions {
    display: flex;
    gap: 1rem;
    justify-content: center;
}

.no-results {
    text-align: center;
    padding: 4rem 0;
}

.no-results-content h3 {
    color: var(--text-secondary);
    margin-bottom: 1rem;
}

.no-results-content p {
    color: var(--text-light);
}

@media (max-width: 767px) {
    .page-title {
        font-size: 2rem;
    }
    
    .search-filter-container {
        flex-direction: column;
    }
    
    .card-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.5rem;
    }
    
    .card-footer {
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
    }
    
    .project-modal-content {
        margin: 0;
        max-height: 95vh;
    }
    
    .project-modal-header,
    .project-modal-content > div {
        padding: 1rem;
    }
    
    .project-actions {
        flex-direction: column;
    }
    
    .hamburger {
        display: flex !important;
    }
}
</style>
`;

document.head.insertAdjacentHTML('beforeend', additionalStyles);