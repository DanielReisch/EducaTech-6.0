document.addEventListener('DOMContentLoaded', () => {
    // Atenção: Certifique-se de que o seu JSON Server está rodando em http://localhost:3000
    const API_URL = 'http://localhost:3000/usuarios';
    const loginForm = document.getElementById('loginForm');
    const linkCadastro = document.getElementById('linkCadastro');
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
            msgSucesso.textContent = `🎉 Usuário ${usuarioCriado.login} cadastrado com sucesso! ID: ${usuarioCriado.id}`;
        })
        .catch(error => {
            console.error('❌ Falha no cadastro:', error);
            msgErro.textContent = 'Erro ao cadastrar. Verifique o servidor JSON Server.';
            msgSucesso.textContent = '';
        });
    }

    // ----------------------------------------------------
    // LÓGICA DE LOGIN (GET COM FILTRO) - CORRIGIDA
    // ----------------------------------------------------
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault(); 

            const login = document.getElementById('login').value;
            const senha = document.getElementById('senha').value;
            
            // ATENÇÃO: A URL de filtro expõe a senha, mas é padrão para JSON Server GET.
            const urlFiltro = `${API_URL}?login=${login}&senha=${senha}`;

            // Limpar mensagens anteriores
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
                        
                        // 🔑 CORREÇÃO CRÍTICA: DEFINIR O ESTADO DE LOGIN NO LOCAL STORAGE
                        localStorage.setItem('logado', 'true');
                        // 💡 Opcional: Salvar o login do usuário para exibir na página principal
                        // localStorage.setItem('userLogin', usuarioLogado.login); 

                        // 3. Exibir sucesso (brevemente) e redirecionar
                        msgSucesso.textContent = `🎉 Login bem-sucedido! Redirecionando...`;
                        console.log('Usuário autenticado:', usuarioLogado);

                        // 🌟 CORREÇÃO NO REDIRECIONAMENTO (usando '../index.html' se o login.js estiver em 'assets/scripts/')
                        // Se seu index.html estiver no mesmo nível do login.html, use 'index.html'
                        // Como seu login.js está em assets/scripts/, use '../index.html' para subir um nível
                        setTimeout(() => {
                           window.location.href = '../index.html'; 
                        }, 500); // Pequeno atraso para o usuário ver a mensagem
                        

                    } else {
                        msgErro.textContent = '🚫 Login ou senha incorretos. Tente novamente.';
                        msgSucesso.textContent = '';
                        console.log('Tentativa de login falhou.');
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
    // SIMULAÇÃO DE CLIQUE NO LINK 'CRIE UMA CONTA' PARA TESTE
    // ----------------------------------------------------
    if (linkCadastro) {
        linkCadastro.addEventListener('click', function(e) {
            e.preventDefault();
            
            const timestamp = new Date().getTime(); 
            const loginTeste = `aluno${timestamp}`;

            const novoUsuarioParaTeste = {
                login: loginTeste,
                senha: "123",
                nome: "Novo Aluno Teste",
                email: `${loginTeste}@edutech.com`
            };

            cadastrarNovoUsuario(novoUsuarioParaTeste);
        });
    }
});