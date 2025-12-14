
const sidebar = document.getElementById('sidebar');
const menuToggle = document.getElementById('menu-toggle');
const mainSearchInput = document.getElementById('main-search');
const filterSearchInput = document.getElementById('filter-search-input');
const categoryFiltersContainer = document.getElementById('category-filters');
const cardsContainer = document.getElementById('podcast-cards-container');
const nowPlayingSection = document.getElementById('now-playing');
const nowPlayingTitle = document.getElementById('now-playing-title');
const nowPlayingHost = document.getElementById('now-playing-host');
const stopBtn = document.getElementById('stop-btn');
const emptyState = document.getElementById('empty-state');

let allPodcastsData = [];
let currentPodcasts = [];
let playingPodcastId = null;
let selectedCategory = null;


window.addEventListener('DOMContentLoaded', () => {
    loadPodcastsData();
    loadPlayingState();
    setupEventListeners();
});


function loadPodcastsData() {
    const savedPodcasts = localStorage.getItem('podcastsData');
    
    if (savedPodcasts) {
        allPodcastsData = JSON.parse(savedPodcasts);
    } else {
        
        allPodcastsData = [
            {
                id: 1,
                title: "O Futuro da Inteligência Artificial",
                host: "Ana Paula Santos",
                duration: "45 min",
                category: "Tecnologia",
                description: "Uma discussão profunda sobre como a IA está transformando diversos setores.",
                bgColor: "#7e46ec",
                episodeNumber: 1
            },
            {
                id: 2,
                title: "Carreira em Tech: Por Onde Começar",
                host: "Carlos Eduardo",
                duration: "38 min",
                category: "Carreira",
                description: "Dicas práticas para quem está iniciando na área de tecnologia.",
                bgColor: "#4a90e2",
                episodeNumber: 2
            },
            {
                id: 3,
                title: "Cibersegurança para Iniciantes",
                host: "Mariana Costa",
                duration: "52 min",
                category: "Segurança",
                description: "Conceitos básicos de segurança digital que todos devem conhecer.",
                bgColor: "#ff6b6b",
                episodeNumber: 3
            },
            {
                id: 4,
                title: "Cloud Computing Descomplicado",
                host: "Roberto Silva",
                duration: "41 min",
                category: "Infraestrutura",
                description: "Entenda de forma simples como funciona a computação em nuvem.",
                bgColor: "#80cbc4",
                episodeNumber: 4
            },
            {
                id: 5,
                title: "Programação Web Moderna",
                host: "Juliana Mendes",
                duration: "55 min",
                category: "Desenvolvimento",
                description: "As principais tecnologias e frameworks usados no desenvolvimento web.",
                bgColor: "#ffcc80",
                episodeNumber: 5
            },
            {
                id: 6,
                title: "Data Science na Prática",
                host: "Fernando Oliveira",
                duration: "48 min",
                category: "Dados",
                description: "Como empresas estão usando ciência de dados para tomar decisões.",
                bgColor: "#b39ddb",
                episodeNumber: 6
            },
            {
                id: 7,
                title: "UX Design: A Arte de Criar Experiências",
                host: "Patricia Lima",
                duration: "35 min",
                category: "Design",
                description: "Princípios fundamentais para criar interfaces centradas no usuário.",
                bgColor: "#f48fb1",
                episodeNumber: 7
            },
            {
                id: 8,
                title: "Metodologias Ágeis: Scrum e Kanban",
                host: "Diego Fernandes",
                duration: "42 min",
                category: "Gestão",
                description: "Como aplicar metodologias ágeis em projetos de tecnologia.",
                bgColor: "#a0d0e8",
                episodeNumber: 8
            }
        ];
        
        localStorage.setItem('podcastsData', JSON.stringify(allPodcastsData));
    }
    
    currentPodcasts = [...allPodcastsData];
    renderCategoryFilters();
    renderCards(currentPodcasts);
}

function loadPlayingState() {
    const savedPlayingId = localStorage.getItem('playingPodcast');
    if (savedPlayingId) {
        playingPodcastId = parseInt(savedPlayingId);
        updateNowPlaying();
    }
}


function renderCategoryFilters() {
    const categories = [...new Set(allPodcastsData.map(p => p.category))];
    
    let html = '<button class="category-btn active" data-category="all">Todos</button>';
    
    categories.forEach(category => {
        html += `<button class="category-btn" data-category="${category}">${category}</button>`;
    });
    
    categoryFiltersContainer.innerHTML = html;
    
    
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const category = e.target.dataset.category;
            
            document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            
            if (category === 'all') {
                selectedCategory = null;
                currentPodcasts = [...allPodcastsData];
            } else {
                selectedCategory = category;
                currentPodcasts = allPodcastsData.filter(p => p.category === category);
            }
            
            renderCards(currentPodcasts);
        });
    });
}


function renderCards(podcasts) {
    if (podcasts.length === 0) {
        cardsContainer.style.display = 'none';
        emptyState.style.display = 'block';
        return;
    }
    
    cardsContainer.style.display = 'grid';
    emptyState.style.display = 'none';
    
    cardsContainer.innerHTML = podcasts.map(podcast => createCardHTML(podcast)).join('');
    addPlayEventListeners();
}

function createCardHTML(podcast) {
    const isPlaying = playingPodcastId === podcast.id;
    
    return `
        <div class="podcast-card" data-id="${podcast.id}">
            <div class="podcast-image" style="background-color: ${podcast.bgColor};">
                <i class="fas fa-headphones"></i>
                <span class="episode-badge">EP ${podcast.episodeNumber}</span>
            </div>
            <div class="podcast-info">
                <span class="podcast-category">${podcast.category}</span>
                <h2 class="podcast-title">${podcast.title}</h2>
                <p class="podcast-host">${podcast.host}</p>
                <div class="podcast-duration">
                    <i class="fas fa-clock"></i>
                    <span>${podcast.duration}</span>
                </div>
                <p class="podcast-description">${podcast.description}</p>
                <button class="play-btn ${isPlaying ? 'playing' : ''}" data-podcast-id="${podcast.id}">
                    <i class="fas fa-play"></i>
                    ${isPlaying ? 'Ouvindo...' : 'Ouvir Agora'}
                </button>
            </div>
        </div>
    `;
}

function addPlayEventListeners() {
    document.querySelectorAll('.play-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const podcastId = parseInt(e.currentTarget.dataset.podcastId);
            togglePlay(podcastId);
        });
    });
}


function togglePlay(podcastId) {
    if (playingPodcastId === podcastId) {
        
        playingPodcastId = null;
        localStorage.removeItem('playingPodcast');
        showToast('Podcast pausado', 'info');
    } else {
        
        playingPodcastId = podcastId;
        localStorage.setItem('playingPodcast', podcastId.toString());
        
        const podcast = allPodcastsData.find(p => p.id === podcastId);
        showToast(`Reproduzindo: ${podcast.title}`, 'success');
    }
    
    updateNowPlaying();
    renderCards(currentPodcasts);
}

function updateNowPlaying() {
    if (playingPodcastId) {
        const podcast = allPodcastsData.find(p => p.id === playingPodcastId);
        if (podcast) {
            nowPlayingSection.style.display = 'flex';
            nowPlayingTitle.textContent = podcast.title;
            nowPlayingHost.textContent = podcast.host;
        }
    } else {
        nowPlayingSection.style.display = 'none';
    }
}


function setupEventListeners() {
    
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });
    }
    
    
    stopBtn.addEventListener('click', () => {
        playingPodcastId = null;
        localStorage.removeItem('playingPodcast');
        updateNowPlaying();
        renderCards(currentPodcasts);
        showToast('Reprodução parada', 'info');
    });
    
  
    mainSearchInput.addEventListener('input', (e) => {
        filterSearchInput.value = e.target.value;
        applySearchFilter(e.target.value);
    });
    
   
    filterSearchInput.addEventListener('input', (e) => {
        mainSearchInput.value = e.target.value;
        applySearchFilter(e.target.value);
    });
}

function applySearchFilter(searchTerm) {
    const term = searchTerm.toLowerCase().trim();
    
    let filtered = [...allPodcastsData];
    
   
    if (selectedCategory) {
        filtered = filtered.filter(p => p.category === selectedCategory);
    }
    
    
    if (term) {
        filtered = filtered.filter(podcast => 
            podcast.title.toLowerCase().includes(term) || 
            podcast.host.toLowerCase().includes(term) || 
            podcast.category.toLowerCase().includes(term) ||
            podcast.description.toLowerCase().includes(term)
        );
    }
    
    currentPodcasts = filtered;
    renderCards(currentPodcasts);
}


function showToast(message, type = 'success') {
    const existingToast = document.querySelector('.toast');
    if (existingToast) existingToast.remove();
    
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        info: 'fa-info-circle'
    };
    
    const colors = {
        success: '#4CAF50',
        error: '#f44336',
        info: '#2196F3'
    };
    
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <i class="fas ${icons[type]}"></i>
        <span>${message}</span>
    `;
    
    toast.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        background-color: ${colors[type]};
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
