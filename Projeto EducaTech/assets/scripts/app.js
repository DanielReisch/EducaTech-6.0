// Arquivo: assets/scripts/app.js

/* =========================================================
   1. DADOS E FUNÇÕES GLOBAIS - CERTIFICADOS
   ========================================================= */

const CERTIFICATES_DATA = {
    'EDU-123-ABC': { status: 'success', nome: 'Daysiane', curso: 'Desenvolvimento Web Essencial', duracao: '60 horas', data: '15/05/2025', validadoPor: 'EducaTech S.A.' },
    'TECH-987-XYZ': { status: 'success', nome: 'Daysiane', curso: 'Fundamentos de UX Design', duracao: '40 horas', data: '20/07/2025', validadoPor: 'EducaTech S.A.' },
    'REV-404-EXP': { status: 'revoked', nome: 'Carlos Eduardo', curso: 'Introdução ao Marketing Digital', duracao: '80 horas', data: '10/01/2023', motivo: 'Certificado expirado ou revogado.'},
    'INVENTADO-1': { status: 'error' },

    'CERT-1': { id: 'CERT-1', title: 'Desenvolvimento Web', duration: '60 horas', validationCode: 'EDU-123-ABC', icon: 'fas fa-code', color: '#306998' },
    'CERT-2': { id: 'CERT-2', title: 'UX Design Essentials', duration: '40 horas', validationCode: 'TECH-987-XYZ', icon: 'fas fa-pencil-ruler', color: '#e74c3c' },
    'CERT-3': { id: 'CERT-3', title: 'Marketing Digital', duration: '80 horas', validationCode: 'REV-404-EXP', icon: 'fas fa-bullhorn', color: 'orange' },
    'CERT-4': { id: 'CERT-4', title: 'Lógica de Programação', duration: '30 horas', validationCode: 'INVENTADO-1', icon: 'fas fa-brain', color: '#8e44ad' },
    'CERT-5': { id: 'CERT-5', title: 'HTML e CSS', duration: '80 horas', validationCode: 'INICIANTE-333', icon: 'fas fa-laptop-code', color: '#27ae60' }
};

function updateQRCode(code, containerId = 'qr-real') {
    const qrContainer = document.getElementById(containerId);
    if (!qrContainer) return;
    qrContainer.innerHTML = ''; 
    if (!code) {
        qrContainer.innerHTML = '<span style="color:#ccc; font-size:12px;">Selecione um certificado</span>';
        return;
    }
    try {
        new QRCode(qrContainer, {
            text: `https://educatech.com.br/validar?code=${code}`,
            width: 150, height: 150,
            colorDark : "#000000", colorLight : "#ffffff",
            correctLevel : QRCode.CorrectLevel.H
        });
    } catch (e) { console.error("Erro QR:", e); }
}

function showCertificateDetails(certId) {
    const data = CERTIFICATES_DATA[certId];
    const input = document.getElementById('validationCode');
    const resultDiv = document.getElementById('validationResult');
    if (data && input) {
        input.value = data.validationCode;
        updateQRCode(data.validationCode);
        if(resultDiv) { resultDiv.style.display = 'none'; resultDiv.innerHTML = ''; }
        const panel = document.querySelector('.validation-panel');
        if(panel && window.innerWidth < 900) panel.scrollIntoView({ behavior: 'smooth' });
    }
}

function previewCertificate(certId) {
    const certConfig = CERTIFICATES_DATA[certId];
    const certDetails = CERTIFICATES_DATA[certConfig.validationCode]; 
    if (!certDetails) return Swal.fire('Erro', 'Dados do certificado não encontrados.', 'error');

    const certificadoHTML = `
        <div style="padding: 20px; border: 10px solid ${certConfig.color}; text-align: center; color: #333; font-family: 'Georgia', serif; background: #fffcf5;">
            <div style="font-size: 30px; font-weight: bold; color: ${certConfig.color}; margin-bottom: 10px;">Certificado de Conclusão</div>
            <div style="font-size: 16px; margin-bottom: 20px;">Certificamos que</div>
            <div style="font-size: 28px; font-weight: bold; border-bottom: 2px solid #333; display: inline-block; padding: 0 20px; margin-bottom: 20px;">${certDetails.nome}</div>
            <div style="font-size: 16px;">concluiu com êxito o curso de</div>
            <div style="font-size: 22px; font-weight: bold; margin: 15px 0;">${certDetails.curso}</div>
            <div style="font-size: 14px;">Carga Horária: <strong>${certDetails.duracao}</strong></div>
            <div style="margin-top: 30px; font-size: 12px; color: #666;">Data de emissão: ${certDetails.data}</div>
            <div style="margin-top: 10px; font-size: 10px; color: #999;">Código: ${certConfig.validationCode}</div>
            <div style="margin-top: 20px; font-size: 18px; color: ${certConfig.color};"><i class="fas fa-medal"></i> EducaTech Oficial</div>
        </div>
    `;

    Swal.fire({
        html: certificadoHTML,
        width: 700,
        showCloseButton: true,
        showConfirmButton: true,
        confirmButtonText: '<i class="fas fa-download"></i> Baixar PDF Agora',
        confirmButtonColor: certConfig.color,
        showCancelButton: true,
        cancelButtonText: 'Fechar'
    }).then((result) => {
        if (result.isConfirmed) {
            generateRealPDF(certId);
        }
    });
}

async function generateRealPDF(certId) {
    const certConfig = CERTIFICATES_DATA[certId];
    const certDetails = CERTIFICATES_DATA[certConfig.validationCode];

    Swal.fire({
        title: 'Gerando PDF...',
        html: 'Preparando seu certificado oficial.',
        timer: 1500,
        timerProgressBar: true,
        allowOutsideClick: false,
        didOpen: () => { Swal.showLoading(); }
    }).then(() => {
        createPDF(certConfig, certDetails);
    });
}

function createPDF(config, details) {
    if (!window.jspdf) { alert("Erro: Biblioteca jsPDF não encontrada."); return; }
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
    const primaryColor = config.color; 

    doc.setLineWidth(3);
    doc.setDrawColor(primaryColor);
    doc.rect(10, 10, 277, 190); 

    doc.setTextColor(primaryColor);
    doc.setFontSize(40);
    doc.setFont("helvetica", "bold");
    doc.text("Certificado de Conclusão", 148.5, 50, { align: "center" });

    doc.setTextColor(60, 60, 60);
    doc.setFontSize(16);
    doc.setFont("helvetica", "normal");
    doc.text("Certificamos que", 148.5, 75, { align: "center" });

    doc.setFontSize(30);
    doc.setFont("times", "bold");
    doc.text(details.nome, 148.5, 95, { align: "center" });
    
    doc.setLineWidth(0.5);
    doc.setDrawColor(100);
    doc.line(70, 98, 227, 98);

    doc.setFontSize(16);
    doc.setFont("helvetica", "normal");
    doc.text("concluiu com êxito o curso de", 148.5, 115, { align: "center" });

    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text(details.curso, 148.5, 130, { align: "center" });

    doc.setFontSize(14);
    doc.setFont("helvetica", "normal");
    doc.text(`Carga Horária: ${details.duracao}`, 148.5, 145, { align: "center" });
    doc.text(`Data: ${details.data}`, 148.5, 155, { align: "center" });

    doc.setFontSize(10);
    doc.setTextColor(150);
    doc.text(`Código de Validação: ${config.validationCode}`, 148.5, 185, { align: "center" });
    doc.text("EducaTech - Plataforma de Ensino", 148.5, 190, { align: "center" });

    doc.save(`Certificado_${details.curso}.pdf`);

    Swal.fire({
        icon: 'success',
        title: 'Download Concluído!',
        text: 'O arquivo foi salvo no seu dispositivo.',
        confirmButtonColor: primaryColor
    });
}

function validateCertificate() {
    const codeInput = document.getElementById('validationCode');
    const code = codeInput.value.trim().toUpperCase();
    const resultElement = document.getElementById('validationResult');
    const btn = document.querySelector('.validation-btn');
    
    if (!code) return Swal.fire('Atenção', 'Digite um código.', 'warning');

    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Validando...';
    
    setTimeout(() => {
        btn.innerHTML = originalText;
        updateQRCode(code);

        let data = CERTIFICATES_DATA[code];
        if (!data) {
             const foundKey = Object.keys(CERTIFICATES_DATA).find(key => CERTIFICATES_DATA[key].validationCode === code);
             if (foundKey) data = CERTIFICATES_DATA[CERTIFICATES_DATA[foundKey].validationCode]; 
        }

        if (data && data.status === 'success') {
            resultElement.className = 'result-area result-success';
            resultElement.innerHTML = `<h4>✅ Válido!</h4><p><strong>Curso:</strong> ${data.curso}</p><p><strong>Aluno:</strong> ${data.nome}</p>`;
        } else if (data && data.status === 'revoked') {
            resultElement.className = 'result-area result-error';
            resultElement.innerHTML = `<h4>⚠️ Revogado</h4><p>Motivo: ${data.motivo}</p>`;
        } else {
            resultElement.className = 'result-area result-error';
            resultElement.innerHTML = `<h4>❌ Inválido</h4><p>Código não encontrado.</p>`;
        }
        resultElement.style.display = 'block';
    }, 1000);
}

function downloadAllCertificates() {
    Swal.fire('Iniciado', 'O download do pacote ZIP começou.', 'success');
}

function renderCertificatesPage() {
    if (!pageContainer) return;
    hideWelcome();
    content.style.display = "none";
    pageContainer.style.display = "block";

    pageContainer.innerHTML = `
    <div class="etcal-container" style="background:transparent; box-shadow:none; padding:0; display:block;">
        <div class="certificates-page-content">
            <div class="certificates-list-container">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
                    <h1 style="margin:0;">🎓 Meus Certificados</h1>
                </div>
                <div class="actions-row">
                    <button class="action-btn order-btn"><i class="fas fa-sort-amount-down-alt"></i> Recente</button>
                    <button class="action-btn download-all-btn" onclick="downloadAllCertificates()"><i class="fas fa-cloud-download-alt"></i> Baixar Tudo</button>
                    <button class="action-btn" onclick="showHome()" style="background:#e0e0e0; color:#333;">⬅ Voltar</button>
                </div>
                <div class="certificates-grid">
                    ${Object.keys(CERTIFICATES_DATA).filter(key => key.startsWith('CERT')).map(key => {
                        const c = CERTIFICATES_DATA[key];
                        return `
                        <div class="certificate-card" onclick="showCertificateDetails('${c.id}')">
                            <div class="card-icon-area" style="background:${c.color}15">
                                <i class="${c.icon} medal-icon" style="color:${c.color}"></i>
                            </div>
                            <p class="certificate-title">${c.title}</p>
                            <p class="certificate-duration">Duração: ${c.duration}</p>
                            <div class="card-actions">
                                <i class="fas fa-eye card-action-icon" title="Visualizar" onclick="event.stopPropagation(); previewCertificate('${c.id}')"></i>
                                <i class="fas fa-cloud-download-alt card-action-icon" title="Baixar PDF" onclick="event.stopPropagation(); generateRealPDF('${c.id}')"></i>
                            </div>
                        </div>`;
                    }).join('')}
                </div>
            </div>
            <div class="validation-panel">
                <div class="validation-header">
                    <i class="fas fa-shield-alt validation-check-icon"></i>
                    <h2>Autenticidade</h2>
                </div>
                <div class="qr-code-area">
                    <div id="qr-real" style="width:150px; height:150px; margin:0 auto; background:#fff; border:3px solid #7b4fff; border-radius:10px; display:flex; align-items:center; justify-content:center;">
                        <span style="color:#ccc; font-size:12px;">Selecione um curso</span>
                    </div>
                </div>
                <p class="validation-instruction">Aponte a câmera ou digite o código:</p>
                <div class="code-input-area">
                    <input type="text" id="validationCode" placeholder="Ex: EDU-123-ABC" class="validation-input">
                    <button class="validation-btn" onclick="validateCertificate()">Verificar Agora</button>
                </div>
                <div id="validationResult" class="result-area"></div>
            </div>
        </div>
    </div>`;
    setTimeout(() => { updateQRCode(null); }, 100);
}

/* =========================================================
   2. NOVA PÁGINA DE SUPORTE (FINAL & MODERNA)
   ========================================================= */

function renderSupportPage() {
    if (!pageContainer) return;
    hideWelcome();
    content.style.display = "none";
    pageContainer.style.display = "block";

    pageContainer.innerHTML = `
        <div class="content-area" style="max-width: 1200px; margin: 0 auto; width: 100%;">
            
            <div class="support-header" style="margin-bottom: 40px; text-align: center;">
                <h2 style="color: #2e206b; font-size: 2.2rem; margin-bottom: 10px; font-weight: 700;">Estamos aqui para ajudar 💬</h2>
                <p style="color: #666; font-size: 1.1rem;">Envie sua dúvida, sugestão ou avalie nossa plataforma.</p>
            </div>

            <div class="support-grid">
                
                <div class="form-card">
                    <h3><i class="fas fa-envelope-open-text" style="color:#7b4fff;"></i> Envie sua mensagem</h3>
                    <form id="feedbackForm">
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                            <div class="form-group">
                                <label>Nome Completo</label>
                                <input type="text" id="nome" placeholder="Seu nome" required>
                            </div>
                            <div class="form-group">
                                <label>E-mail</label>
                                <input type="email" id="email" placeholder="seu@email.com" required>
                            </div>
                        </div>
                        <div class="form-group">
                            <label>Assunto</label>
                            <select id="assunto">
                                <option value="Dúvida">Tenho uma dúvida</option>
                                <option value="Problema Técnico">Relatar erro técnico</option>
                                <option value="Elogio / Sugestão">Elogio ou Sugestão</option>
                                <option value="Outros">Outros assuntos</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Sua experiência geral:</label>
                            <div class="rating-container">
                                <div class="star-rating">
                                    <i class="fas fa-star star" data-value="1"></i>
                                    <i class="fas fa-star star" data-value="2"></i>
                                    <i class="fas fa-star star" data-value="3"></i>
                                    <i class="fas fa-star star" data-value="4"></i>
                                    <i class="fas fa-star star" data-value="5"></i>
                                </div>
                                <div id="rating-label" class="rating-text">Avalie-nos</div>
                                <input type="hidden" id="nota" value="0">
                            </div>
                        </div>
                        <div class="form-group">
                            <label>Mensagem</label>
                            <textarea id="mensagem" rows="5" placeholder="Descreva detalhadamente sua solicitação..." required></textarea>
                        </div>
                        <button type="submit" class="btn-submit">
                            Enviar Mensagem <i class="fas fa-paper-plane"></i>
                        </button>
                    </form>
                </div>

                <div class="info-column">
                    
                    <div class="info-card">
                        <h3><i class="fas fa-headset"></i> Canais de Atendimento</h3>
                        
                        <div class="contact-item">
                            <div class="contact-icon-box"><i class="fas fa-envelope"></i></div>
                            <div class="contact-info">
                                <p class="contact-label">E-mail Oficial</p>
                                <p class="contact-value">suporte@educatech.com</p>
                            </div>
                        </div>

                        <div class="contact-item">
                            <div class="contact-icon-box"><i class="fab fa-whatsapp"></i></div>
                            <div class="contact-info">
                                <p class="contact-label">WhatsApp / Telefone</p>
                                <p class="contact-value">(31) 99999-9999</p>
                            </div>
                        </div>
                    </div>

                    <div class="info-card faq-box">
                        <h3><i class="fas fa-question-circle"></i> Dúvidas Rápidas</h3>
                        
                        <div class="faq-item">
                            <details>
                                <summary>Como baixo meu certificado? <i class="fas fa-chevron-down faq-arrow"></i></summary>
                                <p>Vá até a aba "Certificados" no menu lateral, escolha o curso concluído e clique no ícone de nuvem (Download).</p>
                            </details>
                        </div>

                        <div class="faq-item">
                            <details>
                                <summary>Esqueci minha senha <i class="fas fa-chevron-down faq-arrow"></i></summary>
                                <p>Na tela de login, clique em "Esqueci minha senha". Enviaremos um link de recuperação para seu e-mail.</p>
                            </details>
                        </div>

                        <div class="faq-item">
                            <details>
                                <summary>O acesso expira? <i class="fas fa-chevron-down faq-arrow"></i></summary>
                                <p>Não! Uma vez inscrito no EducaTech, seu acesso aos cursos gratuitos é vitalício.</p>
                            </details>
                        </div>
                    </div>

                    <div class="info-card">
                        <h3><i class="fas fa-share-alt"></i> Siga a EducaTech</h3>
                        <div class="social-card-content">
                            <p class="social-card-text">Fique por dentro de novos cursos, dicas de carreira e eventos exclusivos.</p>
                            <div class="social-links" style="justify-content: center;">
                                <a href="#" class="social-btn" title="Instagram"><i class="fab fa-instagram"></i></a>
                                <a href="#" class="social-btn" title="LinkedIn"><i class="fab fa-linkedin-in"></i></a>
                                <a href="#" class="social-btn" title="YouTube"><i class="fab fa-youtube"></i></a>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    `;

    attachSupportLogic();
}
function attachSupportLogic() {
    const stars = document.querySelectorAll('.star');
    const ratingInput = document.getElementById('nota');
    const ratingLabel = document.getElementById('rating-label');
    let currentRating = 0;

    // Textos divertidos para cada nota
    const labels = [
        "Toque nas estrelas para avaliar", // 0
        "Precisa melhorar ",             // 1
        "Razoável ",                     // 2
        "Bom ",                          // 3
        "Muito Bom! ",                   // 4
        "Excelente! "                    // 5
    ];

    stars.forEach(star => {
        // Ao clicar: Salva a nota
        star.addEventListener('click', () => {
            currentRating = parseInt(star.getAttribute('data-value'));
            if(ratingInput) ratingInput.value = currentRating;
            updateStars(currentRating);
            // Efeito visual de tremor na estrela clicada
            star.style.animation = "none";
            star.offsetHeight; /* trigger reflow */
            star.style.animation = "pulse 0.3s";
        });

        // Ao passar o mouse: Mostra prévia
        star.addEventListener('mouseover', () => {
            const hoverValue = parseInt(star.getAttribute('data-value'));
            updateStars(hoverValue);
            ratingLabel.textContent = labels[hoverValue];
            ratingLabel.style.color = hoverValue < 3 ? '#e74c3c' : '#7b4fff'; // Vermelho se nota baixa
        });

        // Ao tirar o mouse: Volta para a nota salva
        star.addEventListener('mouseout', () => {
            updateStars(currentRating);
            ratingLabel.textContent = labels[currentRating];
            ratingLabel.style.color = '#7b4fff';
        });
    });

    function updateStars(value) {
        stars.forEach(star => {
            const starValue = parseInt(star.getAttribute('data-value'));
            if (starValue <= value) {
                star.classList.add('active');
                star.classList.remove('far'); // Remove estrela vazia
                star.classList.add('fas');    // Adiciona estrela cheia
            } else {
                star.classList.remove('active');
                star.classList.remove('fas'); // Remove estrela cheia
                star.classList.add('far');    // Adiciona estrela vazia (borda)
            }
        });
    }

    // Formulário
    const form = document.getElementById('feedbackForm');
    if(form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const nome = document.getElementById('nome').value;
            const nota = document.getElementById('nota').value;
            
            if(nota == 0) {
                Swal.fire('Ops!', 'Por favor, selecione uma nota nas estrelas.', 'warning');
                return;
            }

            // Simulação de envio
            Swal.fire({
                icon: 'success',
                title: 'Obrigado pelo feedback!',
                html: `Recebemos sua mensagem, <b>${nome}</b>.<br>Sua avaliação: <b>${labels[nota]}</b>`,
                confirmButtonColor: '#7b4fff'
            });
            
            form.reset();
            currentRating = 0;
            updateStars(0);
            ratingLabel.textContent = labels[0];
        });
    }
}
/* =========================================================
   3. LÓGICA PRINCIPAL (ROTEAMENTO)
   ========================================================= */

function normalizeKey(str) {
    if (!str) return "";
    let s = String(str);
    s = s.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    s = s.replace(/[^\p{L}\p{N}\s]/gu, "");
    s = s.replace(/\s+/g, " ").trim().toLowerCase();
    return s;
}

const content = document.getElementById("content");
const pageContainer = document.getElementById("page-container");
const menuItems = document.querySelectorAll(".menu li");
let initialCardsHTML = null;
let dataJSON = null;

let logado = localStorage.getItem('logado') === 'true';
const loginBtn = document.getElementById('loginBtn');

document.addEventListener('DOMContentLoaded', () => {
    if (content) initialCardsHTML = content.innerHTML;
    showHome(); 

    fetch("data.json")
      .then(res => {
        if (!res.ok) throw new Error("Não foi possível carregar data.json");
        return res.json();
      })
      .then(json => {
        dataJSON = json;
        attachAllEvents();
        atualizarBotao(); 
      })
      .catch(err => {
        console.error("Erro ao carregar data.json:", err);
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
        const explicit = li.getAttribute("data-section");
        const aTag = li.querySelector('a');
        if (aTag && aTag.getAttribute('href') === 'index.html') return;

        const key = explicit ? String(explicit) : li.textContent;
        li.onclick = () => { openSectionByKey(key); };
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
    attachCourseButtonEvents();
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

    if (["calendario", "calendário", "agenda", "calendar"].includes(normKey)) {
        renderAdvancedCalendar();
        return;
    }

    // --- bloco de anotações ---
    if (normKey === "blocos de anotacoes" || normKey === "anotacoes" || normKey === "notas") {
        renderNotesPage(); 
        return;
    }

    // --- conteúdos baixados ---
    if (normKey === "conteudos baixados" || normKey === "baixados") {
        renderDownloadedPage();
        return;
    }

    // --- conteúdos salvos ---
    if (normKey === "conteudos salvos" || normKey === "salvos") {
        renderSavedContentPage();
        return;
    }
    

    // --- pág certificados ---
    if (normKey === "certificados" || normKey === "meus certificados") {
        renderCertificatesPage();
        return;
    }

    // --- pág suporte ---
    if (["suporte", "ajuda", "fale conosco"].includes(normKey)) {
        renderSupportPage();
        return;
    }

    if (!dataJSON || !Array.isArray(dataJSON.sections)) {
        content.innerHTML = "<p>Conteúdo indisponível no momento.</p>";
        return;
    }
    // --- pág parceiros ---
    if (["nossos parceiros", "parceiros", "apoiadores"].includes(normKey)) {
        renderPartnersPage();
        return;
    }
    if (["medalhas", "minhas medalhas", "conquistas", "gamificacao"].includes(normKey)) {
    renderMedalsPage();
    return;
}

    // ... dentro de openSectionByKey(key) ...

    // --- ADICIONE ESTES BLOCOS NOVOS ---
    
    // --- pág artigos ---
    if (normKey === "artigos" || normKey === "leituras") {
        renderArticlesPage();
        return;
    }

    // --- pág podcasts ---
    if (normKey === "podcasts" || normKey === "audio") {
        renderPodcastsPage();
        return;
    }

    // --- pág configurações ---
    if (normKey === "configuracoes" || normKey === "ajustes" || normKey === "minha conta") {
        renderSettingsPage();
        return;
    }

    // ... continue com o código existente (verificação do dataJSON) ...

    const found = dataJSON.sections.find(sec => {
        const secNorm = normalizeKey(sec.id || sec.titulo || "");
        return secNorm === normKey;
    });

    if (!found) {
        const foundByTitle = dataJSON.sections.find(sec => normalizeKey(sec.titulo || "") === normKey);
        if (foundByTitle) return renderSection(foundByTitle);
        content.innerHTML = `<div class="section"><h2>Conteúdo não encontrado</h2><p>Não encontrei seção para "<strong>${key}</strong>".</p><p><button id="btn-back">⬅ Voltar</button></p></div>`;
        const back = document.getElementById("btn-back");
        if (back) back.onclick = showHome;
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
                <button id="btn-back" style="background:#7b4fff;color:#fff;border:none;padding:8px 14px;border-radius:8px;cursor:pointer;">⬅ Voltar</button>
            </div>
            <div style="margin-top:16px;">${section.conteudo}</div>
        </div>
    `;
    content.innerHTML = html;
    const back = document.getElementById("btn-back");
    if (back) back.onclick = showHome;

    hideWelcome();
    if (pageContainer) pageContainer.style.display = "none";
    content.style.display = "block";
}

function showHome() {
    showWelcome();
    content.style.display = "block"; 
    if (pageContainer) {
        pageContainer.style.display = "none";
        pageContainer.innerHTML = ""; 
    }
    if (initialCardsHTML) {
        content.innerHTML = initialCardsHTML;
        attachCardEvents(); 
    }
}

function renderCursos() {
    const cursos = dataJSON.cursos || [];
    const categorias = [...new Set(cursos.map(c => c.categoria || "Outros"))];

    const html = `
        <div class="section cursos-section">
            <div class="section-header">
                <h1 class="cursos-title">Explore nossos cursos</h1>
                <button id="btn-back" class="btn-back">⬅ Voltar</button>
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
    attachCourseButtonEvents();
}

function gerarCardCurso(curso) {
    const imagem = curso.imagem || "";
    const titulo = curso.titulo || "Untitled";
    const nivel = curso.nivel || "";
    return `
        <article class="course-card" data-course-id="${curso.id}">
            <div class="course-card-media"><img src="${imagem}" alt="${titulo}" /></div>
            <div class="course-card-body">
                <h3 class="course-title">${titulo}</h3>
                <div class="course-meta"><span class="badge nivel">${nivel}</span></div>
                <div class="card-cta"><button class="btn-ver" data-course-id="${curso.id}">Ver Curso</button></div>
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
    attachCourseButtonEvents();
}

function attachCourseButtonEvents() {
    document.querySelectorAll(".course-card .btn-ver").forEach((btn) => {
        btn.addEventListener("click", (e) => {
            const courseId = btn.getAttribute("data-course-id");
            if (courseId) renderCoursePage(courseId);
            e.stopPropagation();
        });
    });
}

function loadProgressAll() {
    try {
        const raw = localStorage.getItem("et_progress");
        return raw ? JSON.parse(raw) : {};
    } catch (e) {
        console.warn("progress parse error", e);
        return {};
    }
}
function saveProgressAll(obj) { localStorage.setItem("et_progress", JSON.stringify(obj)); }

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
    if (mark) set.add(lessonId); else set.delete(lessonId);
    progress.completedLessonIds = Array.from(set);
    progress.lastSeenAt = new Date().toISOString();
    setCourseProgress(courseId, progress);
}

function renderCoursePage(courseId) {
    const curso = findCourseById(courseId);
    if (!curso) { alert("Curso não encontrado."); return; }

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
                <div class="lessons-list">${lessonsHtml}</div>
                <div id="video-area" class="video-area"></div>
            </div>
        </div>
    `;

    if (!pageContainer) {
        content.innerHTML = html;
    } else {
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
        renderCursos();
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

const ytPlayers = {};
function ensureYouTubeAPI(onReady) {
    if (window.YT && window.YT.Player) { onReady(); return; }
    if (document.getElementById("youtube-api-script")) {
        const interval = setInterval(() => {
            if (window.YT && window.YT.Player) { clearInterval(interval); onReady(); }
        }, 200);
        return;
    }
    const tag = document.createElement('script');
    tag.id = "youtube-api-script";
    tag.src = "https://www.youtube.com/iframe_api";
    document.body.appendChild(tag);
    window.onYouTubeIframeAPIReady = function () { onReady(); };
}

function renderVideoPlayer(youtubeId, courseId, lessonId) {
    const videoArea = document.getElementById("video-area");
    if (!videoArea) return;
    stopAllPlayers();
    videoArea.innerHTML = `<div class="video-wrapper"><div id="player-${lessonId}"></div></div>`;

    ensureYouTubeAPI(() => {
        const player = new YT.Player(`player-${lessonId}`, {
            height: '390', width: '640', videoId: youtubeId,
            playerVars: { rel: 0, modestbranding: 1 },
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

const hamburgerBtn = document.getElementById("hamburger");
const sidebar = document.getElementById("sidebar");
if (hamburgerBtn && sidebar) {
    hamburgerBtn.addEventListener("click", () => { sidebar.classList.toggle("collapsed"); });
}

function atualizarBotao() {
    logado = localStorage.getItem('logado') === 'true'; 
    if (!loginBtn) return; 
    const CLASSE_LOGIN = 'login-link'; 
    const CLASSE_LOGOUT = 'logout-link'; 

    if (logado) {
        loginBtn.innerHTML = '<span class="user-icon">👤</span> Sair';
        loginBtn.classList.add(CLASSE_LOGOUT);
        loginBtn.classList.remove(CLASSE_LOGIN);
    } else {
        loginBtn.innerHTML = '<span class="user-icon">👤</span> Login';
        loginBtn.classList.add(CLASSE_LOGIN);
        loginBtn.classList.remove(CLASSE_LOGOUT);
    }
}

if (loginBtn) {
    loginBtn.addEventListener('click', (e) => { 
        if (!logado) {
            e.preventDefault(); 
            window.location.href = 'login.html';
        } else {
            e.preventDefault();
            if (confirm('Deseja sair da sua conta?')) {
                localStorage.setItem('logado', 'false');
                logado = false;
                atualizarBotao(); 
                alert('Você saiu com sucesso!');
                window.location.href = 'index.html'; 
            }
        }
    });
}
atualizarBotao();

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
    CALENDÁRIO AVANÇADO
   --------------------------- */
const CAL_KEY = "etcal_events_v1";
function loadCalEvents() {
    try { const raw = localStorage.getItem(CAL_KEY); return raw ? JSON.parse(raw) : {}; } 
    catch (e) { return {}; }
}
function saveCalEvents(obj) { localStorage.setItem(CAL_KEY, JSON.stringify(obj)); }

const EVENT_TYPES = [
    { id: "EXAME", label: "Exame/Prova", color: "#e06b6b" },
    { id: "TAREFA", label: "Tarefa/Entrega", color: "#5fb86d" },
    { id: "LEMBRETE", label: "Lembrete", color: "#f0b84a" },
    { id: "OUTRO", label: "Outro", color: "#6b63f2" }
];

function renderAdvancedCalendar() {
    if (!pageContainer) return;
    hideWelcome();
    content.style.display = "none";
    pageContainer.style.display = "block";

    pageContainer.innerHTML = `
        <div class="etcal-container" id="etcal-root">
            <div>
                <div class="etcal-header">
                    <div class="etcal-title" id="etcal-title">Calendário</div>
                    <div class="etcal-controls">
                        <button id="etcal-prev">◀</button>
                        <button id="etcal-today">Hoje</button>
                        <button id="etcal-next">▶</button>
                    </div>
                </div>
                <div class="etcal-grid" id="etcal-grid-week">
                    <div class="etcal-weekday">Dom</div><div class="etcal-weekday">Seg</div>
                    <div class="etcal-weekday">Ter</div><div class="etcal-weekday">Qua</div>
                    <div class="etcal-weekday">Qui</div><div class="etcal-weekday">Sex</div>
                    <div class="etcal-weekday">Sáb</div>
                </div>
                <div class="etcal-grid" id="etcal-days" style="margin-top:10px;"></div>
            </div>
            <aside class="etcal-side">
                <div style="display:flex;justify-content:space-between;align-items:center;">
                    <div><div class="small-muted">Data selecionada</div><div style="font-weight:700;margin-top:6px;" id="etcal-selected-date">—</div></div>
                    <div><button id="etcal-add" class="etcal-add-btn">+ Evento</button></div>
                </div>
                <div style="margin-top:12px;">
                    <div id="etcal-event-list" style="margin-top:12px;"></div>
                </div>
            </aside>
        </div>
    `;

    const root = document.getElementById('etcal-root');
    const state = { year: (new Date()).getFullYear(), month: (new Date()).getMonth(), selectedISO: formatISODate(new Date()) };

    document.getElementById('etcal-prev').onclick = () => {
        if (state.month === 0) { state.month = 11; state.year -= 1; } else state.month--;
        renderCalGrid(root, state); renderSide(root, state);
    };
    document.getElementById('etcal-next').onclick = () => {
        if (state.month === 11) { state.month = 0; state.year += 1; } else state.month++;
        renderCalGrid(root, state); renderSide(root, state);
    };
    document.getElementById('etcal-today').onclick = () => {
        const t = new Date(); state.year = t.getFullYear(); state.month = t.getMonth(); state.selectedISO = formatISODate(t);
        renderCalGrid(root, state); renderSide(root, state);
    };
    document.getElementById('etcal-add').onclick = () => {
        openEventModal(state.selectedISO, null, () => { renderCalGrid(root, state); renderSide(root, state); });
    };

    renderCalGrid(root, state);
    renderSide(root, state);
}

function formatISODate(d) {
    const y = d.getFullYear(); const m = String(d.getMonth() + 1).padStart(2,'0'); const day = String(d.getDate()).padStart(2,'0');
    return `${y}-${m}-${day}`;
}

function renderCalGrid(root, state) {
    const daysContainer = root.querySelector('#etcal-days');
    const title = root.querySelector('#etcal-title');
    daysContainer.innerHTML = '';
    const monthNames = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
    title.textContent = `${monthNames[state.month]} ${state.year}`;

    const first = new Date(state.year, state.month, 1);
    const startDay = first.getDay();
    const total = new Date(state.year, state.month + 1, 0).getDate();
    const prevMonth = state.month === 0 ? 11 : state.month - 1;
    const prevYear = state.month === 0 ? state.year - 1 : state.year;
    const prevTotal = new Date(prevYear, prevMonth + 1, 0).getDate();
    const events = loadCalEvents();
    const cells = [];

    for (let i=0;i<42;i++) {
        let cell = { day:null, offset:0 };
        const idx = i - startDay + 1;
        if (i < startDay) { cell.day = prevTotal - (startDay - 1) + i; cell.offset = -1; } 
        else if (idx <= total) { cell.day = idx; cell.offset = 0; } 
        else { cell.day = idx - total; cell.offset = 1; }
        cells.push(cell);
    }

    const todayISO = formatISODate(new Date());
    cells.forEach(c => {
        const d = new Date(state.year, state.month + c.offset, c.day);
        const iso = formatISODate(d);
        const isToday = iso === todayISO;
        const dayEl = document.createElement('div');
        dayEl.className = 'etcal-day' + (c.offset !== 0 ? ' other-month' : '') + (isToday ? ' today' : '');
        dayEl.innerHTML = `<div class="day-num">${c.day}</div>`;
        
        const evs = events[iso] || [];
        if (evs.length) {
            const dots = document.createElement('div');
            dots.className = 'etcal-dots';
            [...new Set(evs.map(e => e.type))].slice(0, 6).forEach(tid => {
                const typeObj = EVENT_TYPES.find(x=>x.id===tid) || EVENT_TYPES[0];
                const dot = document.createElement('span');
                dot.className = 'etcal-dot';
                dot.style.background = typeObj.color;
                dots.appendChild(dot);
            });
            dayEl.appendChild(dots);
        }
        dayEl.onclick = () => { state.selectedISO = iso; renderCalGrid(root, state); renderSide(root, state); };
        daysContainer.appendChild(dayEl);
    });
}

function renderSide(root, state) {
    const selEl = root.querySelector('#etcal-selected-date');
    const list = root.querySelector('#etcal-event-list');
    const selISO = state.selectedISO;
    const d = new Date(selISO + 'T00:00:00');
    selEl.textContent = d.toLocaleDateString('pt-BR', { weekday:'long', day:'2-digit', month:'long' });

    const events = loadCalEvents();
    let arr = events[selISO] || [];
    list.innerHTML = '';
    if (!arr.length) { list.innerHTML = `<div class="small-muted" style="margin-top:10px;">Nenhum evento.</div>`; return; }

    arr.forEach((ev, idx) => {
        const evDiv = document.createElement('div');
        evDiv.className = 'etcal-event';
        evDiv.innerHTML = `<div class="ev-left"><div style="font-weight:700;">${ev.title}</div><div class="ev-meta">${(EVENT_TYPES.find(t=>t.id===ev.type)||{}).label}</div></div>`;
        const delBtn = document.createElement('button');
        delBtn.className = 'etcal-btn';
        delBtn.style.color = '#a00';
        delBtn.textContent = '✕';
        delBtn.onclick = () => {
            if (!confirm('Remover?')) return;
            const all = loadCalEvents();
            all[selISO].splice(idx, 1);
            saveCalEvents(all);
            renderCalGrid(root, state); renderSide(root, state);
        };
        evDiv.appendChild(delBtn);
        list.appendChild(evDiv);
    });
}

function openEventModal(dateISO, editObj, onSaved) {
    const modalBack = document.createElement('div');
    modalBack.className = 'etcal-modal-back';
    const modal = document.createElement('div');
    modal.className = 'etcal-modal';
    modal.innerHTML = `
        <h3>Adicionar evento</h3>
        <input id="ev-title" placeholder="Título">
        <select id="ev-type">${EVENT_TYPES.map(t=>`<option value="${t.id}">${t.label}</option>`).join("")}</select>
        <div style="margin-top:10px;display:flex;justify-content:flex-end;gap:8px;">
            <button id="ev-cancel">Cancelar</button><button id="ev-save">Salvar</button>
        </div>
    `;
    modalBack.appendChild(modal);
    document.body.appendChild(modalBack);

    modal.querySelector('#ev-cancel').onclick = () => modalBack.remove();
    modal.querySelector('#ev-save').onclick = () => {
        const title = modal.querySelector('#ev-title').value.trim();
        const type = modal.querySelector('#ev-type').value;
        if (!title) return alert('Título obrigatório');
        const all = loadCalEvents();
        if (!all[dateISO]) all[dateISO] = [];
        all[dateISO].push({ title, type });
        saveCalEvents(all);
        modalBack.remove();
        if (onSaved) onSaved();
    };
}
window.renderAdvancedCalendar = renderAdvancedCalendar;
/* =========================================================
   PÁGINA DE PARCEIROS E APOIADORES (CORRIGIDO)
   ========================================================= */

function renderPartnersPage() {
    if (!pageContainer) return;
    
    hideWelcome();
    content.style.display = "none";
    pageContainer.style.display = "block";

    // Cor do ícone definida aqui (Roxo Escuro)
    const iconColor = "#2e206b"; 

    pageContainer.innerHTML = `
    <div class="partners-page-content">
        
        <div class="partners-header">
            <h1>Parceiros e Apoiadores</h1>
        </div>

        <div class="partners-appreciation">
            <p>
                "Agradecemos imensamente aos nossos parceiros pela confiança e apoio. <br>
                Vocês são a <strong>força motriz</strong> deste projeto e fundamentais para levarmos educação a todos!" ❤️
            </p>
        </div>

        <div class="carousel-container">
            <button class="carousel-btn prev-btn" onclick="scrollCarousel('left')"><i class="fas fa-chevron-left"></i></button>
            
            <div class="partners-carousel" id="partnersCarousel">
                
                <div class="partner-logo-card" title="PUC Minas">
                    <i class="fas fa-university partner-logo-img" style="color: ${iconColor};"></i>
                    <div class="partner-name">PUC Minas</div>
                </div>

                <div class="partner-logo-card" title="Curso em Vídeo">
                    <i class="fas fa-play-circle partner-logo-img" style="color: ${iconColor};"></i>
                    <div class="partner-name">Curso em Vídeo</div>
                </div>

                <div class="partner-logo-card" title="O'Reilly">
                    <i class="fas fa-book partner-logo-img" style="color: ${iconColor};"></i>
                    <div class="partner-name">O'Reilly</div>
                </div>

                <div class="partner-logo-card placeholder-card">
                    <img src="img/Logoprincipal.png" alt="EducaTech" class="educatech-icon">
                    <div class="placeholder-text">Seja um Parceiro</div>
                </div>

                <div class="partner-logo-card placeholder-card">
                    <img src="img/Logoprincipal.png" alt="EducaTech" class="educatech-icon">
                    <div class="placeholder-text">Espaço Disponível</div>
                </div>

                <div class="partner-logo-card placeholder-card">
                    <img src="img/Logoprincipal.png" alt="EducaTech" class="educatech-icon">
                    <div class="placeholder-text">Apoie o Projeto</div>
                </div>

            </div>

            <button class="carousel-btn next-btn" onclick="scrollCarousel('right')"><i class="fas fa-chevron-right"></i></button>
        </div>

        <div class="mission-section">
            <div class="mission-header">
                <h2>Junte-se à nossa missão</h2>
                <p>Mudar histórias através do conhecimento é o nosso legado! Se você acredita nessa causa, preencha o formulário abaixo.</p>
            </div>

            <div class="join-cards-grid">
                
                <div class="join-card">
                    <h3><i class="fas fa-school" style="color:#7b4fff; margin-right:8px;"></i> Instituições de Ensino</h3>
                    <p>Escolas e faculdades que desejam levar tecnologia aos seus alunos.</p>
                    <button class="btn-join" onclick="openPartnerForm('Instituição de Ensino')">
                        Quero ser parceiro <i class="fas fa-arrow-right"></i>
                    </button>
                </div>

                <div class="join-card">
                    <h3><i class="fas fa-book" style="color:#7b4fff; margin-right:8px;"></i> Editoras e Conteúdo</h3>
                    <p>Editoras, jornais ou criadores de conteúdo educativo.</p>
                    <button class="btn-join" onclick="openPartnerForm('Produtor de Conteúdo')">
                        Quero apoiar <i class="fas fa-arrow-right"></i>
                    </button>
                </div>

                <div class="join-card">
                    <h3><i class="fas fa-chalkboard-teacher" style="color:#7b4fff; margin-right:8px;"></i> Professores e Alunos</h3>
                    <p>Voluntarie-se para ensinar ou criar grupos de estudo.</p>
                    <button class="btn-join" onclick="openPartnerForm('Voluntário')">
                        Participar <i class="fas fa-arrow-right"></i>
                    </button>
                </div>

                <div class="join-card">
                    <h3><i class="fas fa-hand-holding-heart" style="color:#7b4fff; margin-right:8px;"></i> Outros Apoios</h3>
                    <p>Empresas e investidores que querem patrocinar a educação.</p>
                    <button class="btn-join" onclick="openPartnerForm('Investidor/Outros')">
                        Contribuir <i class="fas fa-arrow-right"></i>
                    </button>
                </div>

            </div>
        </div>

    </div>
    `;
}

// Lógica do Carrossel (Rolar para os lados)
function scrollCarousel(direction) {
    const carousel = document.getElementById('partnersCarousel');
    const scrollAmount = 300; // Quanto rola por clique
    
    if (direction === 'left') {
        carousel.scrollLeft -= scrollAmount;
    } else {
        carousel.scrollLeft += scrollAmount;
    }
}

// Lógica do Formulário Modal (Junte-se a nós)
function openPartnerForm(tipoParceria) {
    Swal.fire({
        title: `Parceria: ${tipoParceria}`,
        html: `
            <p style="font-size:0.9rem; color:#666; margin-bottom:20px;">Preencha seus dados e entraremos em contato!</p>
            <label>Seu Nome</label>
            <input type="text" id="partnerName" class="swal2-input" placeholder="Nome completo" style="margin: 0 auto 15px auto;">
            
            <label>E-mail Corporativo/Pessoal</label>
            <input type="email" id="partnerEmail" class="swal2-input" placeholder="email@exemplo.com" style="margin: 0 auto 15px auto;">
            
            <label>Nome da Organização (Opcional)</label>
            <input type="text" id="partnerOrg" class="swal2-input" placeholder="Empresa, Escola, etc." style="margin: 0 auto 15px auto;">
            
            <label>Mensagem</label>
            <textarea id="partnerMsg" class="swal2-textarea" placeholder="Conte como gostaria de ajudar..." style="margin: 0 auto; display:block;"></textarea>
        `,
        width: 600,
        confirmButtonText: 'Enviar Proposta <i class="fas fa-paper-plane"></i>',
        confirmButtonColor: '#7b4fff',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        preConfirm: () => {
            const nome = document.getElementById('partnerName').value;
            const email = document.getElementById('partnerEmail').value;
            if (!nome || !email) {
                Swal.showValidationMessage('Por favor, preencha nome e e-mail');
            }
            return { nome, email };
        }
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({
                icon: 'success',
                title: 'Recebemos sua proposta!',
                text: `Obrigado, ${result.value.nome}. Nossa equipe de parcerias entrará em contato em breve pelo email ${result.value.email}.`,
                confirmButtonColor: '#7b4fff'
            });
        }
    });
}

// Expor para global
window.renderPartnersPage = renderPartnersPage;
window.scrollCarousel = scrollCarousel;
window.openPartnerForm = openPartnerForm;

/* =========================================================
   FUNCIONALIDADE INTEGRADA: BLOCO DE ANOTAÇÕES
   ========================================================= */

// Variáveis globais do bloco de notas
let notes = JSON.parse(localStorage.getItem("educaTechNotas")) || [];
let currentNoteId = null;

function renderNotesPage() {
    if (!pageContainer) return;

    // 1. Prepara a tela (Esconde home, mostra container)
    hideWelcome();
    content.style.display = "none";
    pageContainer.style.display = "block";

    // 2. Injeta o HTML (Exatamente como estava no seu indexbloco.html)
    pageContainer.innerHTML = `
        <div class="note-page-layout"> 
            
            <div class="note-page-left">
                <h1 class="page-title-fiel">Bloco de Anotações</h1>
                <button id="newNoteBtn" class="new-note-btn">
                    <i class="fas fa-plus-circle"></i> Nova Anotação
                </button>
                <div id="notesListContainer">
                    </div>
            </div>

            <div class="note-page-right">
                <div class="note-editor-card-fiel">
                    <div class="editor-header-fiel">
                        <h3 id="noteTitleDisplay" contenteditable="true">Título da anotação</h3>
                        <div class="toolbar-fiel" id="toolbarContainer">
                            <button type="button" data-command="formatBlock" data-value="H3">H3</button>
                            <button type="button" data-command="bold">B</button>
                            <button type="button" data-command="italic">I</button>
                            <button type="button" data-command="underline">U</button>
                            <button type="button" data-command="insertImage"><i class="fas fa-image"></i></button>
                            <button type="button" data-command="insertUnorderedList"><i class="fas fa-list"></i></button>
                        </div>
                    </div>

                    <div class="note-content-area-fiel">
                        <div id="noteContentEditor" 
                             class="content-editable-area" 
                             contenteditable="true" 
                             placeholder="Digite o conteúdo da sua anotação aqui...">
                        </div>
                    </div>
                    
                    <button id="saveNoteBtn" class="save-note-btn-fiel">Salvar anotação</button>
                </div>
            </div>
        </div>
    `;

    // 3. Configura os Eventos (Listeners)
    attachNotesLogic();
    
    // 4. Carrega a lista inicial e limpa o editor
    renderNotesList();
    novaNota();
}

function attachNotesLogic() {
    const saveBtn = document.getElementById("saveNoteBtn");
    const newNoteBtn = document.getElementById("newNoteBtn");
    const toolbarButtons = document.querySelectorAll('#toolbarContainer button');
    const noteTitle = document.getElementById("noteTitleDisplay");

    if (saveBtn) saveBtn.addEventListener("click", salvarNota);
    if (newNoteBtn) newNoteBtn.addEventListener("click", novaNota);

    // Eventos da Toolbar
    toolbarButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault(); // Evita recarregar página
            const command = button.getAttribute('data-command');
            const value = button.getAttribute('data-value');
            executeNoteCommand(command, value);
        });
    });
}

function executeNoteCommand(command, value = null) {
    const editor = document.getElementById("noteContentEditor");
    if (!editor) return;
    editor.focus();
    
    if (command === 'insertImage') {
        const imageUrl = prompt("Digite a URL da Imagem:");
        if (imageUrl) {
            document.execCommand(command, false, imageUrl);
        }
    } else {
        document.execCommand(command, false, value);
    }
}

function renderNotesList() {
    const container = document.getElementById("notesListContainer");
    if (!container) return;

    container.innerHTML = ''; 
    const ul = document.createElement('ul');
    ul.classList.add('notes-list');

    if (notes.length === 0) {
        container.innerHTML = "<p style='color:#666; font-size:0.9rem; padding: 10px;'>Nenhuma anotação salva ainda.</p>";
        return;
    }

    notes.forEach((note) => {
        const li = document.createElement("li");
        li.classList.add("note-item");
        li.innerHTML = `
            <div class="note-item-content">
                <strong>${note.title || "Sem título"}</strong><br>
                <small>${note.date}</small>
            </div>
            <div class="note-item-actions">
                <button class="edit-btn" title="Editar"><i class="fas fa-edit"></i></button>
                <button class="delete-btn" title="Excluir"><i class="fas fa-trash"></i></button>
            </div>
        `;

        // Evento de Clique no Texto (Carregar)
        li.querySelector(".note-item-content").addEventListener("click", () => carregarNota(note.id));
        
        // Evento de Editar
        li.querySelector(".edit-btn").addEventListener("click", (e) => {
            e.stopPropagation();
            carregarNota(note.id);
        });

        // Evento de Excluir
        li.querySelector(".delete-btn").addEventListener("click", (e) => {
            e.stopPropagation(); 
            excluirNota(note.id);
        });

        ul.appendChild(li);
    });

    container.appendChild(ul);
}

function salvarNota() {
    const titleEl = document.getElementById("noteTitleDisplay");
    const contentEl = document.getElementById("noteContentEditor");
    
    if (!titleEl || !contentEl) return;
    
    const title = titleEl.innerText.trim();
    const content = contentEl.innerHTML; // Salva o HTML com formatação

    if (contentEl.innerText.trim().length < 1 && !content.includes('<img')) {
        alert("Escreva algo antes de salvar!");
        return;
    }

    const date = new Date().toLocaleString("pt-BR", {
        day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit",
    });

    if (currentNoteId) {
        // Editar nota existente
        const index = notes.findIndex((n) => n.id === currentNoteId);
        if (index !== -1) {
            notes[index] = { ...notes[index], title: title || "Sem título", content, date };
        }
    } else {
        // Criar nova nota
        const novaNotaObj = {
            id: Date.now(),
            title: title || "Sem título",
            content,
            date,
        };
        notes.push(novaNotaObj);
        currentNoteId = novaNotaObj.id; 
    }

    localStorage.setItem("educaTechNotas", JSON.stringify(notes));
    renderNotesList();
    
    // Feedback visual simples
    const btn = document.getElementById("saveNoteBtn");
    const originalText = btn.innerText;
    btn.innerText = "Salvo! ✅";
    setTimeout(() => btn.innerText = originalText, 1500);
}

function carregarNota(id) {
    const nota = notes.find((n) => n.id === id);
    if (!nota) return;
    
    currentNoteId = id;
    
    const titleEl = document.getElementById("noteTitleDisplay");
    const contentEl = document.getElementById("noteContentEditor");
    
    if (titleEl) titleEl.innerText = nota.title;
    if (contentEl) contentEl.innerHTML = nota.content;
}

function excluirNota(id) {
    if (!confirm("Tem certeza que deseja excluir esta anotação?")) return;

    notes = notes.filter((n) => n.id !== id);
    localStorage.setItem("educaTechNotas", JSON.stringify(notes));
    
    if (currentNoteId === id) {
        novaNota(); 
    }
    
    renderNotesList();
}

function novaNota() {
    currentNoteId = null; 
    
    const titleEl = document.getElementById("noteTitleDisplay");
    const contentEl = document.getElementById("noteContentEditor");
    
    if (titleEl) titleEl.innerText = "Título da anotação";
    if (contentEl) {
        contentEl.innerHTML = "";
        contentEl.focus();
    }
}

/* =========================================================
   FUNCIONALIDADE INTEGRADA: CONTEÚDOS BAIXADOS
   ========================================================= */

// Armazenamento em memória para arquivos (sem persistência real entre sessões)
let downloadedFiles = [];

function renderDownloadedPage() {
    if (!pageContainer) return;

    hideWelcome();
    content.style.display = "none";
    pageContainer.style.display = "block";

    pageContainer.innerHTML = `
        <div class="download-page-content">
            <h1 class="section-title-baixados">Meus Conteúdos <br> Baixados</h1>

            <div class="controls-bar">
                <label class="upload-btn">
                    <i class="fas fa-folder-open"></i> Enviar arquivo
                    <input type="file" id="fileInputBaixados" hidden>
                </label>

                <div class="search-box">
                    <input type="text" id="searchInputBaixados" placeholder="Pesquisar...">
                    <button class="search-btn" id="searchBtnBaixados">
                        <i class="fas fa-search"></i>
                    </button>
                </div>

                <div class="sort-dropdown">
                    <span>Ordenar por:</span>
                    <select id="sortDropdownBaixados">
                        <option value="date">Data</option>
                        <option value="name">Nome</option>
                    </select>
                </div>
            </div>

            <div class="content-grid" id="contentGridBaixados">
                </div>
        </div>
    `;

    attachDownloadedListeners();
    renderDownloadedFiles();
}

function attachDownloadedListeners() {
    const fileInput = document.getElementById("fileInputBaixados");
    const searchInput = document.getElementById("searchInputBaixados");
    const sortDropdown = document.getElementById("sortDropdownBaixados");

    if (fileInput) fileInput.addEventListener("change", handleFileUpload);
    if (searchInput) {
        searchInput.addEventListener("keyup", renderDownloadedFiles);
        document.getElementById("searchBtnBaixados").addEventListener("click", renderDownloadedFiles);
    }
    if (sortDropdown) sortDropdown.addEventListener("change", renderDownloadedFiles);
}

function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    // A lógica de URL.createObjectURL armazena o arquivo temporariamente no navegador.
    const fileURL = URL.createObjectURL(file);

    const newFile = {
        id: Date.now(),
        name: file.name,
        url: fileURL,
        type: file.type,
        date: new Date(),
    };

    downloadedFiles.push(newFile);
    renderDownloadedFiles();
    
    // Limpa o input para permitir novo upload do mesmo arquivo
    event.target.value = null; 
}

function deleteDownloadedFile(id) {
    if (!confirm("Tem certeza que deseja excluir este arquivo?")) return;
    
    // Libera a URL temporária para limpar a memória do navegador
    const fileToDelete = downloadedFiles.find(f => f.id === id);
    if (fileToDelete && fileToDelete.url) {
        URL.revokeObjectURL(fileToDelete.url);
    }

    downloadedFiles = downloadedFiles.filter(f => f.id !== id);
    renderDownloadedFiles();
}

function downloadFile(file) {
    const a = document.createElement("a");
    a.href = file.url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

function renderDownloadedFiles() {
    const grid = document.getElementById("contentGridBaixados");
    if (!grid) return;
    
    const search = document.getElementById("searchInputBaixados")?.value.toLowerCase() || '';
    const sort = document.getElementById("sortDropdownBaixados")?.value || 'date';

    let filtered = downloadedFiles.filter(f => f.name.toLowerCase().includes(search));

    // Lógica de Ordenação
    if (sort === 'name') {
        filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sort === 'date') {
        filtered.sort((a, b) => b.date - a.date); // Mais recente primeiro
    }

    grid.innerHTML = '';

    if (filtered.length === 0) {
        grid.innerHTML = `<p style="grid-column: 1 / -1; color:#777; padding:20px;">Nenhum arquivo encontrado.</p>`;
        return;
    }

    filtered.forEach(file => {
        const item = document.createElement("div");
        item.classList.add("content-item");

        // Usando o ícone de pasta do seu HTML original
        item.innerHTML = `
            <div class="file-icon-placeholder" title="Abrir Arquivo">
                <i class="fas fa-file-pdf"></i> </div>
            <span class="file-name" title="${file.name}">${file.name}</span>
            <button class="delete-btn-baixados" data-file-id="${file.id}"><i class="fas fa-trash-alt"></i></button>
        `;

        // Evento de download ao clicar no item (exceto no botão de deletar)
        item.addEventListener("click", (e) => {
            if (e.target.closest('.delete-btn-baixados')) return;
            downloadFile(file);
        });

        // Evento de deletar
        item.querySelector(".delete-btn-baixados").addEventListener("click", (e) => {
            e.stopPropagation();
            deleteDownloadedFile(file.id);
        });

        grid.appendChild(item);
    });
}

/* =========================================================
   FUNCIONALIDADE INTEGRADA: CONTEÚDOS SALVOS
   ========================================================= */

// Dados Simulados do scriptsalvos.js (Substitui o array local)
let savedContentList = [
    { id: 101, nome: "Exercício de Python", caminho: "img/exerciciopython.png", tipo: "file" },
    { id: 102, nome: "Prisma de Identidade Marketing", caminho: "img/Marketing.png", tipo: "file" },
    { id: 103, nome: "Exemplo de Exercício Excel", caminho: "img/excel.jpg", tipo: "file" },
    { id: 104, nome: "Exercício de Lógica", caminho: "img/lógica.png", tipo: "file" },
    { id: 105, nome: "Introdução à Programação (Aula)", caminho: "https://www.youtube.com/watch?v=8mei6uVttho&list=PLHz_AreHm4dmSj0MHol_aoNYCSGFqvfXV", tipo: "video" },
];

function renderSavedContentPage() {
    if (!pageContainer) return;

    hideWelcome();
    content.style.display = "none";
    pageContainer.style.display = "block";

    pageContainer.innerHTML = `
        <div class="page-body-salvos"> 
            <h1 class="section-title-salvos">Meus Conteúdos <br> Salvos</h1>
            <div class="content-grid-salvos" id="grid-conteudos-salvos">
            </div>
        </div>
    `;

    renderizarConteudosSalvos();
}

function renderizarConteudosSalvos() {
    const grid = document.getElementById('grid-conteudos-salvos');
    if (!grid) return;
    grid.innerHTML = ""; // Limpa tudo antes de desenhar

    savedContentList.forEach(arquivo => {
        // 1. Cria o quadrado (Card)
        const itemDiv = document.createElement('div');
        itemDiv.classList.add('content-item-salvos');
        itemDiv.setAttribute('title', arquivo.nome); 

        // 2. Cria o botão de lixeira
        const btnDelete = document.createElement('button');
        btnDelete.classList.add('delete-marker-salvos');
        btnDelete.innerHTML = '<i class="fas fa-trash-alt"></i>';

        // 3. Cria o ícone visual (Bookmark ou outro)
        const iconDiv = document.createElement('div');
        iconDiv.classList.add('bookmark-icon');
        
        // Define o ícone com base no tipo
        let iconClass = '';
        if (arquivo.tipo === 'curso' || arquivo.tipo === 'file') {
            iconClass = 'fas fa-bookmark'; // Bookmark para cursos/arquivos
        } else if (arquivo.tipo === 'video') {
             iconClass = 'fab fa-youtube'; // YouTube para vídeos
        } else if (arquivo.tipo === 'image') {
             iconClass = 'fas fa-image';
        } else {
             iconClass = 'fas fa-star'; // Padrão
        }
        iconDiv.innerHTML = `<i class="${iconClass}"></i>`;


        // 4. CRIA O TEXTO DO NOME
        const nomeDiv = document.createElement('div');
        nomeDiv.classList.add('item-name-salvos');
        nomeDiv.innerText = arquivo.nome; 

        // 5. Coloca tudo dentro do quadrado
        itemDiv.appendChild(btnDelete); 
        itemDiv.appendChild(iconDiv);   
        itemDiv.appendChild(nomeDiv);   

        // 6. Joga o quadrado na tela
        grid.appendChild(itemDiv);

        // --- EVENTOS ---

        // Botão Deletar
        btnDelete.addEventListener('click', (event) => {
            event.stopPropagation();
            if (confirm(`Tem certeza que deseja remover "${arquivo.nome}" dos salvos?`)) {
                
                // Remove do array simulado
                savedContentList = savedContentList.filter(f => f.id !== arquivo.id);
                
                // Efeito visual
                itemDiv.style.opacity = '0';
                itemDiv.style.transform = 'scale(0.8)';
                setTimeout(() => {
                    renderizarConteudosSalvos(); // Re-renderiza a lista após a exclusão
                }, 300);
            }
        });

        // Clicar no Card para abrir arquivo
        itemDiv.addEventListener('click', () => {
            console.log("Abrindo:", arquivo.caminho);
            window.open(arquivo.caminho, '_blank'); 
        });
    });
}
/* =========================================================
   1. GAMIFICAÇÃO: MEDALHAS, LOJA E INVENTÁRIO (ATUALIZADO)
   ========================================================= */

// 1. BANCO DE DADOS DE MEDALHAS (EXPANDIDO)
const MEDALS_DB = [
    { id: 'm_welcome', title: 'Boas-vindas!', desc: 'Criou sua conta no EducaTech.', diff: 'easy', val: 50, icon: 'fas fa-door-open', unlocked: true },
    { id: 'm_first_course', title: 'Primeiros Passos', desc: 'Iniciou seu primeiro curso.', diff: 'easy', val: 100, icon: 'fas fa-play', unlocked: true },
    { id: 'm_social', title: 'Sociável', desc: 'Acesse a área de suporte.', diff: 'easy', val: 50, icon: 'fas fa-comments', unlocked: true },
    { id: 'm_night_owl', title: 'Madrugadeiro', desc: 'Estudou entre 00h e 05h.', diff: 'medium', val: 200, icon: 'fas fa-moon', unlocked: false },
    { id: 'm_streak_3', title: 'Foco Total', desc: '3 dias seguidos estudando.', diff: 'medium', val: 300, icon: 'fas fa-fire', unlocked: false },
    { id: 'm_quiz_master', title: 'Mestre do Quiz', desc: 'Acertou 100% em um teste.', diff: 'hard', val: 400, icon: 'fas fa-brain', unlocked: false },
    { id: 'm_marathon', title: 'Maratonista', desc: 'Assistiu 10 aulas no mesmo dia.', diff: 'hard', val: 500, icon: 'fas fa-running', unlocked: false },
    { id: 'm_influencer', title: 'Influenciador', desc: 'Convidou 5 amigos.', diff: 'legendary', val: 800, icon: 'fas fa-bullhorn', unlocked: false },
    { id: 'm_legend', title: 'Lenda Viva', desc: 'Completou 10 cursos.', diff: 'legendary', val: 1000, icon: 'fas fa-dragon', unlocked: true }
];

// 2. BANCO DE DADOS DA LOJA (CORRIGIDO E SEM DUPLICATAS)
const SHOP_DB = [
    // Item Especial: Resetar Tema
    { id: 'theme_default', name: 'Tema Original', price: 0, icon: 'fas fa-undo', type: 'theme', class: 'default' },

    // Temas
    { id: 'theme_cute', name: 'Mundo Doce 🍭', price: 1000, icon: 'fas fa-ice-cream', type: 'theme', class: 'theme-cute' },

    // Bordas de Avatar
    { id: 'border_gold', name: 'Borda de Ouro', price: 300, icon: 'far fa-circle', type: 'border', class: 'border-gold' },
    { id: 'border_neon', name: 'Borda Neon', price: 500, icon: 'far fa-dot-circle', type: 'border', class: 'border-neon' },
    { id: 'border_fire', name: 'Borda de Fogo', price: 800, icon: 'fas fa-fire-alt', type: 'border', class: 'border-fire' },
    
    // Cursores
    { id: 'cursor_rocket', name: 'Cursor Foguete', price: 250, icon: 'fas fa-rocket', type: 'cursor', class: 'cursor-rocket' },
    { id: 'cursor_magic', name: 'Cursor Mágico', price: 400, icon: 'fas fa-magic', type: 'cursor', class: 'cursor-magic' },
    
    // Outros (Consumíveis/Perfil)
    { id: 'avatar_robot', name: 'Avatar Robô', price: 150, icon: 'fas fa-robot', type: 'avatar', msg: 'Avatar desbloqueado no perfil!' },
    { id: 'ebook_py', name: 'E-book Python', price: 600, icon: 'fas fa-book', type: 'content', link: '#' }
];

// --- GERENCIAMENTO DE ESTADO ---

function getCoins() { return parseInt(localStorage.getItem('et_coins') || '0'); }
function addCoins(n) { localStorage.setItem('et_coins', getCoins() + n); updateHeaderBalance(); }
function spendCoins(n) { 
    let current = getCoins();
    if (current >= n) { localStorage.setItem('et_coins', current - n); updateHeaderBalance(); return true; }
    return false;
}

// Inventário e Itens Equipados
function getInventory() { return JSON.parse(localStorage.getItem('et_inventory') || '[]'); }
function addToInventory(itemId) {
    const inv = getInventory();
    if (!inv.includes(itemId)) {
        inv.push(itemId);
        localStorage.setItem('et_inventory', JSON.stringify(inv));
    }
}

// Retorna qual item está equipado para cada categoria (border, cursor, theme)
function getEquipped() {
    return JSON.parse(localStorage.getItem('et_equipped') || '{}');
}

// Equipa ou Desequipa um item
function toggleEquipItem(item) {
    let equipped = getEquipped();
    
    // Se for o item "Tema Original" OU se o usuário clicar em "Desativar" no item já equipado
    if (item.class === 'default' || equipped[item.type] === item.class) {
        delete equipped[item.type]; // Remove a customização do tipo (ex: remove o tema atual)
        Swal.fire('Info', 'Visual restaurado ao padrão.', 'info');
    } else {
        // Equipa o novo item
        equipped[item.type] = item.class;
        Swal.fire('Sucesso!', `${item.name} equipado!`, 'success');
    }
    
    localStorage.setItem('et_equipped', JSON.stringify(equipped));
    applyUserCustomizations(); // Aplica visualmente na hora
    renderMedalsPage(); // Atualiza os botões da loja
}

// Aplica os efeitos visuais
function applyUserCustomizations() {
    const equipped = getEquipped();
    const body = document.body;
    
    // 1. LIMPEZA: Remove TODAS as classes de customização possíveis
    body.classList.remove('theme-dark', 'theme-cute', 'cursor-rocket', 'cursor-magic');
    
    // Limpa bordas do botão de login
    const loginBtn = document.getElementById('loginBtn');
    if (loginBtn) {
        loginBtn.classList.remove('border-gold', 'border-neon', 'border-fire');
    }

    // 2. APLICAÇÃO: Adiciona as classes salvas
    if (equipped.theme && equipped.theme !== 'default') body.classList.add(equipped.theme);
    if (equipped.cursor) body.classList.add(equipped.cursor);
    if (equipped.border && loginBtn) loginBtn.classList.add(equipped.border);
}

// Medalhas Resgatadas
function getClaimedMedals() { return JSON.parse(localStorage.getItem('et_claimed_medals') || '[]'); }
function setMedalClaimed(id) {
    const claimed = getClaimedMedals();
    if (!claimed.includes(id)) {
        claimed.push(id);
        localStorage.setItem('et_claimed_medals', JSON.stringify(claimed));
    }
}

// --- RENDERIZAÇÃO ---

function renderMedalsPage() {
    if (!pageContainer) return;
    hideWelcome(); content.style.display = "none"; pageContainer.style.display = "block";

    const currentCoins = getCoins();
    const inventory = getInventory();
    const equipped = getEquipped();

    pageContainer.innerHTML = `
        <div class="medals-page-content">
            <div class="gamification-header">
                <div class="user-level-info">
                    <h2>Central de Conquistas 🏆</h2>
                    <p>Complete missões, ganhe moedas e personalize seu perfil!</p>
                </div>
                <div class="coin-balance">
                    <i class="fas fa-coins coin-icon"></i>
                    <span id="display-coins">${currentCoins}</span> TechC
                </div>
            </div>

            <div class="gamification-tabs">
                <button class="g-tab-btn active" onclick="switchTab('medals')">🏅 Medalhas</button>
                <button class="g-tab-btn" onclick="switchTab('shop')">🛒 Lojinha Tech</button>
            </div>

            <div id="gamification-content-medals">
                <div class="section-title">Suas Conquistas</div>
                <div class="medals-grid">
                    ${MEDALS_DB.map(medal => {
                        const isClaimed = getClaimedMedals().includes(medal.id);
                        const isUnlocked = medal.unlocked; // Simulação
                        let btn = `<button class="btn-claim" disabled style="background:#eee;color:#999"><i class="fas fa-lock"></i> Bloqueado</button>`;
                        if (isClaimed) btn = `<button class="btn-claim" disabled style="background:#ddd;color:#555">Resgatado ✅</button>`;
                        else if (isUnlocked) btn = `<button class="btn-claim" onclick="claimReward('${medal.id}', ${medal.val})">Resgatar ${medal.val} <i class="fas fa-coins"></i></button>`;
                        
                        return `
                        <div class="medal-card ${isUnlocked?'medal-unlocked':''} medal-${medal.diff}">
                            <div class="medal-icon-box"><i class="${medal.icon}"></i></div>
                            <div class="medal-info"><h3>${medal.title}</h3><p>${medal.desc}</p><div class="medal-value">${medal.val} TechC</div></div>
                            ${btn}
                        </div>`;
                    }).join('')}
                </div>
            </div>

            <div id="gamification-content-shop" style="display:none;">
                <div class="section-title">Personalize sua experiência</div>
                <div class="shop-grid">
                    ${SHOP_DB.map(item => {
                        const isOwned = inventory.includes(item.id);
                        const isEquipped = equipped[item.type] === item.class;
                        
                        let actionBtn;
                        if (!isOwned) {
                            actionBtn = `<button class="btn-buy" onclick="buyShopItem('${item.id}', ${item.price}, '${item.name}')">Comprar (${item.price})</button>`;
                        } else {
                            if (item.type === 'content' || item.type === 'avatar') {
                                // Itens consumíveis ou sem efeito visual direto no CSS global
                                actionBtn = `<button class="btn-buy owned">Adquirido ✅</button>`;
                            } else {
                                // Itens equipáveis
                                actionBtn = isEquipped 
                                    ? `<button class="btn-unequip" onclick="equipShopItem('${item.id}')">Desativar ❌</button>`
                                    : `<button class="btn-equip" onclick="equipShopItem('${item.id}')">Equipar ✨</button>`;
                            }
                        }

                        return `
                        <div class="shop-item">
                            <div class="shop-icon"><i class="${item.icon}"></i></div>
                            <h3>${item.name}</h3>
                            ${!isOwned ? `<div class="shop-price"><i class="fas fa-coins"></i> ${item.price}</div>` : ''}
                            ${actionBtn}
                        </div>`;
                    }).join('')}
                </div>
            </div>
        </div>
    `;
}

// --- AÇÕES ---

window.switchTab = function(tab) {
    document.getElementById('gamification-content-medals').style.display = tab === 'medals' ? 'block' : 'none';
    document.getElementById('gamification-content-shop').style.display = tab === 'shop' ? 'block' : 'none';
    const btns = document.querySelectorAll('.g-tab-btn');
    btns.forEach(b => b.classList.remove('active'));
    btns[tab === 'medals' ? 0 : 1].classList.add('active');
}

window.claimReward = function(id, val) {
    addCoins(val);
    setMedalClaimed(id);
    Swal.fire({ icon: 'success', title: 'Yay!', text: `Você ganhou ${val} TechC!`, confirmButtonColor: '#7b4fff' });
    renderMedalsPage();
}

window.buyShopItem = function(id, price, name) {
    Swal.fire({
        title: `Comprar ${name}?`,
        text: `Preço: ${price} TechC`,
        showCancelButton: true,
        confirmButtonText: 'Confirmar',
        confirmButtonColor: '#7b4fff'
    }).then(res => {
        if (res.isConfirmed) {
            if (spendCoins(price)) {
                addToInventory(id);
                Swal.fire('Sucesso!', 'Compra realizada!', 'success');
                renderMedalsPage();
                setTimeout(() => switchTab('shop'), 50);
            } else {
                Swal.fire('Ops', 'Saldo insuficiente.', 'error');
            }
        }
    });
}

window.equipShopItem = function(itemId) {
    const item = SHOP_DB.find(i => i.id === itemId);
    if (item) toggleEquipItem(item);
}

function updateHeaderBalance() {
    const el = document.getElementById('display-coins');
    if (el) el.textContent = getCoins();
}

// Inicializar personalizações ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    applyUserCustomizations();
});

// Expor globalmente
window.renderMedalsPage = renderMedalsPage;

/* =========================================================
   NOVAS PÁGINAS INTEGRADAS: ARTIGOS, PODCASTS, CONFIG
   ========================================================= */

// --- 1. PÁGINA DE ARTIGOS ---
function renderArticlesPage() {
    if (!pageContainer) return;
    hideWelcome(); content.style.display = "none"; pageContainer.style.display = "block";

    // Simulação de dados (pode vir do JSON depois)
    const artigos = [
        { titulo: "IA na Educação", resumo: "Como a inteligência artificial está transformando o aprendizado.", img: "img/programacaoiniciante.png", tag: "Tecnologia" },
        { titulo: "Carreira Dev", resumo: "Dicas essenciais para quem está começando no mercado de TI.", img: "img/logicaprogramacao.png", tag: "Carreira" },
        { titulo: "UX Design Moderno", resumo: "Tendências de design para interfaces em 2025.", img: "img/dominandooffice.png", tag: "Design" },
        { titulo: "Produtividade", resumo: "Métodos para estudar melhor e render mais.", img: "img/Logoprincipal.png", tag: "Dicas" }
    ];

    pageContainer.innerHTML = `
        <div class="section-header" style="padding: 0 20px;">
            <h1 style="color: #2e206b;">Artigos Recentes</h1>
            <div class="search-box" style="max-width:300px;">
                 <input type="text" placeholder="Buscar artigo...">
                 <button class="search-btn"><i class="fas fa-search"></i></button>
            </div>
        </div>
        
        <div class="content-grid" style="padding: 20px; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));">
            ${artigos.map(art => `
            <div class="course-card" style="min-height: auto;">
                <div class="course-card-media" style="height: 150px;">
                    <img src="${art.img}" alt="${art.titulo}" style="height: 100%; width: 100%; object-fit: cover; border-radius: 15px;">
                </div>
                <div class="course-card-body" style="transform: translateY(-20px); background: white; margin: 0 10px; border: 1px solid #eee;">
                    <span class="badge nivel" style="background:#e0f7fa; color:#006064; margin-bottom:10px; display:inline-block;">${art.tag}</span>
                    <h3 style="font-size: 1.1rem; margin-bottom: 8px; color: #333;">${art.titulo}</h3>
                    <p style="font-size: 0.9rem; color: #666; margin-bottom: 15px;">${art.resumo}</p>
                    <button class="btn-ver" style="width:100%">Ler Artigo</button>
                </div>
            </div>
            `).join('')}
        </div>
    `;
}

// --- 2. PÁGINA DE PODCASTS ---
function renderPodcastsPage() {
    if (!pageContainer) return;
    hideWelcome(); content.style.display = "none"; pageContainer.style.display = "block";

    const podcasts = [
        { titulo: "TechTalk #01: O futuro do Java", duracao: "45 min", played: false },
        { titulo: "EducaCast #12: Soft Skills", duracao: "32 min", played: true },
        { titulo: "DevVoice #05: Oportunidades Remotas", duracao: "50 min", played: false }
    ];

    pageContainer.innerHTML = `
        <div style="padding: 20px; max-width: 900px; margin: 0 auto;">
            <div style="display:flex; align-items:center; gap:20px; margin-bottom:40px; background:linear-gradient(90deg, #2e206b, #7b4fff); padding:40px; border-radius:20px; color:white;">
                <i class="fas fa-headphones-alt" style="font-size: 4rem;"></i>
                <div>
                    <h1 style="margin:0; font-size: 2.5rem;">EducaCast</h1>
                    <p style="opacity:0.9;">Ouça, aprenda e inspire-se onde estiver.</p>
                </div>
            </div>

            <h2 style="color: #333; margin-bottom: 20px;">Episódios Disponíveis</h2>
            
            <div style="display:flex; flex-direction:column; gap:15px;">
                ${podcasts.map((pod, index) => `
                <div style="background: white; padding: 20px; border-radius: 15px; display: flex; align-items: center; justify-content: space-between; box-shadow: 0 4px 10px rgba(0,0,0,0.05); transition: transform 0.2s;">
                    <div style="display:flex; align-items:center; gap:15px;">
                        <div style="width:50px; height:50px; background:${pod.played ? '#ddd' : '#7b4fff'}; border-radius:50%; display:flex; align-items:center; justify-content:center; color:white; font-size:1.2rem;">
                            <i class="fas fa-${pod.played ? 'check' : 'play'}"></i>
                        </div>
                        <div>
                            <h3 style="margin:0; color:#333; font-size:1.1rem;">${pod.titulo}</h3>
                            <span style="font-size:0.85rem; color:#888;">Duração: ${pod.duracao}</span>
                        </div>
                    </div>
                    <button class="btn-ver" style="width: auto; padding: 8px 20px;">
                        ${pod.played ? 'Ouvir Novamente' : 'Reproduzir'}
                    </button>
                </div>
                `).join('')}
            </div>
        </div>
    `;
}

// --- 3. PÁGINA DE CONFIGURAÇÕES ---
function renderSettingsPage() {
    if (!pageContainer) return;
    hideWelcome(); content.style.display = "none"; pageContainer.style.display = "block";

    // Recupera dados simulados ou do localStorage
    const userLogin = localStorage.getItem('userLogin') || 'Aluno(a)';
    const temaAtual = localStorage.getItem('et_equipped') ? JSON.parse(localStorage.getItem('et_equipped')).theme || 'Padrão' : 'Padrão';

    pageContainer.innerHTML = `
        <div style="padding: 20px; max-width: 800px; margin: 0 auto;">
            <h1 style="color: #2e206b; margin-bottom: 30px;">⚙️ Configurações da Conta</h1>

            <div class="form-card" style="margin-bottom: 30px;">
                <div style="display:flex; align-items:center; gap:20px; margin-bottom:30px; border-bottom:1px solid #eee; padding-bottom:20px;">
                    <div style="width:80px; height:80px; background:#e0e0e0; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:2rem; color:#777;">
                        <i class="fas fa-user"></i>
                    </div>
                    <div>
                        <h3 style="margin:0;">${userLogin}</h3>
                        <p style="margin:0; color:#666; font-size:0.9rem;">Aluno(a) EducaTech</p>
                        <button style="margin-top:10px; border:none; background:transparent; color:#7b4fff; cursor:pointer; font-weight:600;">Alterar Foto</button>
                    </div>
                </div>

                <h3 style="font-size:1.2rem; margin-bottom:15px;">Dados Pessoais</h3>
                <div class="form-group">
                    <label>Nome de Exibição</label>
                    <input type="text" value="${userLogin}" style="background:#f9f9f9;">
                </div>
                <div class="form-group">
                    <label>E-mail</label>
                    <input type="email" value="aluno@educatech.com" disabled style="background:#eee; cursor:not-allowed;">
                </div>
                
                <h3 style="font-size:1.2rem; margin-bottom:15px; margin-top:30px;">Preferências</h3>
                 <div style="background: #f8f9fa; padding: 15px; border-radius: 10px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                    <div>
                        <strong>Tema Atual</strong>
                        <div style="font-size: 0.9rem; color: #666;">${temaAtual.replace('theme-', '')}</div>
                    </div>
                    <button class="btn-ver" onclick="renderMedalsPage(); setTimeout(()=>switchTab('shop'),100);" style="width:auto;">Ir para Loja de Temas</button>
                </div>

                <div style="display:flex; justify-content:space-between; margin-top:30px;">
                    <button class="btn-submit" style="width:48%; background:#ccc; color:#333;">Cancelar</button>
                    <button class="btn-submit" style="width:48%;" onclick="Swal.fire('Sucesso', 'Dados atualizados!', 'success')">Salvar Alterações</button>
                </div>
            </div>

            <button onclick="localStorage.setItem('logado','false'); window.location.href='index.html';" style="width:100%; padding:15px; border:2px solid #e74c3c; background:white; color:#e74c3c; border-radius:12px; font-weight:bold; cursor:pointer; transition:0.3s;" onmouseover="this.style.background='#e74c3c';this.style.color='white'" onmouseout="this.style.background='white';this.style.color='#e74c3c'">
                <i class="fas fa-sign-out-alt"></i> Sair da Conta
            </button>
        </div>
    `;
}

// --- 3. PÁGINA DE CONFIGURAÇÕES (INTEGRADA) ---
function renderSettingsPage() {
    if (!pageContainer) return;
    
    // Prepara a tela
    hideWelcome(); 
    content.style.display = "none"; 
    pageContainer.style.display = "block";

    // Injeta o HTML (Baseado no seu código 'configurações')
    pageContainer.innerHTML = `
        <div class="page-content" style="padding: 0;">
            <h1 style="font-size: 28px; margin-bottom: 30px;">Configurações da sua conta</h1>

            <div class="config-sections">
                <section class="config-box personal-data">
                    <h2>Dados pessoais</h2>

                    <div class="form-group">
                        <label for="nome-completo">Nome completo</label>
                        <input type="text" id="nome-completo" placeholder="Digite seu nome de usuário...">
                    </div>
                    
                    <div class="profile-photo-area">
                        <h3>Foto de perfil</h3>
                        <input type="file" id="profile-photo-upload" accept="image/*" style="display: none;">
                        <label for="profile-photo-upload" class="upload-label-link">
                            <i class="fas fa-camera"></i> Alterar foto de perfil
                        </label>
                        
                        <div class="photo-controls">
                            <button class="btn btn-primary" id="save-photo-btn">Salvar Foto</button>
                            <div class="avatar-placeholder" id="avatar-placeholder">
                                <i class="fas fa-user"></i>
                            </div>
                        </div>
                    </div>

                    <div class="login-email" style="margin-top:20px; border-top:1px solid #eee; padding-top:10px;">
                        <p style="color:#666; font-size:14px;">Seu e-mail de login:</p>
                        <p class="email-address" style="font-weight:bold; color:#333;">usuario@exemplo.com</p>
                    </div>
                </section>

                <div class="security-and-appearance-column">
                    
                    <section class="config-box security-settings">
                        <h2>Segurança</h2>

                        <div class="password-change">
                            <div class="input-wrapper">
                                <input type="password" id="senha-atual" placeholder="Senha atual...">
                                <button class="toggle-password" data-target="senha-atual"><i class="fas fa-eye"></i></button>
                            </div>
                            <div class="input-wrapper">
                                <input type="password" id="nova-senha" placeholder="Nova senha...">
                                <button class="toggle-password" data-target="nova-senha"><i class="fas fa-eye"></i></button>
                            </div>
                            <button class="btn btn-primary btn-full-width" id="salvar-senha-btn">Atualizar Senha</button>
                        </div>

                        <div class="security-email" style="margin-top:20px;">
                            <p style="font-weight:600; margin-bottom:10px;">E-mail de segurança</p>
                            <div class="security-email-controls" style="display:flex; gap:10px;">
                                <input type="email" id="email-seguranca" placeholder="E-mail secundário..." style="margin-bottom:0;">
                                <button class="btn btn-primary" id="salvar-email-btn">Salvar</button>
                            </div>
                        </div>
                    </section>

                    <section class="config-box appearance-settings">
                        <h2>Preferências</h2>

                        <div class="toggle-control">
                            <p>Modo escuro</p>
                            <label class="switch">
                                <input type="checkbox" id="darkModeToggle">
                                <span class="slider round"></span>
                            </label>
                        </div>

                        <div class="toggle-control">
                            <p>Notificações</p>
                            <label class="switch">
                                <input type="checkbox" id="notificationsToggle">
                                <span class="slider round"></span>
                            </label>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    `;

    // Inicia a lógica do JS (Event Listeners e LocalStorage)
    initSettingsScript();
}

// --- FUNÇÃO AUXILIAR COM A LÓGICA DO SEU SCRIPT.JS ---
function initSettingsScript() {
    // Seleção de elementos
    const nomeInput = document.getElementById('nome-completo');
    const darkModeToggle = document.getElementById('darkModeToggle');
    const notificationsToggle = document.getElementById('notificationsToggle');
    const photoUpload = document.getElementById('profile-photo-upload');
    const avatar = document.getElementById('avatar-placeholder');
    const senhaAtualInput = document.getElementById('senha-atual');
    const novaSenhaInput = document.getElementById('nova-senha');
    const salvarSenhaBtn = document.getElementById('salvar-senha-btn');
    const emailSegurancaInput = document.getElementById('email-seguranca');
    const salvarEmailBtn = document.getElementById('salvar-email-btn');
    const savePhotoBtn = document.getElementById('save-photo-btn');
    const togglePasswordBtns = document.querySelectorAll('.toggle-password');

    // 1. CARREGAR DADOS DO LOCALSTORAGE
    const savedData = JSON.parse(localStorage.getItem('userConfig')) || {};

    if (savedData.nome && nomeInput) nomeInput.value = savedData.nome;
    
    if (savedData.darkMode !== undefined && darkModeToggle) {
        darkModeToggle.checked = savedData.darkMode;
        document.body.classList.toggle('dark-mode', savedData.darkMode);
    }

    if (savedData.notifications !== undefined && notificationsToggle) {
        notificationsToggle.checked = savedData.notifications;
    }

    if (savedData.photo && avatar) {
        avatar.style.backgroundImage = `url(${savedData.photo})`;
        avatar.innerHTML = "";
    }

    if (savedData.emailSeguranca && emailSegurancaInput) {
        emailSegurancaInput.value = savedData.emailSeguranca;
    }

    // Função interna para salvar tudo
    function saveData() {
        const existingData = JSON.parse(localStorage.getItem('userConfig')) || {};
        const data = {
            ...existingData,
            nome: nomeInput ? nomeInput.value : existingData.nome,
            darkMode: darkModeToggle ? darkModeToggle.checked : false,
            notifications: notificationsToggle ? notificationsToggle.checked : true,
            emailSeguranca: emailSegurancaInput ? emailSegurancaInput.value : existingData.emailSeguranca
        };
        localStorage.setItem('userConfig', JSON.stringify(data));
    }

    // 2. EVENTOS (Listeners)

    // Salvar Nome ao digitar
    if(nomeInput) {
        nomeInput.addEventListener('change', () => { // Mudei para change para não salvar a cada letra
            saveData();
            showToast('Nome atualizado!', 'success');
        });
    }

    // Modo Escuro
    if(darkModeToggle) {
        darkModeToggle.addEventListener('change', () => {
            document.body.classList.toggle('dark-mode', darkModeToggle.checked);
            saveData();
            showToast(darkModeToggle.checked ? 'Modo escuro ativado' : 'Modo claro ativado', 'success');
        });
    }

    // Notificações
    if(notificationsToggle) {
        notificationsToggle.addEventListener('change', () => {
            saveData();
            showToast(notificationsToggle.checked ? 'Notificações ativadas' : 'Notificações desativadas', 'success');
        });
    }

    // Upload de Foto
    if(photoUpload) {
        photoUpload.addEventListener('change', function() {
            const file = this.files[0];
            if (file) {
                if (file.size > 5 * 1024 * 1024) {
                    showToast('A imagem deve ter no máximo 5MB', 'error');
                    return;
                }
                const reader = new FileReader();
                reader.onload = function(e) {
                    if(avatar) {
                        avatar.style.backgroundImage = `url(${e.target.result})`;
                        avatar.innerHTML = "";
                    }
                    const data = JSON.parse(localStorage.getItem('userConfig')) || {};
                    data.photo = e.target.result;
                    localStorage.setItem('userConfig', JSON.stringify(data));
                    showToast('Foto selecionada. Clique em Salvar para confirmar.', 'success');
                };
                reader.readAsDataURL(file);
            }
        });
    }

    if(savePhotoBtn) {
        savePhotoBtn.addEventListener('click', () => {
            showToast('Foto salva com sucesso!', 'success');
        });
    }

    // Salvar Email Segurança
    if(salvarEmailBtn) {
        salvarEmailBtn.addEventListener('click', () => {
            const email = emailSegurancaInput.value.trim();
            if (!email || !validateEmail(email)) {
                showToast('E-mail inválido', 'error');
                return;
            }
            saveData();
            showToast('E-mail de segurança salvo!', 'success');
        });
    }

    // Salvar Senha
    if(salvarSenhaBtn) {
        salvarSenhaBtn.addEventListener('click', () => {
            const senhaAtual = senhaAtualInput.value;
            const novaSenha = novaSenhaInput.value;
            const data = JSON.parse(localStorage.getItem('userConfig')) || {};

            // Lógica simples de verificação (se houver senha salva anteriormente)
            if (data.senha && data.senha !== senhaAtual) {
                showToast('Senha atual incorreta!', 'error');
                return;
            }
            if (!novaSenha || novaSenha.length < 6) {
                showToast('A nova senha deve ter pelo menos 6 caracteres', 'error');
                return;
            }

            data.senha = novaSenha;
            localStorage.setItem('userConfig', JSON.stringify(data));
            
            senhaAtualInput.value = "";
            novaSenhaInput.value = "";
            showToast('Senha atualizada com sucesso!', 'success');
        });
    }

    // Mostrar/Ocultar Senha
    togglePasswordBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-target');
            const input = document.getElementById(targetId);
            const icon = btn.querySelector('i');
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    });
}

// --- FUNÇÕES UTILITÁRIAS GLOBAIS (TOAST E VALIDAÇÃO) ---

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function showToast(message, type = 'success') {
    const existingToast = document.querySelector('.toast');
    if (existingToast) existingToast.remove();

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `<i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i> <span>${message}</span>`;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'slideInToast 0.3s ease reverse'; // Efeito de saída (opcional, requer CSS ajustado)
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// --- 1. PÁGINA DE ARTIGOS (INTEGRADA COM LÓGICA) ---
function renderArticlesPage() {
    if (!pageContainer) return;
    hideWelcome(); 
    content.style.display = "none"; 
    pageContainer.style.display = "block";

    // 1. DADOS DOS ARTIGOS (Seu JSON)
    const allArticlesData = [
        { id: 998, title: "Algoritmos e Lógica de Programação", author: "Por Marco Souza", category: "Programação", popularity: 5, isFixed: true, isWide: false, bgColor: "#7e46ec" },
        { id: 999, title: "Inovação e tecnologia: aprendendo com países inovadores", author: "Por Taise Fátima Mattei", category: "Inovação", popularity: 4, isFixed: true, isWide: true, bgColor: "#a0d0e8" },
        { id: 1, title: "O uso da inteligência artificial como ferramenta para educação no Brasil", author: "Por Luiz André Ferreira", category: "IA", popularity: 4, isFixed: false, isWide: false, bgColor: "#ffcc80" },
        { id: 2, title: "Brazil Evolves Smart City Technology To Combat Climate Change", author: "Por Angelica Mari de Oliveira", category: "Tecnologia", popularity: 5, isFixed: false, isWide: false, bgColor: "#80cbc4" },
        { id: 3, title: "Desafios e Oportunidades no Ensino à Distância", author: "Por Ana Clara Guedes", category: "Educação", popularity: 3, isFixed: false, isWide: false, bgColor: "#e6ee9c" },
        { id: 4, title: "Segurança de Dados: O Novo Ouro Digital", author: "Por João Vitor Martins", category: "Segurança", popularity: 5, isFixed: false, isWide: false, bgColor: "#ffab91" },
        { id: 5, title: "O Impacto do 5G na Indústria 4.0", author: "Por Camila Ribeiro", category: "Tecnologia", popularity: 4, isFixed: false, isWide: false, bgColor: "#b39ddb" },
        { id: 6, title: "Liderança e Inovação na Era Digital", author: "Por Ricardo Almeida", category: "Carreira", popularity: 2, isFixed: false, isWide: false, bgColor: "#81d4fa" }
    ];

    const mostReadArticles = [
        { title: "A interferência da IA", author: "Por Paulo Isnard" },
        { title: "Inteligência artificial generativa e a desinformação no Brasil", author: "Por Pollyany Annenberg" },
        { title: "A segurança da informação para empresas no Brasil", author: "Por Kalleb Ribeiro Machado" }
    ];

    // 2. HTML DA PÁGINA
    pageContainer.innerHTML = `
        <section class="articles-section">
            <h1 class="main-title">Explore nossos artigos</h1>

            <div class="filter-bar">
                <div class="search-filter-box">
                    <input type="text" placeholder="Pesquisar nos artigos..." id="filter-search-input">
                    <i class="fas fa-search"></i>
                </div>
                <button class="filter-btn active" id="category-filter-btn">Categorias (A-Z)</button>
                <button class="filter-btn" id="popularity-filter-btn">Popularidade (Mais Pop)</button>
            </div>

            <div class="content-layout">
                <div class="article-cards-container" id="article-cards-container">
                    </div>

                <aside class="most-read-sidebar">
                    <h2 class="most-read-title">Mais lidos</h2>
                    <div id="most-read-container">
                        ${mostReadArticles.map(art => `
                            <div class="read-item">
                                <p class="read-title">${art.title}</p>
                                <p class="read-author">${art.author}</p>
                            </div>
                        `).join('')}
                    </div>
                </aside>
            </div>
        </section>
    `;

    // 3. LÓGICA DE RENDERIZAÇÃO E FILTROS
    let currentArticles = [...allArticlesData];
    let catOrder = 'ASC';
    let popOrder = 'DESC';

    const container = document.getElementById('article-cards-container');
    const searchInput = document.getElementById('filter-search-input');
    const btnCat = document.getElementById('category-filter-btn');
    const btnPop = document.getElementById('popularity-filter-btn');

    function renderCards(articles) {
        // Separa fixos e dinâmicos
        const fixed = articles.filter(a => a.isFixed);
        const dynamic = articles.filter(a => !a.isFixed);
        
        const generateHTML = (art) => {
            const initial = art.title.charAt(0).toUpperCase();
            let classes = 'article-card';
            let imgClasses = 'article-image-placeholder';
            if (art.isWide) { classes += ' wide-card'; imgClasses += ' wide-image'; }
            
            // Verifica se é destaque (Fixo mas não Wide)
            const isFeatured = art.isFixed && !art.isWide;

            return `
                <div class="${classes}">
                    <div class="${imgClasses}" style="background-color: ${art.bgColor};">
                        <span>${initial}</span>
                    </div>
                    <div class="article-info">
                        ${isFeatured ? '<span class="article-subtitle">Destaque</span>' : ''}
                        <span class="article-subtitle">${art.category}</span>
                        <h2 class="article-title">${art.title}</h2>
                        <p class="article-author">${art.author}</p>
                        <button class="read-more-btn" onclick="Swal.fire('Leitura', 'Abrindo: ${art.title}', 'info')">Ler Artigo</button>
                    </div>
                </div>
            `;
        };

        let html = '';
        // Renderiza Fixos Primeiro
        fixed.forEach(art => html += generateHTML(art));
        // Renderiza o resto
        dynamic.forEach(art => html += generateHTML(art));

        if(articles.length === 0) html = '<p style="grid-column: 1/-1; color:#666;">Nenhum artigo encontrado.</p>';
        
        container.innerHTML = html;
    }

    // Inicializa
    renderCards(currentArticles);

    // Eventos de Filtro
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            const filtered = allArticlesData.filter(a => 
                a.title.toLowerCase().includes(term) || 
                a.category.toLowerCase().includes(term) ||
                a.author.toLowerCase().includes(term)
            );
            currentArticles = filtered;
            renderCards(currentArticles);
        });
    }

    if (btnCat) {
        btnCat.addEventListener('click', () => {
            catOrder = catOrder === 'ASC' ? 'DESC' : 'ASC';
            btnCat.textContent = catOrder === 'ASC' ? 'Categorias (A-Z)' : 'Categorias (Z-A)';
            
            // Toggle classes active
            btnCat.classList.add('active');
            btnPop.classList.remove('active');

            currentArticles.sort((a, b) => {
                if(catOrder === 'ASC') return a.category.localeCompare(b.category);
                return b.category.localeCompare(a.category);
            });
            renderCards(currentArticles);
        });
    }

    if (btnPop) {
        btnPop.addEventListener('click', () => {
            popOrder = popOrder === 'DESC' ? 'ASC' : 'DESC';
            btnPop.textContent = popOrder === 'DESC' ? 'Popularidade (+)' : 'Popularidade (-)';

            btnPop.classList.add('active');
            btnCat.classList.remove('active');

            currentArticles.sort((a, b) => {
                if(popOrder === 'DESC') return b.popularity - a.popularity;
                return a.popularity - b.popularity;
            });
            renderCards(currentArticles);
        });
    }
}

// --- 2. PÁGINA DE PODCASTS (INTEGRADA) ---
function renderPodcastsPage() {
    if (!pageContainer) return;
    hideWelcome(); 
    content.style.display = "none"; 
    pageContainer.style.display = "block";

    // 1. DADOS DOS PODCASTS (JSON do usuário)
    const allPodcastsData = [
        { id: 1, title: "O Futuro da Inteligência Artificial", host: "Ana Paula Santos", duration: "45 min", category: "Tecnologia", description: "Uma discussão profunda sobre como a IA está transformando diversos setores.", bgColor: "#7e46ec", episodeNumber: 1 },
        { id: 2, title: "Carreira em Tech: Por Onde Começar", host: "Carlos Eduardo", duration: "38 min", category: "Carreira", description: "Dicas práticas para quem está iniciando na área de tecnologia.", bgColor: "#4a90e2", episodeNumber: 2 },
        { id: 3, title: "Cibersegurança para Iniciantes", host: "Mariana Costa", duration: "52 min", category: "Segurança", description: "Conceitos básicos de segurança digital que todos devem conhecer.", bgColor: "#ff6b6b", episodeNumber: 3 },
        { id: 4, title: "Cloud Computing Descomplicado", host: "Roberto Silva", duration: "41 min", category: "Infraestrutura", description: "Entenda de forma simples como funciona a computação em nuvem.", bgColor: "#80cbc4", episodeNumber: 4 },
        { id: 5, title: "Programação Web Moderna", host: "Juliana Mendes", duration: "55 min", category: "Desenvolvimento", description: "As principais tecnologias e frameworks usados no desenvolvimento web.", bgColor: "#ffcc80", episodeNumber: 5 },
        { id: 6, title: "Data Science na Prática", host: "Fernando Oliveira", duration: "48 min", category: "Dados", description: "Como empresas estão usando ciência de dados para tomar decisões.", bgColor: "#b39ddb", episodeNumber: 6 },
        { id: 7, title: "UX Design: A Arte de Criar Experiências", host: "Patricia Lima", duration: "35 min", category: "Design", description: "Princípios fundamentais para criar interfaces centradas no usuário.", bgColor: "#f48fb1", episodeNumber: 7 },
        { id: 8, title: "Metodologias Ágeis: Scrum e Kanban", host: "Diego Fernandes", duration: "42 min", category: "Gestão", description: "Como aplicar metodologias ágeis em projetos de tecnologia.", bgColor: "#a0d0e8", episodeNumber: 8 }
    ];

    // Variáveis de Estado
    let currentPodcasts = [...allPodcastsData];
    let playingPodcastId = localStorage.getItem('playingPodcast') ? parseInt(localStorage.getItem('playingPodcast')) : null;
    let selectedCategory = 'all';

    // 2. HTML DA PÁGINA
    pageContainer.innerHTML = `
        <section class="podcasts-section">
            <div class="section-header">
                <h1 class="main-title">Podcasts</h1>
                <p class="section-description">Ouça conversas com especialistas, entrevistas e histórias inspiradoras sobre tecnologia.</p>
            </div>

            <div class="filter-bar">
                <div class="search-filter-box">
                    <input type="text" placeholder="Buscar podcasts..." id="filter-search-input">
                    <i class="fas fa-search"></i>
                </div>
                
                <div class="category-filters" id="category-filters">
                    </div>
            </div>

            <div class="now-playing" id="now-playing" style="display: none;">
                <div class="now-playing-content">
                    <div class="now-playing-icon">
                        <i class="fas fa-play"></i> </div>
                    <div class="now-playing-info">
                        <p class="now-playing-title" id="now-playing-title">Título</p>
                        <p class="now-playing-host" id="now-playing-host">Host</p>
                    </div>
                </div>
                <button class="stop-btn" id="stop-btn">Parar</button>
            </div>

            <div class="podcast-cards-container" id="podcast-cards-container">
                </div>

            <div class="empty-state" id="empty-state" style="display: none;">
                <i class="fas fa-headphones"></i>
                <p>Nenhum podcast encontrado.</p>
            </div>
        </section>
    `;

    // 3. REFERÊNCIAS DO DOM
    const cardsContainer = document.getElementById('podcast-cards-container');
    const categoryContainer = document.getElementById('category-filters');
    const searchInput = document.getElementById('filter-search-input');
    const nowPlayingSection = document.getElementById('now-playing');
    const nowPlayingTitle = document.getElementById('now-playing-title');
    const nowPlayingHost = document.getElementById('now-playing-host');
    const stopBtn = document.getElementById('stop-btn');
    const emptyState = document.getElementById('empty-state');

    // 4. FUNÇÕES INTERNAS

    function renderCategoryButtons() {
        const categories = [...new Set(allPodcastsData.map(p => p.category))];
        let html = `<button class="category-btn active" data-category="all">Todos</button>`;
        categories.forEach(cat => {
            html += `<button class="category-btn" data-category="${cat}">${cat}</button>`;
        });
        categoryContainer.innerHTML = html;

        // Listeners dos botões
        categoryContainer.querySelectorAll('.category-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                // Remove active de todos e adiciona no atual
                categoryContainer.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');

                selectedCategory = e.target.dataset.category;
                filterAndRender();
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

        cardsContainer.innerHTML = podcasts.map(podcast => {
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
                        <button class="play-btn ${isPlaying ? 'playing' : ''}" onclick="window.togglePodcastPlay(${podcast.id})">
                            <i class="fas fa-${isPlaying ? 'volume-up' : 'play'}"></i>
                            ${isPlaying ? 'Ouvindo...' : 'Ouvir Agora'}
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }

    // Função de filtro principal
    function filterAndRender() {
        const term = searchInput.value.toLowerCase().trim();
        let filtered = [...allPodcastsData];

        if (selectedCategory !== 'all') {
            filtered = filtered.filter(p => p.category === selectedCategory);
        }

        if (term) {
            filtered = filtered.filter(p => 
                p.title.toLowerCase().includes(term) || 
                p.host.toLowerCase().includes(term) ||
                p.description.toLowerCase().includes(term)
            );
        }

        renderCards(filtered);
    }

    function updatePlayerUI() {
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

    // Expor função de Toggle para o escopo global (para o onclick do HTML funcionar)
    window.togglePodcastPlay = function(id) {
        if (playingPodcastId === id) {
            // Se já está tocando, para
            playingPodcastId = null;
            localStorage.removeItem('playingPodcast');
            showToast('Podcast pausado', 'info');
        } else {
            // Toca novo
            playingPodcastId = id;
            localStorage.setItem('playingPodcast', id.toString());
            const p = allPodcastsData.find(x => x.id === id);
            showToast(`Reproduzindo: ${p.title}`, 'success');
        }
        updatePlayerUI();
        renderCards(currentPodcasts); // Re-renderiza para atualizar botões
    };

    // 5. INICIALIZAÇÃO E EVENTOS
    renderCategoryButtons();
    renderCards(currentPodcasts);
    updatePlayerUI();

    searchInput.addEventListener('input', filterAndRender);

    stopBtn.addEventListener('click', () => {
        playingPodcastId = null;
        localStorage.removeItem('playingPodcast');
        updatePlayerUI();
        renderCards(currentPodcasts);
        showToast('Reprodução parada', 'info');
    });
}