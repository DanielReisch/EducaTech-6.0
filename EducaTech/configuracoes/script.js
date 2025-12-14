
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
const hamburger = document.getElementById('hamburger');
const sidebar = document.querySelector('.sidebar');
const togglePasswordBtns = document.querySelectorAll('.toggle-password');


window.addEventListener('load', () => {
    const savedData = JSON.parse(localStorage.getItem('userConfig')) || {};

    
    if (savedData.nome) {
        nomeInput.value = savedData.nome;
    }

    
    if (savedData.darkMode !== undefined) {
        darkModeToggle.checked = savedData.darkMode;
        document.body.classList.toggle('dark-mode', savedData.darkMode);
    }

    
    if (savedData.notifications !== undefined) {
        notificationsToggle.checked = savedData.notifications;
    }

    if (savedData.photo) {
        avatar.style.backgroundImage = `url(${savedData.photo})`;
        avatar.innerHTML = "";
    }

    
    if (savedData.emailSeguranca) {
        emailSegurancaInput.value = savedData.emailSeguranca;
    }
});


function saveData() {
    const existingData = JSON.parse(localStorage.getItem('userConfig')) || {};

    const data = {
        nome: nomeInput.value,
        darkMode: darkModeToggle.checked,
        notifications: notificationsToggle.checked,
        photo: existingData.photo || null,
        senha: existingData.senha || null,
        emailSeguranca: emailSegurancaInput.value || existingData.emailSeguranca || ""
    };

    localStorage.setItem('userConfig', JSON.stringify(data));
}

nomeInput.addEventListener('input', () => {
    saveData();
    showToast('Nome atualizado!', 'success');
});


darkModeToggle.addEventListener('change', () => {
    document.body.classList.toggle('dark-mode', darkModeToggle.checked);
    saveData();
    showToast(darkModeToggle.checked ? 'Modo escuro ativado' : 'Modo claro ativado', 'success');
});


notificationsToggle.addEventListener('change', () => {
    saveData();
    showToast(notificationsToggle.checked ? 'Notificações ativadas' : 'Notificações desativadas', 'success');
});


photoUpload.addEventListener('change', function() {
    const file = this.files[0];
    if (file) {
        
        if (file.size > 5 * 1024 * 1024) {
            showToast('A imagem deve ter no máximo 5MB', 'error');
            return;
        }

        const reader = new FileReader();
        reader.onload = function(e) {
            avatar.style.backgroundImage = `url(${e.target.result})`;
            avatar.innerHTML = "";

            const data = JSON.parse(localStorage.getItem('userConfig')) || {};
            data.photo = e.target.result;
            localStorage.setItem('userConfig', JSON.stringify(data));
            
            showToast('Foto de perfil atualizada!', 'success');
        };
        reader.readAsDataURL(file);
    }
});


savePhotoBtn.addEventListener('click', () => {
    showToast('Foto salva com sucesso!', 'success');
});


salvarEmailBtn.addEventListener('click', () => {
    const email = emailSegurancaInput.value.trim();
    
    if (!email) {
        showToast('Digite um e-mail válido', 'error');
        return;
    }

    if (!validateEmail(email)) {
        showToast('E-mail inválido', 'error');
        return;
    }

    const data = JSON.parse(localStorage.getItem('userConfig')) || {};
    data.emailSeguranca = email;
    localStorage.setItem('userConfig', JSON.stringify(data));
    
    showToast('E-mail de segurança salvo!', 'success');
});


salvarSenhaBtn.addEventListener('click', () => {
    const senhaAtual = senhaAtualInput.value;
    const novaSenha = novaSenhaInput.value;
    const data = JSON.parse(localStorage.getItem('userConfig')) || {};

    
    if (data.senha && data.senha !== senhaAtual) {
        showToast('Senha atual incorreta!', 'error');
        return;
    }

    if (!novaSenha) {
        showToast('Digite uma nova senha', 'error');
        return;
    }

    if (novaSenha.length < 6) {
        showToast('A senha deve ter pelo menos 6 caracteres', 'error');
        return;
    }

    data.senha = novaSenha;
    localStorage.setItem('userConfig', JSON.stringify(data));

    senhaAtualInput.value = "";
    novaSenhaInput.value = "";

    showToast('Senha atualizada com sucesso!', 'success');
});


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


hamburger.addEventListener('click', () => {
    sidebar.classList.toggle('active');
});


document.addEventListener('click', (e) => {
    if (window.innerWidth <= 768) {
        if (!sidebar.contains(e.target) && !hamburger.contains(e.target)) {
            sidebar.classList.remove('active');
        }
    }
});



function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function showToast(message, type = 'success') {
    
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }

   
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

    document.body.appendChild(toast);

   
    setTimeout(() => {
        toast.style.animation = 'slideInToast 0.3s ease reverse';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}
