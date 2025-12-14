
const sidebar = document.getElementById('sidebar');
const menuToggle = document.getElementById('menu-toggle');
const mainSearchInput = document.getElementById('main-search');
const filterSearchInput = document.getElementById('filter-search-input');
const categoryFilterBtn = document.getElementById('category-filter-btn');
const popularityFilterBtn = document.getElementById('popularity-filter-btn');
const cardsContainer = document.getElementById('article-cards-container');
const mostReadContainer = document.getElementById('most-read-container');

let allArticlesData = [];
let currentArticles = [];
let currentCategoryOrder = 'ASC';
let currentPopularityOrder = 'DESC';


window.addEventListener('DOMContentLoaded', () => {
    loadArticlesData();
    loadMostReadData();
    setupEventListeners();
});

function loadArticlesData() {
    
    const savedArticles = localStorage.getItem('articlesData');
    
    if (savedArticles) {
        allArticlesData = JSON.parse(savedArticles);
    } else {
        
        allArticlesData = [
            { 
                id: 998, 
                title: "Algoritmos e Lógica de Programação", 
                author: "Por Marco Souza", 
                category: "Programação", 
                popularity: 5, 
                isFixed: true,
                isWide: false,
                bgColor: "#7e46ec"
            },
            { 
                id: 999, 
                title: "Inovação e tecnologia: aprendendo com países inovadores", 
                author: "Por Taise Fátima Mattei", 
                category: "Inovação", 
                popularity: 4, 
                isFixed: true,
                isWide: true,
                bgColor: "#a0d0e8" 
            },
            { 
                id: 1, 
                title: "O uso da inteligência artificial como ferramenta para educação no Brasil", 
                author: "Por Luiz André Ferreira", 
                category: "Inteligência Artificial", 
                popularity: 4, 
                isFixed: false,
                isWide: false,
                bgColor: "#ffcc80" 
            },
            { 
                id: 2, 
                title: "Brazil Evolves Smart City Technology To Combat Climate Change", 
                author: "Por Angelica Mari de Oliveira", 
                category: "Tecnologia", 
                popularity: 5, 
                isFixed: false,
                isWide: false,
                bgColor: "#80cbc4" 
            },
            { 
                id: 3, 
                title: "Desafios e Oportunidades no Ensino à Distância", 
                author: "Por Ana Clara Guedes", 
                category: "Educação", 
                popularity: 3, 
                isFixed: false,
                isWide: false,
                bgColor: "#e6ee9c" 
            },
            { 
                id: 4, 
                title: "Segurança de Dados: O Novo Ouro Digital", 
                author: "Por João Vitor Martins", 
                category: "Segurança", 
                popularity: 5, 
                isFixed: false,
                isWide: false,
                bgColor: "#ffab91" 
            },
            { 
                id: 5, 
                title: "O Impacto do 5G na Indústria 4.0", 
                author: "Por Camila Ribeiro", 
                category: "Tecnologia", 
                popularity: 4, 
                isFixed: false,
                isWide: false,
                bgColor: "#b39ddb" 
            },
            { 
                id: 6, 
                title: "Liderança e Inovação na Era Digital", 
                author: "Por Ricardo Almeida", 
                category: "Carreira", 
                popularity: 2, 
                isFixed: false,
                isWide: false,
                bgColor: "#81d4fa" 
            }
        ];
        
        
        localStorage.setItem('articlesData', JSON.stringify(allArticlesData));
    }
    
    currentArticles = [...allArticlesData];
    renderCards(currentArticles);
}

function loadMostReadData() {
    const mostReadArticles = [
        { title: "A interferência da IA", author: "Por Paulo Isnard" },
        { title: "Inteligência artificial generativa e a desinformação no Brasil", author: "Por Pollyany Annenberg" },
        { title: "A segurança da informação para empresas no Brasil", author: "Por Kalleb Ribeiro Machado" }
    ];
    
    mostReadContainer.innerHTML = mostReadArticles.map(article => `
        <div class="read-item">
            <p class="read-title">${article.title}</p>
            <p class="read-author">${article.author}</p>
        </div>
    `).join('');
}


function renderCards(articles) {
    const fixedArticles = articles.filter(art => art.isFixed === true);
    const dynamicArticles = articles.filter(art => art.isFixed === false);
    
    let html = '';
    
    
    fixedArticles.forEach(article => {
        html += createCardHTML(article);
    });
    
    
    dynamicArticles.forEach(article => {
        html += createCardHTML(article);
    });
    
    cardsContainer.innerHTML = html;
    addArticleEventListeners();
}

function createCardHTML(article) {
    const initialLetter = article.title.charAt(0).toUpperCase();
    const isWide = article.isWide;
    const isFeatured = article.isFixed && !isWide;
    
    let cardClass = 'article-card';
    if (isWide) cardClass += ' wide-card';
    if (isFeatured) cardClass += ' featured-card';
    
    let imageClass = 'article-image-placeholder';
    if (isWide) imageClass += ' wide-image';
    if (isFeatured) imageClass += ' featured-image';
    
    return `
        <div class="${cardClass}" data-id="${article.id}">
            <div class="${imageClass}" style="background-color: ${article.bgColor};">
                <span>${initialLetter}</span>
            </div>
            <div class="article-info">
                ${isFeatured ? '<h3 class="article-subtitle">Artigo em Destaque</h3>' : ''}
                <h2 class="article-title">${article.title}</h2>
                <p class="article-author">${article.author}</p>
                <button class="read-more-btn" data-article-id="${article.id}">Ver Artigo</button>
            </div>
        </div>
    `;
}

function addArticleEventListeners() {
    document.querySelectorAll('.read-more-btn').forEach(button => {
        button.onclick = (e) => {
            const id = parseInt(e.target.dataset.articleId);
            navigateToArticle(id);
        };
    });
}

function navigateToArticle(articleId) {
    
    const viewHistory = JSON.parse(localStorage.getItem('articleViewHistory')) || [];
    if (!viewHistory.includes(articleId)) {
        viewHistory.push(articleId);
        localStorage.setItem('articleViewHistory', JSON.stringify(viewHistory));
    }
    
    showToast(`Abrindo artigo #${articleId}`, 'success');
    
}


function setupEventListeners() {
  
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });
    }
    
    
    mainSearchInput.addEventListener('input', (e) => {
        filterSearchInput.value = e.target.value;
        applySearchFilter(e.target.value);
    });
    
    
    filterSearchInput.addEventListener('input', (e) => {
        mainSearchInput.value = e.target.value;
        applySearchFilter(e.target.value);
    });
    
    
    categoryFilterBtn.addEventListener('click', (e) => {
        currentCategoryOrder = (currentCategoryOrder === 'ASC') ? 'DESC' : 'ASC';
        e.target.textContent = (currentCategoryOrder === 'ASC') ? 'Categorias (A-Z)' : 'Categorias (Z-A)';
        
        document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');
        
        const sorted = [...allArticlesData].sort((a, b) => {
            const catA = a.category.toUpperCase();
            const catB = b.category.toUpperCase();
            
            if (currentCategoryOrder === 'ASC') {
                return (catA < catB) ? -1 : (catA > catB) ? 1 : 0;
            } else {
                return (catA > catB) ? -1 : (catA < catB) ? 1 : 0;
            }
        });
        
        currentArticles = sorted;
        renderCards(currentArticles);
        clearSearchInputs();
    });
    
    
    popularityFilterBtn.addEventListener('click', (e) => {
        currentPopularityOrder = (currentPopularityOrder === 'DESC') ? 'ASC' : 'DESC';
        e.target.textContent = (currentPopularityOrder === 'DESC') ? 'Popularidade (Mais Pop)' : 'Popularidade (Menos Pop)';
        
        document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');
        
        const sorted = [...allArticlesData].sort((a, b) => {
            if (currentPopularityOrder === 'DESC') {
                return b.popularity - a.popularity;
            } else {
                return a.popularity - b.popularity;
            }
        });
        
        currentArticles = sorted;
        renderCards(currentArticles);
        clearSearchInputs();
    });
}

function applySearchFilter(searchTerm) {
    const term = searchTerm.toLowerCase().trim();
    
    if (!term) {
        currentArticles = [...allArticlesData];
        renderCards(currentArticles);
        return;
    }
    
    const filtered = allArticlesData.filter(article => 
        article.title.toLowerCase().includes(term) || 
        article.author.toLowerCase().includes(term) || 
        article.category.toLowerCase().includes(term)
    );
    
    currentArticles = filtered;
    renderCards(currentArticles);
    
   
    categoryFilterBtn.classList.remove('active');
    popularityFilterBtn.classList.remove('active');
}

function clearSearchInputs() {
    mainSearchInput.value = '';
    filterSearchInput.value = '';
}


function showToast(message, type = 'success') {
    const existingToast = document.querySelector('.toast');
    if (existingToast) existingToast.remove();
    
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    
    toast.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        background-color: ${type === 'success' ? '#4CAF50' : '#f44336'};
        color: white;
        padding: 15px 25px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: 14px;
        font-weight: 500;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        z-index: 9999;
        animation: slideInToast 0.3s ease;
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}


const style = document.createElement('style');
style.textContent = `
    @keyframes slideInToast {
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
