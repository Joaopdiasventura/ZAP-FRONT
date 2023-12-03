const container = document.getElementById('container');
const registerBtn = document.getElementById('register');
const loginBtn = document.getElementById('login');

registerBtn.addEventListener('click', () => {
    container.classList.add("active");
});

loginBtn.addEventListener('click', () => {
    container.classList.remove("active");
});

document.getElementById("logar").addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("emaill").value;
    const senha = document.getElementById("senhal").value;

    try {
        const response = await fetch('https://zap-sysa.onrender.com/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, senha })
        });

        if (response.ok) {
            const data = await response.json();

            localStorage.setItem('dadosUsuario', JSON.stringify(data));

            window.location.href = 'chat.html';
        } else {
            alert('Erro ao fazer login. Verifique suas credenciais.');
        }

    } catch (err) {
        alert('Erro:', err);
    }
});

document.getElementById("registrar").addEventListener("submit", async (event) => {
    event.preventDefault();
    
    let código;
    const email = document.getElementById("emailr").value;
    const nome = document.getElementById("nome").value;
    const senha = document.getElementById("senhar").value;
    const senha2 = document.getElementById("senha2").value;
    if (senha == senha2) {
        try {
            const response = await fetch(`https://zap-sysa.onrender.com/enviar/${email}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({})
            });
    
            const responseData = await response.json();
    
            código = prompt("Digite o código de verificação:");
    
            if (código == responseData.cod) {
                const response = await fetch('https://zap-sysa.onrender.com/adicionar/usuario', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ nome, email, senha, senha2 })
                }).then(response => response.json())

                console.log(response);


                alert("Código de verificação correto. Registrado com sucesso!");
                container.classList.remove("active");
            } else {
                alert("Código de verificação incorreto. Tente novamente.");
            }
        } catch (error) {
            console.error('Erro durante o registro:', error);
        }
    }
    else{
        alert("AS SENHAS ESTÃO DIFERENTES");
    }
    
});