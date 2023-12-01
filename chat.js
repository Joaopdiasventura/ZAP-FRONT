let dadosUsuario;
let amigo;
let conversa;
let adicionar = false;
let qnt = 0;

document.addEventListener("DOMContentLoaded", async () => {
  const dados = localStorage.getItem("dadosUsuario");

  dadosUsuario = JSON.parse(dados);
  console.log(dadosUsuario);

  if (
    dadosUsuario.message != "Essa conta não existe" &&
    dadosUsuario.message != "Senha incorreta"
  ) {
    await conversas();
  } else {
    alert(dadosUsuario.message);
    window.location.href = "./login.html";
  }
});

async function conversas() {
  try {
    const response = await fetch(
      `https://zap-sx1o.onrender.com/conversas/${dadosUsuario._id}`
    );
    var minhaDiv = document.getElementById("contacts");
    minhaDiv.innerHTML = "";

    if (!response.ok) {
      throw new Error(
        `Erro na requisição: ${response.status} - ${response.statusText}`
      );
    }

    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      throw new Error("Resposta do servidor não está em JSON.");
    }

    const dados = await response.json();
    console.log(dados);

    for (let i = 0; i < dados.length; i++) {
      let pessoa1 = await fetch(
        `https://zap-sx1o.onrender.com/pessoa1/${dados[i].pessoa1}`
      ).then((response) => response.json());
      let pessoa2 = await fetch(
        `https://zap-sx1o.onrender.com/pessoa2/${dados[i].pessoa2}`
      ).then((response) => response.json());

      let pessoas = pessoa1.concat(pessoa2);

      for (let j = 0; j < pessoas.length; j++) {
        if (pessoas[j]._id !== dadosUsuario._id) {
          criarElementoContato(pessoas[j], dados[i]);
        }
      }
    }
  } catch (error) {
    console.error("Erro ao obter conversas:", error);
  }
}

function criarElementoContato(pessoa, conversaData) {
  if (pessoa.nome != undefined) {
    var div = document.createElement("div");
    var nome = document.createElement("h2");
    var email = document.createElement("small");
    var minhaDiv = document.getElementById("contacts");

    div.addEventListener("click", () => {
      amigo = pessoa;
      conversa = conversaData._id;
      mensagens(conversa);
    });

    div.classList.add("contato");
    nome.innerHTML = `${pessoa.nome}`;
    email.innerHTML = `${pessoa.email}`;
    div.appendChild(nome);
    div.appendChild(email);
    minhaDiv.appendChild(div);
  }
}

setInterval(() => {
  mensagens(conversa);
}, 2000);

async function mensagens(conversa) {
  document.getElementById("amigo").innerHTML = amigo.nome;
  const dados = await fetch(
    `https://zap-sx1o.onrender.com/mensagens/${conversa}`
  ).then((response) => response.json());
  var minhaDiv = document.getElementById("conversation");
  minhaDiv.innerHTML = "";
  console.log(dados);

  for (let i = 0; i < dados.length; i++) {
    criarElementoMensagem(dados[i]);
  }

  focarUltimaMensagem();
}

function criarElementoMensagem(mensagem) {
  var div = document.createElement("div");
  var paragrafo = document.createElement("p");

  if (mensagem.remetente == dadosUsuario._id) {
    div.classList.add("usuario");
  } else {
    div.classList.add("amigo");
  }

  paragrafo.textContent = mensagem.conteudo;

  div.appendChild(paragrafo);
  document.getElementById("conversation").appendChild(div);
}

function focarUltimaMensagem() {
  let tamanho = document.getElementById("conversation").length();
  if (tamanho != qnt) {
    const ultima = document.getElementById("conversation").lastElementChild;
    if (ultima) {
      ultima.scrollIntoView({ behavior: "smooth", block: "end" });
    }
    qnt = tamanho;
  }
}

document.getElementById("enviar").addEventListener("submit", async (event) => {
  event.preventDefault();
  const conteudo = document.getElementById("conteudo").value;
  const response = await fetch(
    `https://zap-sx1o.onrender.com/adicionar/mensagem/${conversa}/${amigo._id}/${dadosUsuario._id}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ conteudo }),
    }
  );

  document.getElementById("conteudo").value = "";
  mensagens(conversa);
});

document
  .getElementById("adicionar")
  .addEventListener("submit", async (event) => {
    event.preventDefault();
    const email = document.getElementById("email").value;

    const response = await fetch(
      `https://zap-sx1o.onrender.com/email/${email}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(),
      }
    ).then((response) => response.json());

    console.log(response);

    if (response.message !== "Conta não encontrada") {
      const response2 = await fetch(
        `https://zap-sx1o.onrender.com/adicionar/conversa/${dadosUsuario._id}/${response._id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(),
        }
      ).then((response) => response.json());

      conversas();
    } else {
      alert("Essa conta não está cadastrada");
    }
  });

function mostrar() {
  const addDiv = document.getElementById("add");
  const iaddElement = document.getElementById("iadd");

  if (addDiv.style.display !== "flex") {
    addDiv.style.display = "flex";
    iaddElement.innerHTML = "FECHAR";
  } else {
    addDiv.style.display = "none";
    iaddElement.innerHTML = "ADICIONAR CONTATO";
  }
}

function sair() {
  localStorage.clear();
  window.location.href = "./login.html";
}
