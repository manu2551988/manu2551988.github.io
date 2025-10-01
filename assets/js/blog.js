// Blog page functionality
class BlogManager {
    constructor() {
        this.posts = [];
        this.filteredPosts = [];
        this.currentFilters = {
            search: '',
            category: 'all',
            sort: 'latest'
        };
        this.currentPage = 1;
        this.postsPerPage = 6;
        this.init();
    }

    async init() {
        try {
            await this.loadPosts();
        } catch (error) {
            console.log('Loading default posts');
            this.posts = this.getDefaultPosts();
            this.filteredPosts = [...this.posts];
        }
        this.setupEventListeners();
        this.renderFeaturedPosts();
        this.renderPosts();
    }

    async loadPosts() {
        const response = await fetch('../assets/data/blog-posts.json');
        this.posts = await response.json();
        this.filteredPosts = [...this.posts];
    }

    getDefaultPosts() {
        return [
            {
                id: 'qa-automation-best-practices',
                title: 'QA Automation Best Practices at Scale',
                excerpt: 'Learn the key principles for building maintainable and scalable automation frameworks in enterprise environments.',
                author: 'Manu Kakkar',
                date: '2024-01-15',
                readTime: 8,
                category: 'Automation',
                tags: ['automation', 'best-practices', 'framework'],
                featured: true,
                published: true
            },
            {
                id: 'performance-testing-mobile-apps',
                title: 'Performance Testing for Mobile Applications',
                excerpt: 'Deep dive into mobile app performance testing techniques, tools, and metrics that matter.',
                author: 'Manu Kakkar',
                date: '2024-01-10',
                readTime: 12,
                category: 'Performance Testing',
                tags: ['performance', 'mobile', 'testing'],
                featured: true,
                published: true
            },
            {
                id: 'amazon-qa-culture',
                title: 'Quality Culture at Amazon: Lessons Learned',
                excerpt: 'Insights into how Amazon maintains high quality standards and what QA engineers can learn from it.',
                author: 'Manu Kakkar',
                date: '2024-01-05',
                readTime: 6,
                category: 'Culture',
                tags: ['amazon', 'culture', 'quality'],
                featured: true,
                published: true
            }
        ];
    }

    setupEventListeners() {
        // Search functionality
        const searchInput = document.getElementById('blog-search');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.currentFilters.search = e.target.value.toLowerCase();
                this.currentPage = 1;
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
                    this.currentPage = 1;
                    
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

        // Sort filter
        const sortBtn = document.getElementById('sort-filter-btn');
        const sortMenu = document.getElementById('sort-filter-menu');
        
        if (sortBtn && sortMenu) {
            sortBtn.addEventListener('click', () => {
                sortMenu.classList.toggle('show');
            });

            sortMenu.addEventListener('click', (e) => {
                if (e.target.classList.contains('filter-option')) {
                    const sort = e.target.dataset.sort;
                    this.currentFilters.sort = sort;
                    
                    // Update UI
                    sortMenu.querySelectorAll('.filter-option').forEach(opt => {
                        opt.classList.remove('active');
                    });
                    e.target.classList.add('active');
                    
                    sortBtn.querySelector('span').textContent = e.target.textContent;
                    sortMenu.classList.remove('show');
                    
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

        // Blog modal
        this.setupBlogModal();
    }

    setupBlogModal() {
        const modal = document.getElementById('blog-modal');
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
        // Filter posts
        this.filteredPosts = this.posts.filter(post => {
            if (!post.published) return false;

            // Search filter
            const matchesSearch = !this.currentFilters.search || 
                post.title.toLowerCase().includes(this.currentFilters.search) ||
                post.excerpt.toLowerCase().includes(this.currentFilters.search) ||
                post.tags.some(tag => tag.toLowerCase().includes(this.currentFilters.search));

            // Category filter
            const matchesCategory = this.currentFilters.category === 'all' || 
                post.category === this.currentFilters.category;

            return matchesSearch && matchesCategory;
        });

        // Sort posts
        this.sortPosts();
        this.renderPosts();
    }

    sortPosts() {
        switch (this.currentFilters.sort) {
            case 'latest':
                this.filteredPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
                break;
            case 'oldest':
                this.filteredPosts.sort((a, b) => new Date(a.date) - new Date(b.date));
                break;
            case 'popular':
                // Sort by read time as a proxy for popularity
                this.filteredPosts.sort((a, b) => b.readTime - a.readTime);
                break;
        }
    }

    renderFeaturedPosts() {
        const container = document.getElementById('featured-posts-grid');
        if (!container) return;

        const featuredPosts = this.posts.filter(post => post.featured && post.published).slice(0, 3);
        
        container.innerHTML = featuredPosts.map(post => 
            this.createFeaturedPostCard(post)
        ).join('');

        // Add click listeners
        container.querySelectorAll('.blog-card').forEach(card => {
            card.addEventListener('click', () => {
                const postId = card.dataset.postId;
                this.showBlogModal(postId);
            });
        });
    }

    renderPosts() {
        const container = document.getElementById('blog-posts-grid');
        const noResults = document.getElementById('no-results');
        const pagination = document.getElementById('pagination');

        if (this.filteredPosts.length === 0) {
            container.innerHTML = '';
            noResults.style.display = 'block';
            pagination.innerHTML = '';
            return;
        }

        noResults.style.display = 'none';

        // Calculate pagination
        const totalPages = Math.ceil(this.filteredPosts.length / this.postsPerPage);
        const startIndex = (this.currentPage - 1) * this.postsPerPage;
        const endIndex = startIndex + this.postsPerPage;
        const currentPosts = this.filteredPosts.slice(startIndex, endIndex);

        // Render posts
        container.innerHTML = currentPosts.map(post => 
            this.createPostCard(post)
        ).join('');

        // Add click listeners
        container.querySelectorAll('.blog-card').forEach(card => {
            card.addEventListener('click', () => {
                const postId = card.dataset.postId;
                this.showBlogModal(postId);
            });
        });

        // Render pagination
        this.renderPagination(totalPages);
    }

    createFeaturedPostCard(post) {
        return `
            <div class="blog-card featured-post" data-post-id="${post.id}">
                <div class="card-content">
                    <div class="card-header">
                        <span class="badge badge-primary">Featured</span>
                        <span class="post-category">${post.category}</span>
                    </div>
                    <h3 class="card-title">${post.title}</h3>
                    <p class="card-description">${post.excerpt}</p>
                    <div class="card-meta">
                        <span class="post-date">${new Date(post.date).toLocaleDateString()}</span>
                        <span class="read-time">${post.readTime} min read</span>
                    </div>
                    <div class="card-tags">
                        ${post.tags.slice(0, 3).map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    createPostCard(post) {
        return `
            <div class="blog-card" data-post-id="${post.id}">
                <div class="card-content">
                    <div class="card-header">
                        <span class="post-category">${post.category}</span>
                        <span class="post-date">${new Date(post.date).toLocaleDateString()}</span>
                    </div>
                    <h3 class="card-title">${post.title}</h3>
                    <p class="card-description">${post.excerpt}</p>
                    <div class="card-footer">
                        <span class="read-time">${post.readTime} min read</span>
                    </div>
                </div>
            </div>
        `;
    }

    renderPagination(totalPages) {
        const pagination = document.getElementById('pagination');
        if (totalPages <= 1) {
            pagination.innerHTML = '';
            return;
        }

        let paginationHTML = '';

        // Previous button
        if (this.currentPage > 1) {
            paginationHTML += `<button class="pagination-btn" data-page="${this.currentPage - 1}">Previous</button>`;
        }

        // Page numbers
        for (let i = 1; i <= totalPages; i++) {
            if (i === this.currentPage) {
                paginationHTML += `<button class="pagination-btn active" data-page="${i}">${i}</button>`;
            } else if (i === 1 || i === totalPages || (i >= this.currentPage - 2 && i <= this.currentPage + 2)) {
                paginationHTML += `<button class="pagination-btn" data-page="${i}">${i}</button>`;
            } else if (i === this.currentPage - 3 || i === this.currentPage + 3) {
                paginationHTML += `<span class="pagination-ellipsis">...</span>`;
            }
        }

        // Next button
        if (this.currentPage < totalPages) {
            paginationHTML += `<button class="pagination-btn" data-page="${this.currentPage + 1}">Next</button>`;
        }

        pagination.innerHTML = paginationHTML;

        // Add click listeners
        pagination.querySelectorAll('.pagination-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.currentPage = parseInt(btn.dataset.page);
                this.renderPosts();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        });
    }

    showBlogModal(postId) {
        const post = this.posts.find(p => p.id === postId);
        if (!post) return;

        const modal = document.getElementById('blog-modal');
        const modalBody = document.getElementById('blog-modal-body');

        modalBody.innerHTML = this.createBlogModalContent(post);
        modal.style.display = 'block';

        // Add social share functionality
        this.setupSocialShare(post);
    }

    createBlogModalContent(post) {
        return `
            <article class="blog-post">
                <header class="blog-post-header">
                    <div class="post-meta">
                        <span class="post-category">${post.category}</span>
                        <span class="post-date">${new Date(post.date).toLocaleDateString()}</span>
                        <span class="read-time">${post.readTime} min read</span>
                    </div>
                    <h1 class="post-title">${post.title}</h1>
                    <div class="post-tags">
                        ${post.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                </header>

                <div class="blog-post-content">
                    ${this.formatBlogContent(post.content || post.excerpt)}
                </div>

                <footer class="blog-post-footer">
                    <div class="author-info">
                        <strong>About the Author:</strong>
                        <p>${post.author} is a Quality Assurance Engineer at Amazon with expertise in automation, performance testing, and SDK validation.</p>
                    </div>
                    
                    <div class="social-share">
                        <h4>Share this post:</h4>
                        <div class="share-buttons">
                            <button class="share-btn share-linkedin" data-url="${window.location.href}" data-title="${post.title}">
                                LinkedIn
                            </button>
                            <button class="share-btn share-twitter" data-url="${window.location.href}" data-title="${post.title}">
                                Twitter
                            </button>
                            <button class="share-btn share-email" data-url="${window.location.href}" data-title="${post.title}">
                                Email
                            </button>
                        </div>
                    </div>
                </footer>
            </article>
        `;
    }

    formatBlogContent(content) {
        if (!content) return '<p>Content coming soon...</p>';
        
        // Convert markdown-like content to HTML
        return content
            .replace(/^# (.*$)/gim, '<h2>$1</h2>')
            .replace(/^## (.*$)/gim, '<h3>$1</h3>')
            .replace(/^### (.*$)/gim, '<h4>$1</h4>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/```([\s\S]*?)```/g, '<pre class="code-block"><code>$1</code></pre>')
            .replace(/`(.*?)`/g, '<code class="code-inline">$1</code>')
            .replace(/\n\n/g, '</p><p>')
            .replace(/^(.*)$/gim, '<p>$1</p>')
            .replace(/<p><h/g, '<h')
            .replace(/<\/h([1-6])><\/p>/g, '</h$1>')
            .replace(/<p><pre/g, '<pre')
            .replace(/<\/pre><\/p>/g, '</pre>');
    }

    setupSocialShare(post) {
        const shareButtons = document.querySelectorAll('.share-btn');
        
        shareButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const url = encodeURIComponent(btn.dataset.url);
                const title = encodeURIComponent(btn.dataset.title);
                
                if (btn.classList.contains('share-linkedin')) {
                    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
                } else if (btn.classList.contains('share-twitter')) {
                    window.open(`https://twitter.com/intent/tweet?url=${url}&text=${title}`, '_blank');
                } else if (btn.classList.contains('share-email')) {
                    window.location.href = `mailto:?subject=${title}&body=Check out this article: ${url}`;
                }
            });
        });
    }
}

// Initialize blog manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new BlogManager();
});

// Add CSS for blog-specific styles
const blogStyles = `
<style>
.featured-posts-section {
    padding: 60px 0;
    background-color: var(--background-gray);
}

.featured-posts-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 2rem;
}

.featured-post {
    background: linear-gradient(135deg, var(--primary-color), #e68900);
    color: white;
    border: none;
}

.featured-post .card-title,
.featured-post .card-description {
    color: white;
}

.featured-post .post-category {
    background-color: rgba(255, 255, 255, 0.2);
    color: white;
    padding: 0.25rem 0.75rem;
    border-radius: 15px;
    font-size: 0.8rem;
}

.blog-posts-section {
    padding: 60px 0;
}

.blog-posts-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    margin-bottom: 3rem;
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
}

.post-category {
    background-color: var(--background-gray);
    color: var(--text-primary);
    padding: 0.25rem 0.75rem;
    border-radius: 15px;
    font-size: 0.8rem;
    font-weight: 500;
}

.post-date {
    font-size: 0.9rem;
    color: var(--text-light);
}

.card-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 1.5rem;
    padding-top: 1rem;
    border-top: 1px solid var(--border-color);
}

.read-time {
    font-size: 0.9rem;
    color: var(--text-light);
}

.blog-modal-content {
    max-width: 900px;
    max-height: 90vh;
    overflow-y: auto;
}

.blog-post {
    padding: 2rem;
}

.blog-post-header {
    margin-bottom: 2rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid var(--border-color);
}

.post-meta {
    display: flex;
    gap: 1rem;
    margin-bottom: 1rem;
    flex-wrap: wrap;
}

.post-title {
    font-size: 2.5rem;
    color: var(--secondary-color);
    margin-bottom: 1rem;
    line-height: 1.2;
}

.post-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
}

.blog-post-content {
    line-height: 1.8;
    margin-bottom: 2rem;
}

.blog-post-content h2 {
    color: var(--secondary-color);
    margin: 2rem 0 1rem;
    font-size: 1.8rem;
}

.blog-post-content h3 {
    color: var(--secondary-color);
    margin: 1.5rem 0 1rem;
    font-size: 1.4rem;
}

.blog-post-content h4 {
    color: var(--secondary-color);
    margin: 1rem 0 0.5rem;
    font-size: 1.2rem;
}

.blog-post-content p {
    margin-bottom: 1rem;
    color: var(--text-primary);
}

.blog-post-content ul,
.blog-post-content ol {
    margin: 1rem 0;
    padding-left: 2rem;
}

.blog-post-content li {
    margin-bottom: 0.5rem;
    color: var(--text-primary);
}

.blog-post-footer {
    padding-top: 2rem;
    border-top: 1px solid var(--border-color);
}

.author-info {
    margin-bottom: 2rem;
    padding: 1.5rem;
    background-color: var(--background-gray);
    border-radius: var(--border-radius);
}

.social-share h4 {
    margin-bottom: 1rem;
    color: var(--secondary-color);
}

.share-buttons {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
}

.pagination-ellipsis {
    padding: 0.5rem;
    color: var(--text-light);
}

@media (max-width: 767px) {
    .post-title {
        font-size: 2rem;
    }
    
    .featured-posts-grid {
        grid-template-columns: 1fr;
    }
    
    .blog-posts-grid {
        grid-template-columns: 1fr;
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
    
    .blog-post {
        padding: 1rem;
    }
    
    .post-meta {
        flex-direction: column;
        gap: 0.5rem;
    }
    
    .share-buttons {
        flex-direction: column;
    }
}
</style>
`;

document.head.insertAdjacentHTML('beforeend', blogStyles);