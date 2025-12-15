document.addEventListener('DOMContentLoaded', () => {
    // Atenção: Certifique-se de que o seu JSON Server está rodando em http://localhost:3000
    const API_URL = 'http://localhost:3000/usuarios';
    
    // Referências para os formulários e links
    const loginForm = document.getElementById('loginForm');
    const cadastroForm = document.getElementById('cadastroForm'); 
    const linkCadastro = document.getElementById('linkCadastro');
    const linkLogin = document.getElementById('linkLogin'); 
    
    // Referências para as mensagens
    const msgErro = document.getElementById('mensagemErro');
    const msgSucesso = document.getElementById('mensagemSucesso');

    // ----------------------------------------------------
    // FUNÇÃO DE CADASTRO (POST)
    // ----------------------------------------------------
    function cadastrarNovoUsuario(novoUsuario) {
        if (!novoUsuario.login || !novoUsuario.senha || !novoUsuario.nome || !novoUsuario.email) {
            msgErro.textContent = 'Por favor, preencha todos os campos obrigatórios para o cadastro.';
            return;
        }

        msgErro.textContent = '';
        msgSucesso.textContent = 'Aguarde... Cadastrando novo usuário.';

        fetch(API_URL, {
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify(novoUsuario) 
        })
        .then(response => {
            if (response.status !== 201) { 
                throw new Error(`Erro ao cadastrar: ${response.status}`);
            }
            return response.json();
        })
        .then(usuarioCriado => {
            console.log('✅ Usuário criado com sucesso:', usuarioCriado);
            msgSucesso.textContent = `🎉 Usuário ${usuarioCriado.login} cadastrado com sucesso! Agora faça login.`;
            
            // Volta para a tela de login após o cadastro bem-sucedido
            if (loginForm && cadastroForm) {
                loginForm.style.display = 'block';
                cadastroForm.style.display = 'none';
            }
            if (cadastroForm) cadastroForm.reset(); 
        })
        .catch(error => {
            console.error('❌ Falha no cadastro:', error);
            msgErro.textContent = 'Erro ao cadastrar. Verifique o servidor JSON Server ou tente um login diferente.';
            msgSucesso.textContent = '';
        });
    }

    // ----------------------------------------------------
    // LÓGICA DE CADASTRO (Captura os dados do formulário)
    // ----------------------------------------------------
    if (cadastroForm) {
        cadastroForm.addEventListener('submit', function(e) {
            e.preventDefault(); 
            
            // LER OS DADOS DOS NOVOS CAMPOS DO FORMULÁRIO DE CADASTRO
            const login = document.getElementById('cadastroLogin').value;
            const senha = document.getElementById('cadastroSenha').value;
            const nome = document.getElementById('cadastroNome').value;
            const email = document.getElementById('cadastroEmail').value;
            
            const novoUsuario = {
                login: login,
                senha: senha,
                nome: nome,
                email: email
            };

            cadastrarNovoUsuario(novoUsuario);
        });
    }

    // ----------------------------------------------------
    // LÓGICA DE LOGIN (GET com filtro)
    // ----------------------------------------------------
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault(); 

            const login = document.getElementById('login').value;
            const senha = document.getElementById('senha').value;
            
            const urlFiltro = `${API_URL}?login=${login}&senha=${senha}`;

            msgErro.textContent = '';
            msgSucesso.textContent = 'Aguarde... Verificando credenciais.';

            fetch(urlFiltro)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Erro ao buscar dados: ${response.status}`);
                    }
                    return response.json(); 
                })
                .then(usuariosEncontrados => {
                    if (usuariosEncontrados.length > 0) {
                        const usuarioLogado = usuariosEncontrados[0];
                        
                        localStorage.setItem('logado', 'true');
                        localStorage.setItem('userLogin', usuarioLogado.login); 
                        localStorage.setItem('userName', usuarioLogado.nome);

                        msgSucesso.textContent = `🎉 Login bem-sucedido! Redirecionando...`;

                        setTimeout(() => {
                           // Corrija o caminho se seu 'index.html' não estiver em '../index.html'
                           window.location.href = '../index.html'; 
                        }, 500);
                        
                    } else {
                        msgErro.textContent = '🚫 Login ou senha incorretos. Tente novamente.';
                        msgSucesso.textContent = '';
                    }
                })
                .catch(error => {
                    console.error('❌ Erro na autenticação:', error);
                    msgErro.textContent = 'Ocorreu um erro ao tentar conectar ao servidor. Verifique o JSON Server.';
                    msgSucesso.textContent = '';
                });
        });
    }

    // ----------------------------------------------------
    // LÓGICA DE ALTERNÂNCIA ENTRE FORMULÁRIOS
    // ----------------------------------------------------
    if (linkCadastro && loginForm && cadastroForm) {
        linkCadastro.addEventListener('click', function(e) {
            e.preventDefault();
            // Alterna a exibição para o formulário de Cadastro
            loginForm.style.display = 'none';
            cadastroForm.style.display = 'block';
            msgErro.textContent = '';
            msgSucesso.textContent = '';
        });
    }

    if (linkLogin && loginForm && cadastroForm) {
        linkLogin.addEventListener('click', function(e) {
            e.preventDefault();
            cadastroForm.style.display = 'none';
            loginForm.style.display = 'block';
            msgErro.textContent = '';
            msgSucesso.textContent = '';
        });
    }
});