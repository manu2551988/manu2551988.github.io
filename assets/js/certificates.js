// Certificates page functionality
class CertificatesManager {
    constructor() {
        this.certificates = [];
        this.filteredCertificates = [];
        this.currentFilters = {
            search: '',
            category: 'all',
            issuer: 'all'
        };
        this.init();
    }

    async init() {
        try {
            await this.loadCertificates();
        } catch (error) {
            console.log('Loading default certificates');
            this.certificates = this.getDefaultCertificates();
            this.filteredCertificates = [...this.certificates];
        }
        this.setupEventListeners();
        this.updateStats();
        this.renderFeaturedCertificates();
        this.renderCertificates();
    }

    async loadCertificates() {
        const response = await fetch('../assets/data/certificates.json');
        this.certificates = await response.json();
        this.filteredCertificates = [...this.certificates];
    }

    getDefaultCertificates() {
        return [
            {
                id: 'cybersecurity-ethical-hacking',
                title: 'Cyber Security and Ethical Hacking Internship Program',
                issuer: 'Edureka',
                issueDate: '2023-01-01',
                credentialId: 'PS86DDHA3',
                category: 'Cybersecurity',
                skills: ['Kali Linux', 'Ethical Hacking', 'Network Security'],
                description: 'Comprehensive cybersecurity program covering ethical hacking and penetration testing.',
                featured: true
            },
            {
                id: 'mentoring-certificate',
                title: 'Mentoring Certificate',
                issuer: 'Chronus',
                issueDate: '2023-12-01',
                credentialId: 'cf-79baab02-765c-4fb3-8f43-b043a8c499b0-1250404',
                category: 'Leadership',
                skills: ['Mentoring', 'Leadership', 'Communication'],
                description: 'Professional mentoring certification for guiding junior team members.',
                featured: true
            },
            {
                id: 'qspiders-software-testing',
                title: 'Software Testing Training Certificate',
                issuer: 'QSpiders - Software Testing Training Institute',
                issueDate: '2020-01-01',
                category: 'Software Testing',
                skills: ['Manual Testing', 'Selenium', 'Core Java'],
                description: 'Comprehensive software testing training covering manual and automation testing.',
                featured: true
            }
        ];
    }

    setupEventListeners() {
        // Search functionality
        const searchInput = document.getElementById('certificate-search');
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

        // Issuer filter
        const issuerBtn = document.getElementById('issuer-filter-btn');
        const issuerMenu = document.getElementById('issuer-filter-menu');
        
        if (issuerBtn && issuerMenu) {
            issuerBtn.addEventListener('click', () => {
                issuerMenu.classList.toggle('show');
            });

            issuerMenu.addEventListener('click', (e) => {
                if (e.target.classList.contains('filter-option')) {
                    const issuer = e.target.dataset.issuer;
                    this.currentFilters.issuer = issuer;
                    
                    // Update UI
                    issuerMenu.querySelectorAll('.filter-option').forEach(opt => {
                        opt.classList.remove('active');
                    });
                    e.target.classList.add('active');
                    
                    issuerBtn.querySelector('span').textContent = e.target.textContent;
                    issuerMenu.classList.remove('show');
                    
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

        // Certificate modal
        this.setupCertificateModal();
    }

    setupCertificateModal() {
        const modal = document.getElementById('certificate-modal');
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

    updateStats() {
        const totalCertificates = this.certificates.length;
        const skillAreas = [...new Set(this.certificates.map(cert => cert.category))].length;
        const mostRecentYear = Math.max(...this.certificates.map(cert => new Date(cert.issueDate).getFullYear()));
        const institutions = [...new Set(this.certificates.map(cert => cert.issuer))].length;

        document.getElementById('total-certificates').textContent = `${totalCertificates}+`;
        document.getElementById('skill-areas').textContent = skillAreas;
        document.getElementById('recent-year').textContent = mostRecentYear;
        document.getElementById('institutions').textContent = `${institutions}+`;
    }

    applyFilters() {
        this.filteredCertificates = this.certificates.filter(certificate => {
            // Search filter
            const matchesSearch = !this.currentFilters.search || 
                certificate.title.toLowerCase().includes(this.currentFilters.search) ||
                certificate.issuer.toLowerCase().includes(this.currentFilters.search) ||
                certificate.skills.some(skill => skill.toLowerCase().includes(this.currentFilters.search)) ||
                certificate.description.toLowerCase().includes(this.currentFilters.search);

            // Category filter
            const matchesCategory = this.currentFilters.category === 'all' || 
                certificate.category === this.currentFilters.category;

            // Issuer filter
            const matchesIssuer = this.currentFilters.issuer === 'all' || 
                certificate.issuer.includes(this.currentFilters.issuer);

            return matchesSearch && matchesCategory && matchesIssuer;
        });

        this.renderCertificates();
    }

    renderFeaturedCertificates() {
        const container = document.getElementById('featured-certificates-grid');
        if (!container) return;

        const featuredCertificates = this.certificates.filter(cert => cert.featured).slice(0, 3);
        
        container.innerHTML = featuredCertificates.map(certificate => 
            this.createFeaturedCertificateCard(certificate)
        ).join('');

        // Add click listeners
        container.querySelectorAll('.certificate-card').forEach(card => {
            card.addEventListener('click', () => {
                const certificateId = card.dataset.certificateId;
                this.showCertificateModal(certificateId);
            });
        });
    }

    renderCertificates() {
        const container = document.getElementById('certificates-grid');
        const noResults = document.getElementById('no-results');

        if (this.filteredCertificates.length === 0) {
            container.innerHTML = '';
            noResults.style.display = 'block';
            return;
        }

        noResults.style.display = 'none';
        container.innerHTML = this.filteredCertificates.map(certificate => 
            this.createCertificateCard(certificate)
        ).join('');

        // Add click listeners
        container.querySelectorAll('.certificate-card').forEach(card => {
            card.addEventListener('click', () => {
                const certificateId = card.dataset.certificateId;
                this.showCertificateModal(certificateId);
            });
        });
    }

    createFeaturedCertificateCard(certificate) {
        const issueYear = new Date(certificate.issueDate).getFullYear();
        const isRecent = issueYear >= 2023;
        
        return `
            <div class="certificate-card featured-certificate" data-certificate-id="${certificate.id}">
                <div class="certificate-header">
                    <div class="certificate-badges">
                        <span class="badge badge-primary">Featured</span>
                        ${isRecent ? '<span class="badge badge-success">Recent</span>' : ''}
                    </div>
                    <div class="certificate-icon">🏆</div>
                </div>
                <div class="certificate-content">
                    <h3 class="certificate-title">${certificate.title}</h3>
                    <div class="certificate-issuer">${certificate.issuer}</div>
                    <div class="certificate-date">${new Date(certificate.issueDate).toLocaleDateString()}</div>
                    <p class="certificate-description">${certificate.description}</p>
                    <div class="certificate-skills">
                        ${certificate.skills.slice(0, 3).map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                        ${certificate.skills.length > 3 ? `<span class="skill-tag">+${certificate.skills.length - 3} more</span>` : ''}
                    </div>
                </div>
            </div>
        `;
    }

    createCertificateCard(certificate) {
        const issueYear = new Date(certificate.issueDate).getFullYear();
        const isRecent = issueYear >= 2023;
        const hasExpiry = certificate.expiryDate && new Date(certificate.expiryDate) > new Date();
        
        return `
            <div class="certificate-card" data-certificate-id="${certificate.id}">
                <div class="certificate-header">
                    <div class="certificate-category">${certificate.category}</div>
                    <div class="certificate-badges">
                        ${isRecent ? '<span class="badge badge-success">Recent</span>' : ''}
                        ${hasExpiry ? '<span class="badge badge-warning">Expires</span>' : ''}
                    </div>
                </div>
                <div class="certificate-content">
                    <h3 class="certificate-title">${certificate.title}</h3>
                    <div class="certificate-issuer">${certificate.issuer}</div>
                    <div class="certificate-date">Issued: ${new Date(certificate.issueDate).toLocaleDateString()}</div>
                    ${certificate.credentialId ? `<div class="credential-id">ID: ${certificate.credentialId}</div>` : ''}
                    <div class="certificate-skills">
                        ${certificate.skills.slice(0, 4).map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                        ${certificate.skills.length > 4 ? `<span class="skill-tag">+${certificate.skills.length - 4}</span>` : ''}
                    </div>
                </div>
                <div class="certificate-footer">
                    ${certificate.verificationUrl ? `<a href="${certificate.verificationUrl}" target="_blank" class="btn btn-secondary btn-sm">Verify</a>` : ''}
                </div>
            </div>
        `;
    }

    showCertificateModal(certificateId) {
        const certificate = this.certificates.find(c => c.id === certificateId);
        if (!certificate) return;

        const modal = document.getElementById('certificate-modal');
        const modalBody = document.getElementById('certificate-modal-body');

        modalBody.innerHTML = this.createCertificateModalContent(certificate);
        modal.style.display = 'block';

        // Add verification button functionality
        const verifyBtn = modalBody.querySelector('.verify-btn');
        if (verifyBtn && certificate.verificationUrl) {
            verifyBtn.addEventListener('click', () => {
                window.open(certificate.verificationUrl, '_blank');
            });
        }
    }

    createCertificateModalContent(certificate) {
        const issueDate = new Date(certificate.issueDate);
        const expiryDate = certificate.expiryDate ? new Date(certificate.expiryDate) : null;
        const isExpired = expiryDate && expiryDate < new Date();
        const isRecent = issueDate.getFullYear() >= 2023;

        return `
            <div class="certificate-modal-header">
                <div class="certificate-icon-large">🏆</div>
                <h2>${certificate.title}</h2>
                <div class="certificate-meta">
                    <span class="certificate-issuer-large">${certificate.issuer}</span>
                    <div class="certificate-badges-large">
                        <span class="badge ${isRecent ? 'badge-success' : 'badge-info'}">${certificate.category}</span>
                        ${isRecent ? '<span class="badge badge-primary">Recent</span>' : ''}
                        ${isExpired ? '<span class="badge badge-danger">Expired</span>' : ''}
                    </div>
                </div>
            </div>

            <div class="certificate-modal-content">
                <div class="certificate-details">
                    <h3>Certificate Details</h3>
                    <div class="details-grid">
                        <div class="detail-item">
                            <span class="detail-label">Issue Date:</span>
                            <span class="detail-value">${issueDate.toLocaleDateString()}</span>
                        </div>
                        ${expiryDate ? `
                            <div class="detail-item">
                                <span class="detail-label">Expiry Date:</span>
                                <span class="detail-value ${isExpired ? 'expired' : ''}">${expiryDate.toLocaleDateString()}</span>
                            </div>
                        ` : ''}
                        ${certificate.credentialId ? `
                            <div class="detail-item">
                                <span class="detail-label">Credential ID:</span>
                                <span class="detail-value">${certificate.credentialId}</span>
                            </div>
                        ` : ''}
                        <div class="detail-item">
                            <span class="detail-label">Category:</span>
                            <span class="detail-value">${certificate.category}</span>
                        </div>
                    </div>
                </div>

                <div class="certificate-description">
                    <h3>Description</h3>
                    <p>${certificate.description}</p>
                </div>

                <div class="certificate-skills-section">
                    <h3>Skills Covered</h3>
                    <div class="skills-grid">
                        ${certificate.skills.map(skill => `<span class="skill-badge">${skill}</span>`).join('')}
                    </div>
                </div>

                ${certificate.modules && certificate.modules.length > 0 ? `
                    <div class="certificate-modules">
                        <h3>Course Modules</h3>
                        <ul class="modules-list">
                            ${certificate.modules.map(module => `<li>${module}</li>`).join('')}
                        </ul>
                    </div>
                ` : ''}

                <div class="certificate-actions">
                    ${certificate.verificationUrl ? `
                        <button class="btn btn-primary verify-btn">
                            Verify Certificate
                        </button>
                    ` : ''}
                    <button class="btn btn-secondary" onclick="window.print()">
                        Print Details
                    </button>
                </div>
            </div>
        `;
    }
}

// Initialize certificates manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new CertificatesManager();
});

// Add CSS for certificates-specific styles
const certificatesStyles = `
<style>
.certificates-stats {
    padding: 40px 0;
    background-color: var(--background-gray);
}

.stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 2rem;
}

.stat-card {
    background-color: var(--background-light);
    padding: 2rem;
    border-radius: var(--border-radius);
    text-align: center;
    box-shadow: var(--shadow-light);
    transition: var(--transition);
}

.stat-card:hover {
    transform: translateY(-5px);
    box-shadow: var(--shadow-medium);
}

.stat-number {
    font-size: 3rem;
    font-weight: 700;
    color: var(--primary-color);
    display: block;
    margin-bottom: 0.5rem;
}

.stat-label {
    color: var(--text-secondary);
    font-weight: 500;
}

.featured-certificates-section {
    padding: 60px 0;
    background-color: var(--background-light);
}

.featured-certificates-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 2rem;
}

.featured-certificate {
    background: linear-gradient(135deg, var(--primary-color), #e68900);
    color: white;
    border: none;
}

.featured-certificate .certificate-title,
.featured-certificate .certificate-issuer,
.featured-certificate .certificate-date,
.featured-certificate .certificate-description {
    color: white;
}

.certificates-section {
    padding: 60px 0;
    background-color: var(--background-gray);
}

.certificates-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
}

.certificate-card {
    background-color: var(--background-light);
    border-radius: var(--border-radius);
    padding: 1.5rem;
    box-shadow: var(--shadow-light);
    transition: var(--transition);
    cursor: pointer;
    border: 1px solid var(--border-color);
}

.certificate-card:hover {
    transform: translateY(-5px);
    box-shadow: var(--shadow-medium);
}

.certificate-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 1rem;
}

.certificate-category {
    background-color: var(--background-gray);
    color: var(--text-primary);
    padding: 0.25rem 0.75rem;
    border-radius: 15px;
    font-size: 0.8rem;
    font-weight: 500;
}

.certificate-badges {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
}

.certificate-icon {
    font-size: 2rem;
}

.certificate-title {
    font-size: 1.2rem;
    color: var(--secondary-color);
    margin-bottom: 0.5rem;
    line-height: 1.3;
}

.certificate-issuer {
    font-weight: 600;
    color: var(--primary-color);
    margin-bottom: 0.25rem;
}

.certificate-date {
    font-size: 0.9rem;
    color: var(--text-light);
    margin-bottom: 1rem;
}

.credential-id {
    font-size: 0.8rem;
    color: var(--text-light);
    font-family: monospace;
    margin-bottom: 1rem;
}

.certificate-description {
    color: var(--text-secondary);
    margin-bottom: 1rem;
    line-height: 1.5;
}

.certificate-skills {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-bottom: 1rem;
}

.skill-tag {
    background-color: var(--background-gray);
    color: var(--text-primary);
    padding: 0.25rem 0.5rem;
    border-radius: 12px;
    font-size: 0.8rem;
}

.featured-certificate .skill-tag {
    background-color: rgba(255, 255, 255, 0.2);
    color: white;
}

.certificate-footer {
    display: flex;
    gap: 1rem;
    justify-content: space-between;
    align-items: center;
    margin-top: 1.5rem;
    padding-top: 1rem;
    border-top: 1px solid var(--border-color);
}

.certificate-modal-content {
    max-width: 800px;
    max-height: 90vh;
    overflow-y: auto;
}

.certificate-modal-header {
    text-align: center;
    padding: 2rem;
    background: linear-gradient(135deg, var(--primary-color), #e68900);
    color: white;
}

.certificate-icon-large {
    font-size: 4rem;
    margin-bottom: 1rem;
}

.certificate-modal-header h2 {
    color: white;
    margin-bottom: 1rem;
}

.certificate-issuer-large {
    font-size: 1.2rem;
    font-weight: 600;
    display: block;
    margin-bottom: 1rem;
}

.certificate-badges-large {
    display: flex;
    gap: 0.5rem;
    justify-content: center;
    flex-wrap: wrap;
}

.certificate-modal-content > div {
    padding: 1.5rem 2rem;
    border-bottom: 1px solid var(--border-color);
}

.certificate-modal-content > div:last-child {
    border-bottom: none;
}

.details-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
}

.detail-item {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
}

.detail-label {
    font-weight: 600;
    color: var(--text-secondary);
    font-size: 0.9rem;
}

.detail-value {
    color: var(--text-primary);
    font-weight: 500;
}

.detail-value.expired {
    color: #dc3545;
}

.skills-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
}

.skill-badge {
    background-color: var(--primary-color);
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 20px;
    font-size: 0.9rem;
    font-weight: 500;
}

.modules-list {
    list-style: none;
    padding: 0;
}

.modules-list li {
    padding: 0.5rem 0;
    padding-left: 1.5rem;
    position: relative;
    border-bottom: 1px solid var(--border-color);
}

.modules-list li:last-child {
    border-bottom: none;
}

.modules-list li::before {
    content: '📚';
    position: absolute;
    left: 0;
}

.certificate-actions {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
}

@media (max-width: 767px) {
    .stats-grid {
        grid-template-columns: repeat(2, 1fr);
    }
    
    .featured-certificates-grid,
    .certificates-grid {
        grid-template-columns: 1fr;
    }
    
    .certificate-header {
        flex-direction: column;
        gap: 0.5rem;
        align-items: flex-start;
    }
    
    .certificate-footer {
        flex-direction: column;
        gap: 1rem;
        align-items: stretch;
    }
    
    .certificate-modal-content > div {
        padding: 1rem;
    }
    
    .details-grid {
        grid-template-columns: 1fr;
    }
    
    .certificate-actions {
        flex-direction: column;
    }
}
</style>
`;

document.head.insertAdjacentHTML('beforeend', certificatesStyles);