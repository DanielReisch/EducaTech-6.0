// Arquivo: assets/app.js (Contém toda a lógica principal: navegação, cursos, progressos, e o botão Login/Sair)

function normalizeKey(str) {
    if (!str) return "";
    let s = String(str);
    s = s.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    s = s.replace(/[^\p{L}\p{N}\s]/gu, "");
    s = s.replace(/\s+/g, " ").trim().toLowerCase();
    return s;
}

const content = document.getElementById("content");
const pageContainer = document.getElementById("page-container"); // Adicionado aqui para escopo global
const menuItems = document.querySelectorAll(".menu li");
// O initialCardsHTML será salvo DEPOIS que o DOM carregar e antes de qualquer alteração
let initialCardsHTML = null;
let dataJSON = null;

// Variáveis para a Lógica de Login/Sair
let logado = localStorage.getItem('logado') === 'true';
const loginBtn = document.getElementById('loginBtn');


// ----------------------------------------------------
// LÓGICA DE INICIALIZAÇÃO E CARREGAMENTO DE DADOS
// ----------------------------------------------------

document.addEventListener('DOMContentLoaded', () => {
    // Captura o HTML inicial da área de cards após o DOM carregar
    if (content) {
        initialCardsHTML = content.innerHTML;
    }
    
    // CORREÇÃO ESSENCIAL: Garante que a tela de início esteja configurada corretamente no carregamento
    showHome(); 

    fetch("data.json")
      .then(res => {
        if (!res.ok) throw new Error("Não foi possível carregar data.json");
        return res.json();
      })
      .then(json => {
        dataJSON = json;
        attachAllEvents();
        // ESTA CHAMA ATUALIZA O ESTADO DO BOTÃO AO CARREGAR A PÁGINA
        atualizarBotao(); 
      })
      .catch(err => {
        console.error("Erro ao carregar data.json:", err);
        // Ainda anexar eventos para navegação local mesmo sem data.json
        attachAllEvents();
        atualizarBotao();
      });
});

function findCourseById(id) {
    const cursos = dataJSON && dataJSON.cursos ? dataJSON.cursos : [];
    return (cursos || []).find(c => c.id === id);
}

function attachAllEvents() {
    menuItems.forEach(li => {
        // CORREÇÃO: Tratar o link 'Início' que usa <a>, se necessário, mas 
        // a navegação principal (index.html) já trata a volta.
        const explicit = li.getAttribute("data-section");
        const aTag = li.querySelector('a');
        
        // Se for o link 'Início' que recarrega a página, não anexa o evento JS
        if (aTag && aTag.getAttribute('href') === 'index.html') {
            return;
        }

        const key = explicit ? String(explicit) : li.textContent;
        li.onclick = () => {
            openSectionByKey(key);
        };
    });

    attachCardEvents();
}

function attachCardEvents() {
    const cards = document.querySelectorAll(".card");
    cards.forEach(card => {
        card.onclick = () => {
            const sectionId = card.getAttribute("data-section") || card.textContent;
            openSectionByKey(sectionId);
        };
    });

    // CORREÇÃO: Usar o ID do curso, não o índice estático
    document.querySelectorAll(".card .btn-ver").forEach((btn) => {
        btn.addEventListener("click", (e) => {
            // Se o botão não tiver data-course-id, tenta buscar pelo card pai (para a tela inicial)
            const cardElement = btn.closest(".card");
            const courseId = cardElement ? cardElement.getAttribute("data-course-id") : null;

            if (courseId) {
                renderCoursePage(courseId);
            } else {
                // Se a estrutura da tela inicial for diferente, esta lógica de ID pode precisar de ajuste.
                console.warn("Aviso: Botão 'Ver Curso' na tela inicial sem data-course-id. O index original foi removido para evitar erros.");
            }
            e.stopPropagation();
        });
    });
}

function openSectionByKey(key) {
    const normKey = normalizeKey(key);

    if (["início", "inicio", "home"].includes(normKey)) {
        showHome();
        return;
    }

    if (normKey === "cursos" || normKey === "nossos cursos") {
        renderCursos();
        return;
    }

    // Intercepta a rota Calendário
    if (["calendario", "calendário", "agenda", "calendar"].includes(normKey)) {
        // Esta função já deve cuidar de esconder o WELCOME e o CONTENT e mostrar o PAGECONTAINER
        renderAdvancedCalendar();
        return;
    }

    if (!dataJSON || !Array.isArray(dataJSON.sections)) {
        content.innerHTML = "<p>Conteúdo indisponível no momento.</p>";
        return;
    }

    const found = dataJSON.sections.find(sec => {
        const secNorm = normalizeKey(sec.id || sec.titulo || "");
        return secNorm === normKey;
    });

    if (!found) {
        const foundByTitle = dataJSON.sections.find(sec => normalizeKey(sec.titulo || "") === normKey);
        if (foundByTitle) return renderSection(foundByTitle);
        content.innerHTML = `<div class="section"><h2>Ops — conteúdo não encontrado</h2><p>Não encontrei seção para "<strong>${key}</strong>".</p><p><button id="btn-back">⬅ Voltar ao início</button></p></div>`;
        const back = document.getElementById("btn-back");
        if (back) back.onclick = showHome;
        
        // CORREÇÃO: Esconder WELCOME e PAGECONTAINER quando renderizando a mensagem de erro
        hideWelcome();
        if (pageContainer) pageContainer.style.display = "none";
        
        return;
    }

    renderSection(found);
}

function renderSection(section) {
    const html = `
        <div class="section">
            <div style="display:flex;align-items:center;justify-content:space-between;">
                <h1 style="margin:0;">${section.titulo}</h1>
                <button id="btn-back" style="background:#7b4fff;color:#fff;border:none;padding:8px 14px;border-radius:8px;cursor:pointer;">⬅ Voltar ao Início</button>
            </div>
            <div style="margin-top:16px;">
                ${section.conteudo}
            </div>
        </div>
    `;
    content.innerHTML = html;
    const back = document.getElementById("btn-back");
    if (back) back.onclick = showHome;

    hideWelcome();
    // CORREÇÃO: Esconder o pageContainer também ao renderizar conteúdo genérico
    if (pageContainer) pageContainer.style.display = "none";
    // CORREÇÃO: Mostrar o content
    content.style.display = "block";
}

/**
 * Nova função de controle de estado: Mostra a tela de Início (Welcome + Cards)
 */
function showHome() {
    // 1. Mostrar as duas seções iniciais
    showWelcome();
    
    // 2. Garante que a área principal de cards/navegação esteja visível
    content.style.display = "block"; 
    
    // 3. Esconde o container de conteúdo dinâmico (Calendário, Detalhe Curso etc.)
    if (pageContainer) {
        pageContainer.style.display = "none";
        pageContainer.innerHTML = ""; // Limpa o conteúdo
    }

    // 4. Carrega os Cards Iniciais (se eles tiverem sido alterados)
    if (initialCardsHTML) {
        content.innerHTML = initialCardsHTML;
        // Reanexa os eventos dos cards, pois o innerHTML os remove
        attachCardEvents(); 
    }
}

/*Cursos: renderização da lista*/
function renderCursos() {
    const cursos = dataJSON.cursos || [];

    // ... (Seu código de renderização de cursos permanece o mesmo) ...

    const categorias = [...new Set(cursos.map(c => c.categoria || "Outros"))];

    const html = `
        <div class="section cursos-section">
            <div class="section-header">
                <h1 class="cursos-title">Explore nossos cursos</h1>
                <button id="btn-back" class="btn-back">⬅ Voltar ao Início</button>
            </div>

            <div class="filter-row">
                <div class="filter-left">
                    <span class="filter-label">Buscar por:</span>
                    <div class="filter-pills" id="pills-categoria">
                        <button class="pill pill-all active" data-cat="todos">Categoria</button>
                        ${categorias.map(cat => `<button class="pill" data-cat="${cat}">${cat}</button>`).join("")}
                    </div>
                </div>

                <div class="filter-right">
                    <button class="pill pill-popularity" id="pill-popularity" data-sort="none">Popularidade</button>
                </div>
            </div>

            <div id="listaCursos" class="courses-grid">
                ${cursos.map(c => gerarCardCurso(c)).join("")}
            </div>
        </div>
    `;

    // CORREÇÃO: Garante o estado visual correto para a lista de cursos
    content.innerHTML = html;
    content.style.display = "block";
    hideWelcome();
    if (pageContainer) pageContainer.style.display = "none";

    const back = document.getElementById("btn-back");
    if (back) back.onclick = showHome;

    const pills = document.querySelectorAll("#pills-categoria .pill");
    pills.forEach(p => p.addEventListener("click", (e) => {
        pills.forEach(x => x.classList.remove("active"));
        e.currentTarget.classList.add("active");
        filtrarCursos();
    }));

    const popBtn = document.getElementById("pill-popularity");
    if (popBtn) {
        popBtn.addEventListener("click", () => {
            const cur = popBtn.getAttribute("data-sort");
            const next = cur === "none" ? "desc" : cur === "desc" ? "asc" : "none";
            popBtn.setAttribute("data-sort", next);
            popBtn.classList.toggle("active", next !== "none");
            popBtn.textContent = next === "none" ? "Popularidade" : (next === "desc" ? "Popularidade ↓" : "Popularidade ↑");
            filtrarCursos();
        });
    }

    // Chama a função para anexar os eventos de clique do botão "Ver Curso"
    attachCourseButtonEvents();
}

// ... (O resto das funções auxiliares, como gerarCardCurso, filtrarCursos, attachCourseButtonEvents, etc., permanecem inalteradas) ...

function gerarCardCurso(curso) {
    const imagem = curso.imagem || "";
    const titulo = curso.titulo || "Untitled";
    const nivel = curso.nivel || "";
    return `
        <article class="course-card" data-course-id="${curso.id}">
            <div class="course-card-media">
                <img src="${imagem}" alt="${titulo}" />
            </div>

            <div class="course-card-body">
                <h3 class="course-title">${titulo}</h3>
                <div class="course-meta">
                    <span class="badge nivel">${nivel}</span>
                </div>
                <div class="card-cta">
                    <button class="btn-ver" data-course-id="${curso.id}">Ver Curso</button>
                </div>
            </div>
        </article>
    `;
}

function filtrarCursos() {
    const cursos = dataJSON.cursos || [];

    const catPill = document.querySelector("#pills-categoria .pill.active");
    const categoria = catPill ? catPill.getAttribute("data-cat") : "todos";

    const popBtn = document.getElementById("pill-popularity");
    const sort = popBtn ? popBtn.getAttribute("data-sort") : "none";

    let filtrados = cursos.slice();

    if (categoria && categoria !== "todos" && categoria !== "Categoria") {
        filtrados = filtrados.filter(c => (c.categoria || "").toLowerCase() === categoria.toLowerCase());
    }

    if (sort && sort !== "none") {
        if (filtrados.some(c => typeof c.popularidade === "number")) {
            filtrados.sort((a, b) => sort === "desc" ? (b.popularidade - a.popularidade) : (a.popularidade - b.popularidade));
        } else {
            const rank = { 'iniciante': 1, 'intermediario': 2, 'intermediário': 2, 'avancado': 3, 'avançado': 3 };
            filtrados.sort((a, b) => {
                const ra = rank[(a.nivel || "").toLowerCase()] || 0;
                const rb = rank[(b.nivel || "").toLowerCase()] || 0;
                return sort === "desc" ? rb - ra : ra - rb;
            });
        }
    }

    const container = document.getElementById("listaCursos");
    if (container) container.innerHTML = filtrados.map(gerarCardCurso).join("");

    // Reanexa os eventos após a filtragem
    attachCourseButtonEvents();
}

// NOVA FUNÇÃO para anexar eventos do botão Ver Curso após renderização
function attachCourseButtonEvents() {
    document.querySelectorAll(".course-card .btn-ver").forEach((btn) => {
        btn.addEventListener("click", (e) => {
            const courseId = btn.getAttribute("data-course-id");
            if (courseId) {
                renderCoursePage(courseId);
            }
            e.stopPropagation();
        });
    });
}


 /*Gerenciamento de Progresso*/
function loadProgressAll() {
    try {
        const raw = localStorage.getItem("et_progress");
        return raw ? JSON.parse(raw) : {};
    } catch (e) {
        console.warn("progress parse error", e);
        return {};
    }
}
function saveProgressAll(obj) {
    localStorage.setItem("et_progress", JSON.stringify(obj));
}

function getCourseProgress(courseId) {
    const all = loadProgressAll();
    return all[courseId] || { completedLessonIds: [], lastSeenAt: null };
}

function setCourseProgress(courseId, progressObj) {
    const all = loadProgressAll();
    all[courseId] = progressObj;
    saveProgressAll(all);
}

function toggleLessonComplete(courseId, lessonId, mark = true) {
    const progress = getCourseProgress(courseId);
    const set = new Set(progress.completedLessonIds || []);
    if (mark) {
        set.add(lessonId);
    } else {
        set.delete(lessonId);
    }
    progress.completedLessonIds = Array.from(set);
    progress.lastSeenAt = new Date().toISOString();
    setCourseProgress(courseId, progress);
}

/*Função renderiza curso*/

function renderCoursePage(courseId) {
    const curso = findCourseById(courseId); // Usando a nova função utilitária
    if (!curso) {
        alert("Curso não encontrado.");
        return;
    }

    const total = (curso.lessons || []).length;
    const progress = getCourseProgress(courseId);
    const completed = (progress.completedLessonIds || []).length;
    const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

    const lessonsHtml = (curso.lessons || []).map(lesson => {
        const done = (progress.completedLessonIds || []).includes(lesson.id);
        const toggleClass = done ? 'btn-toggle desmarcar' : 'btn-toggle';
        const toggleText = done ? 'Desmarcar' : 'Marcar como visto';
        return `
            <div class="lesson-item" data-lesson-id="${lesson.id}">
                <div class="lesson-meta">
                    <div style="font-weight:700;">${lesson.titulo}</div>
                    <div style="font-size:13px;color:#666;">Duração aprox. ${Math.round((lesson.durationSeconds || 0) / 60)} min</div>
                </div>
                <div class="lesson-actions">
                    <button class="btn-watch" data-youtubeid="${lesson.youtubeId}" data-lessonid="${lesson.id}" data-courseid="${courseId}">Assistir</button>
                    <button class="${toggleClass}" data-lessonid="${lesson.id}" data-courseid="${courseId}">${toggleText}</button>
                </div>
            </div>
        `;
    }).join("");

    const html = `
        <div class="course-detail">
            <div class="course-header">
                <div style="display:flex; align-items:center; gap:14px;">
                    <img src="${curso.imagem || ''}" alt="${curso.titulo}" style="width:84px;height:56px;object-fit:cover;border-radius:8px;"/>
                    <div>
                        <h2 style="margin:0 0 6px 0;">${curso.titulo}</h2>
                        <div style="font-size:14px;color:#666">${curso.nivel} • ${curso.categoria}</div>
                    </div>
                </div>

                <div style="display:flex; align-items:center; gap:12px;">
                    <div style="text-align:right;">
                        <div style="font-size:12px;color:#666">Progresso</div>
                        <div style="font-weight:700; font-size:16px;">${percent}%</div>
                    </div>
                    <div style="width:260px;">
                        <div class="progress"><div class="bar" style="width:${percent}%;"></div></div>
                    </div>
                    <button id="btn-back-to-courses" class="btn-back">⬅ Voltar</button>
                </div>
            </div>

            <div style="margin-top:18px;">
                <h3 style="margin-bottom:8px;">Aulas</h3>
                <div class="lessons-list">
                    ${lessonsHtml}
                </div>

                <div id="video-area" class="video-area"></div>
            </div>
        </div>
    `;

    // A variável pageContainer é declarada no escopo principal do módulo
    if (!pageContainer) {
        content.innerHTML = html;
    } else {
        // CORREÇÃO: Esconder o content/welcome e mostrar o pageContainer para o detalhe do curso
        pageContainer.style.display = "block";
        pageContainer.innerHTML = html;
        hideWelcome();
        content.style.display = "none";
    }

    const backBtn = document.getElementById("btn-back-to-courses");
    if (backBtn) backBtn.onclick = () => {
        stopAllPlayers();
        if (pageContainer) {
            pageContainer.style.display = "none";
            pageContainer.innerHTML = "";
        }
        content.style.display = "block";
        renderCursos(); // Volta para a lista de cursos, que já faz a limpeza necessária
    };

    document.querySelectorAll(".btn-toggle").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const lessonId = btn.getAttribute("data-lessonid");
            const courseId = btn.getAttribute("data-courseid");
            const progress = getCourseProgress(courseId);
            const done = (progress.completedLessonIds || []).includes(lessonId);
            toggleLessonComplete(courseId, lessonId, !done);
            renderCoursePage(courseId);
        });
    });

    document.querySelectorAll(".btn-watch").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const videoId = btn.getAttribute("data-youtubeid");
            const lessonId = btn.getAttribute("data-lessonid");
            const courseId = btn.getAttribute("data-courseid");
            renderVideoPlayer(videoId, courseId, lessonId);
        });
    });
}

/* YouTube API */
// ... (O código do YouTube API não precisa de alterações) ...
const ytPlayers = {};

function ensureYouTubeAPI(onReady) {
    if (window.YT && window.YT.Player) {
        onReady();
        return;
    }
    if (document.getElementById("youtube-api-script")) {
        const interval = setInterval(() => {
            if (window.YT && window.YT.Player) {
                clearInterval(interval);
                onReady();
            }
        }, 200);
        return;
    }
    const tag = document.createElement('script');
    tag.id = "youtube-api-script";
    tag.src = "https://www.youtube.com/iframe_api";
    document.body.appendChild(tag);
    window.onYouTubeIframeAPIReady = function () {
        onReady();
    };
}

function renderVideoPlayer(youtubeId, courseId, lessonId) {
    const videoArea = document.getElementById("video-area");
    if (!videoArea) return;
    // limpa players anteriores
    stopAllPlayers();
    videoArea.innerHTML = `<div class="video-wrapper"><div id="player-${lessonId}"></div></div>`;

    ensureYouTubeAPI(() => {
        // cria player
        const player = new YT.Player(`player-${lessonId}`, {
            height: '390',
            width: '640',
            videoId: youtubeId,
            playerVars: {
                rel: 0,
                modestbranding: 1
            },

            // Marcar como visto
            events: {
                onStateChange: (event) => {
                    if (event.data === YT.PlayerState.ENDED) {
                        toggleLessonComplete(courseId, lessonId, true);
                        renderCoursePage(courseId);
                    }
                }
            }
        });
        ytPlayers[lessonId] = player;
    });
}

function stopAllPlayers() {
    for (const id in ytPlayers) {
        try {
            const p = ytPlayers[id];
            if (p && typeof p.stopVideo === "function") p.stopVideo();
        } catch (e) { }
    }
    for (const k in ytPlayers) delete ytPlayers[k];
}

function showWelcome() {
    const welcome = document.getElementById("welcome-section");
    if (welcome) welcome.style.display = "flex";
}

function hideWelcome() {
    const welcome = document.getElementById("welcome-section");
    if (welcome) welcome.style.display = "none";
}

/* Controle do Menu Hamburger */
const hamburgerBtn = document.getElementById("hamburger");
const sidebar = document.getElementById("sidebar");

if (hamburgerBtn && sidebar) {
    hamburgerBtn.addEventListener("click", () => {
        sidebar.classList.toggle("collapsed");
    });
}

// ----------------------------------------------------
// LÓGICA DE LOGIN/SAIR (Integrada)
// ----------------------------------------------------
// ... (O código de Login/Sair não precisa de alterações) ...

function atualizarBotao() {
    // Releitura da variável 'logado' do localStorage, caso a página não tenha sido totalmente recarregada.
    // É uma boa prática rechecar se o estado mudou.
    logado = localStorage.getItem('logado') === 'true'; 

    if (!loginBtn) return; 

    const CLASSE_LOGIN = 'login-link'; 
    const CLASSE_LOGOUT = 'logout-link'; 

    if (logado) {
        // Se o usuário está logado, mostra 'Sair'
        loginBtn.innerHTML = '<span class="user-icon">👤</span> Sair';
        loginBtn.classList.add(CLASSE_LOGOUT);
        loginBtn.classList.remove(CLASSE_LOGIN);
    } else {
        // Se o usuário NÃO está logado, mostra 'Login'
        loginBtn.innerHTML = '<span class="user-icon">👤</span> Login';
        loginBtn.classList.add(CLASSE_LOGIN);
        loginBtn.classList.remove(CLASSE_LOGOUT);
    }
}

if (loginBtn) {
    loginBtn.addEventListener('click', (e) => { 
        if (!logado) {
            // Se NÃO está logado, redireciona para a página de login
            e.preventDefault(); 
            window.location.href = 'login.html';
        } else {
            // Se está logado, executa o LOGOUT
            e.preventDefault();
            if (confirm('Deseja sair da sua conta?')) {
                // 1. Limpa o estado
                localStorage.setItem('logado', 'false');
                logado = false;
                
                // 2. Atualiza o botão *antes* de sair (opcional, pois a próxima página vai atualizar)
                atualizarBotao(); 
                
                // 3. Exibe o alerta
                alert('Você saiu com sucesso!');
                
                // 4. Redireciona para o início
                window.location.href = 'index.html'; 
            }
        }
    });
}

/* Pesquisa Google*/
// ... (O código de Pesquisa Google não precisa de alterações) ...
const inputPesquisa = document.getElementById('pesquisa');
const btnBuscar = document.getElementById('btnBuscar');

if (inputPesquisa) {
    inputPesquisa.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            buscarGoogle();
        }
    });
}
if (btnBuscar) btnBuscar.addEventListener('click', buscarGoogle);

function buscarGoogle() {
    const termo = inputPesquisa ? inputPesquisa.value.trim() : "";
    if (termo !== '') {
        const url = `https://www.google.com/search?q=${encodeURIComponent(termo)}`;
        window.open(url, '_blank');
    } else {
        alert('Digite algo para pesquisar!');
    }
}

/* ---------------------------
    INÍCIO: CALENDÁRIO AVANÇADO (OPÇÃO A)
    --------------------------- */

// Storage
const CAL_KEY = "etcal_events_v1";

function loadCalEvents() {
    try {
        const raw = localStorage.getItem(CAL_KEY);
        return raw ? JSON.parse(raw) : {};
    } catch (e) {
        console.warn("Erro ao ler calendário:", e);
        return {};
    }
}
function saveCalEvents(obj) {
    localStorage.setItem(CAL_KEY, JSON.stringify(obj));
}

// Tipos e cores
const EVENT_TYPES = [
    { id: "EXAME", label: "Exame/Prova", color: "#e06b6b" },
    { id: "TAREFA", label: "Tarefa/Entrega", color: "#5fb86d" },
    { id: "LEMBRETE", label: "Lembrete", color: "#f0b84a" },
    { id: "OUTRO", label: "Outro", color: "#6b63f2" }
];

// Renderizador principal (exportado globalmente como renderAdvancedCalendar)
function renderAdvancedCalendar() {
    if (!pageContainer) return;

    // CORREÇÃO ESSENCIAL: Garante que as áreas do HOME estão escondidas antes de renderizar
    hideWelcome();
    content.style.display = "none";
    pageContainer.style.display = "block";
    
    // ... (restante do código de renderização do calendário) ...

    pageContainer.innerHTML = `
        <div class="etcal-container" id="etcal-root">
            <div>
                <div class="etcal-header">
                    <div class="etcal-title" id="etcal-title">Calendário</div>
                    <div class="etcal-controls">
                        <button id="etcal-prev">◀</button>
                        <button id="etcal-today">Hoje</button>
                        <button id="etcal-next">▶</button>
                        <div style="width:12px;"></div>
                        <button id="etcal-export" title="Exportar eventos">Exportar</button>
                        <button id="etcal-import" title="Importar eventos">Importar</button>
                    </div>
                </div>

                <div class="etcal-grid" id="etcal-grid-week">
                    <div class="etcal-weekday">Dom</div>
                    <div class="etcal-weekday">Seg</div>
                    <div class="etcal-weekday">Ter</div>
                    <div class="etcal-weekday">Qua</div>
                    <div class="etcal-weekday">Qui</div>
                    <div class="etcal-weekday">Sex</div>
                    <div class="etcal-weekday">Sáb</div>
                </div>

                <div class="etcal-grid" id="etcal-days" style="margin-top:10px;"></div>
            </div>

            <aside class="etcal-side">
                <div style="display:flex;justify-content:space-between;align-items:center;">
                    <div>
                        <div class="small-muted">Data selecionada</div>
                        <div style="font-weight:700;margin-top:6px;" id="etcal-selected-date">—</div>
                    </div>
                    <div>
                        <button id="etcal-add" class="etcal-add-btn">+ Evento</button>
                    </div>
                </div>

                <div style="margin-top:12px;">
                    <div style="display:flex;gap:8px;align-items:center;">
                        <label class="small-muted">Filtrar por:</label>
                        <select id="etcal-filter-type" style="padding:6px;border-radius:8px;border:1px solid #ddd;">
                            <option value="ALL">Todos</option>
                            ${EVENT_TYPES.map(t=>`<option value="${t.id}">${t.label}</option>`).join("")}
                        </select>
                    </div>

                    <div id="etcal-event-list" style="margin-top:12px;"></div>
                </div>
            </aside>
        </div>
    `;

    // Estado
    const root = document.getElementById('etcal-root');
    const state = {
        year: (new Date()).getFullYear(),
        month: (new Date()).getMonth(),
        selectedISO: formatISODate(new Date())
    };

    // Attach controls
    document.getElementById('etcal-prev').onclick = () => {
        if (state.month === 0) { state.month = 11; state.year -= 1; } else state.month--;
        renderCalGrid(root, state);
        renderSide(root, state);
    };
    document.getElementById('etcal-next').onclick = () => {
        if (state.month === 11) { state.month = 0; state.year += 1; } else state.month++;
        renderCalGrid(root, state);
        renderSide(root, state);
    };
    document.getElementById('etcal-today').onclick = () => {
        const t = new Date();
        state.year = t.getFullYear();
        state.month = t.getMonth();
        state.selectedISO = formatISODate(t);
        renderCalGrid(root, state);
        renderSide(root, state);
    };

    document.getElementById('etcal-add').onclick = () => {
        openEventModal(state.selectedISO, null, () => {
            renderCalGrid(root, state);
            renderSide(root, state);
        });
    };

    document.getElementById('etcal-export').onclick = () => {
        const data = loadCalEvents();
        const blob = new Blob([JSON.stringify(data, null, 2)], {type:'application/json'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `etcal-events-${new Date().toISOString().slice(0,10)}.json`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
    };

    document.getElementById('etcal-import').onclick = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'application/json';
        input.onchange = (e) => {
            const f = e.target.files[0];
            if (!f) return;
            const reader = new FileReader();
            reader.onload = () => {
                try {
                    const parsed = JSON.parse(reader.result);
                    // merge: parsed dates override/merge with existing
                    const existing = loadCalEvents();
                    const merged = Object.assign({}, existing, parsed);
                    saveCalEvents(merged);
                    alert('Eventos importados com sucesso.');
                    renderCalGrid(root, state);
                    renderSide(root, state);
                } catch (err) {
                    alert('Arquivo inválido.');
                }
            };
            reader.readAsText(f);
        };
        input.click();
    };

    // filtro tipo
    document.getElementById('etcal-filter-type').onchange = () => {
        renderSide(root, state);
    };

    // first render
    renderCalGrid(root, state);
    renderSide(root, state);
}

// --- utils de data ---
function formatISODate(d) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2,'0');
    const day = String(d.getDate()).padStart(2,'0');
    return `${y}-${m}-${day}`;
}

// --- cria grade do mês ---
function renderCalGrid(root, state) {
    const daysContainer = root.querySelector('#etcal-days');
    const title = root.querySelector('#etcal-title');
    daysContainer.innerHTML = '';

    const monthNames = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
    title.textContent = `${monthNames[state.month]} ${state.year}`;

    const first = new Date(state.year, state.month, 1);
    const startDay = first.getDay();
    const total = new Date(state.year, state.month + 1, 0).getDate();

    // prev month days
    const prevMonth = state.month === 0 ? 11 : state.month - 1;
    const prevYear = state.month === 0 ? state.year - 1 : state.year;
    const prevTotal = new Date(prevYear, prevMonth + 1, 0).getDate();

    const events = loadCalEvents();

    // total cells: 42
    const cells = [];
    for (let i=0;i<42;i++) {
        let cell = { day:null, offset:0 };
        const idx = i - startDay + 1;
        if (i < startDay) {
            cell.day = prevTotal - (startDay - 1) + i;
            cell.offset = -1;
        } else if (idx <= total) {
            cell.day = idx;
            cell.offset = 0;
        } else {
            cell.day = idx - total;
            cell.offset = 1;
        }
        cells.push(cell);
    }

    const todayISO = formatISODate(new Date());

    cells.forEach(c => {
        // build date
        const d = new Date(state.year, state.month + c.offset, c.day);
        const iso = formatISODate(d);
        const isOther = c.offset !== 0;
        const isToday = iso === todayISO;
        const dayEl = document.createElement('div');
        dayEl.className = 'etcal-day' + (isOther ? ' other-month' : '') + (isToday ? ' today' : '');
        dayEl.setAttribute('data-iso', iso);

        const num = document.createElement('div');
        num.className = 'day-num';
        num.textContent = c.day;
        dayEl.appendChild(num);

        // dots: get types present
        const evs = events[iso] || [];
        const typesPresent = [...new Set(evs.map(e => e.type))].slice(0, 6);
        if (typesPresent.length) {
            const dots = document.createElement('div');
            dots.className = 'etcal-dots';
            typesPresent.forEach(tid => {
                const typeObj = EVENT_TYPES.find(x=>x.id===tid) || EVENT_TYPES[EVENT_TYPES.length-1];
                const dot = document.createElement('span');
                dot.className = 'etcal-dot';
                dot.style.background = typeObj.color;
                dots.appendChild(dot);
            });
            dayEl.appendChild(dots);
        }

        dayEl.onclick = (e) => {
            // if clicked other month, navigate
            if (c.offset === -1) {
                if (state.month === 0) { state.month = 11; state.year -= 1; } else state.month--;
            } else if (c.offset === 1) {
                if (state.month === 11) { state.month = 0; state.year += 1; } else state.month++;
            }
            state.selectedISO = iso;
            // re-render
            renderCalGrid(root, state);
            renderSide(root, state);
        };

        daysContainer.appendChild(dayEl);
    });
}

// --- painel lateral: eventos da data ---
function renderSide(root, state) {
    const selEl = root.querySelector('#etcal-selected-date');
    const list = root.querySelector('#etcal-event-list');
    const selISO = state.selectedISO;
    const d = new Date(selISO + 'T00:00:00');
    const options = { weekday:'long', day:'2-digit', month:'long', year:'numeric' };
    selEl.textContent = d.toLocaleDateString('pt-BR', options);

    const events = loadCalEvents();
    let arr = events[selISO] || [];
    const filter = root.querySelector('#etcal-filter-type').value;
    if (filter && filter !== 'ALL') {
        arr = arr.filter(x => x.type === filter);
    }

    list.innerHTML = '';
    if (!arr.length) {
        list.innerHTML = `<div class="small-muted" style="margin-top:10px;">Nenhum evento nesta data.</div>`;
        return;
    }

    arr.forEach((ev, idx) => {
        const evDiv = document.createElement('div');
        evDiv.className = 'etcal-event';
        const left = document.createElement('div');
        left.className = 'ev-left';
        left.innerHTML = `<div style="font-weight:700;">${ev.time ? ev.time + ' • ' : ''}${ev.title}</div><div class="ev-meta">${ev.type ? (EVENT_TYPES.find(t=>t.id===ev.type)||{}).label : ''} ${ev.description ? '• ' + ev.description : ''}</div>`;
        const right = document.createElement('div');
        const editBtn = document.createElement('button');
        editBtn.className = 'etcal-btn';
        editBtn.textContent = 'Editar';
        editBtn.onclick = () => {
            openEventModal(selISO, { index: idx, event: ev }, () => {
                renderCalGrid(root, state);
                renderSide(root, state);
            });
        };
        const delBtn = document.createElement('button');
        delBtn.className = 'etcal-btn';
        delBtn.style.color = '#a00';
        delBtn.textContent = 'Remover';
        delBtn.onclick = () => {
            if (!confirm('Remover este evento?')) return;
            const all = loadCalEvents();
            const arrLocal = all[selISO] || [];
            arrLocal.splice(idx, 1);
            all[selISO] = arrLocal;
            saveCalEvents(all);
            renderCalGrid(root, state);
            renderSide(root, state);
        };
        right.appendChild(editBtn);
        right.appendChild(delBtn);

        evDiv.appendChild(left);
        evDiv.appendChild(right);
        list.appendChild(evDiv);
    });
}

// --- modal add/edit ---
function openEventModal(dateISO, editObj = null, onSaved) {
    // editObj: { index, event } or null
    const modalBack = document.createElement('div');
    modalBack.className = 'etcal-modal-back';
    const modal = document.createElement('div');
    modal.className = 'etcal-modal';
    modal.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
            <h3 style="margin:0;">${editObj ? 'Editar evento' : 'Adicionar evento'}</h3>
            <button id="etcal-close-modal" style="background:transparent;border:none;cursor:pointer;font-size:18px;">✕</button>
        </div>
        <div style="margin-bottom:8px;"><div class="small-muted">Data</div><div style="font-weight:700;">${new Date(dateISO+'T00:00:00').toLocaleDateString('pt-BR',{weekday:'long',day:'2-digit',month:'long',year:'numeric'})}</div></div>
        <div>
            <label class="small-muted">Título</label>
            <input id="ev-title" placeholder="Ex: Prova de Matemática">
            <label class="small-muted">Hora (opcional)</label>
            <input id="ev-time" placeholder="14:30">
            <label class="small-muted">Tipo</label>
            <select id="ev-type">
                ${EVENT_TYPES.map(t=>`<option value="${t.id}">${t.label}</option>`).join("")}
            </select>
            <label class="small-muted">Descrição (opcional)</label>
            <textarea id="ev-desc" rows="4" placeholder="Detalhes do evento"></textarea>
            <div style="display:flex;justify-content:flex-end;gap:8px;margin-top:10px;">
                <button id="ev-cancel" style="background:#fff;border:1px solid #ddd;padding:8px 12px;border-radius:8px;cursor:pointer;">Cancelar</button>
                <button id="ev-save" style="background:linear-gradient(90deg,#7b4fff,#8e63ff);color:#fff;border:none;padding:8px 12px;border-radius:8px;cursor:pointer;">Salvar</button>
            </div>
        </div>
    `;
    modalBack.appendChild(modal);
    document.body.appendChild(modalBack);

    // prefill if edit
    if (editObj && editObj.event) {
        modal.querySelector('#ev-title').value = editObj.event.title || '';
        modal.querySelector('#ev-time').value = editObj.event.time || '';
        modal.querySelector('#ev-type').value = editObj.event.type || EVENT_TYPES[0].id;
        modal.querySelector('#ev-desc').value = editObj.event.description || '';
    }

    // handlers
    modal.querySelector('#etcal-close-modal').onclick = () => modalBack.remove();
    modal.querySelector('#ev-cancel').onclick = () => modalBack.remove();
    modal.querySelector('#ev-save').onclick = () => {
        const title = modal.querySelector('#ev-title').value.trim();
        const time = modal.querySelector('#ev-time').value.trim();
        const type = modal.querySelector('#ev-type').value;
        const desc = modal.querySelector('#ev-desc').value.trim();
        if (!title) { alert('Informe um título.'); return; }
        const all = loadCalEvents();
        if (!all[dateISO]) all[dateISO] = [];
        const payload = { title, time, type, description: desc, createdAt: new Date().toISOString() };

        if (editObj && typeof editObj.index === 'number') {
            all[dateISO][editObj.index] = payload;
        } else {
            all[dateISO].push(payload);
        }
        saveCalEvents(all);
        modalBack.remove();
        if (typeof onSaved === 'function') onSaved(true);
    };
}

// Expor a função para global (já usamos no openSectionByKey)
window.renderAdvancedCalendar = renderAdvancedCalendar;

/* ---------------------------
   FIM: CALENDÁRIO AVANÇADO
   --------------------------- */

/* FIM DO ARQUIVO */
