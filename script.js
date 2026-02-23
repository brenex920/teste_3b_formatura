function copiarPix(){
    navigator.clipboard.writeText("44301371885");
    alert("Chave Pix copiada!");
}


// pagina galeria 


const LIMITE_MB = 5;

function enviarFoto(){
  const file = document.getElementById("fotoInput").files[0];
  const nome = document.getElementById("nomeInput").value;

  if(!file || !nome){
    alert("Selecione foto e nome");
    return;
  }

  if(file.size > LIMITE_MB*1024*1024){
    alert("Foto muito grande (máx 5MB)");
    return;
  }

  const reader = new FileReader();

  reader.onload = e=>{
    const fotos = JSON.parse(localStorage.getItem("galeria3b")||"[]");

    fotos.push({
      img:e.target.result,
      nome:nome,
      likes:0,
      aprovado:false,
      id:Date.now()
    });

    localStorage.setItem("galeria3b",JSON.stringify(fotos));
    carregarGaleria();
  };

  reader.readAsDataURL(file);
}

function carregarGaleria(ordem="recentes"){
  const grid = document.getElementById("gridGaleria");
  let fotos = JSON.parse(localStorage.getItem("galeria3b")||"[]");

  // MODERAÇÃO: só aprovadas
  fotos = fotos.filter(f=>f.aprovado);

  if(ordem==="likes"){
    fotos.sort((a,b)=>b.likes-a.likes);
  }

  grid.innerHTML="";

  fotos.forEach(f=>{
    const card = document.createElement("div");
    card.className="foto-card";

    card.innerHTML=`
      <img src="${f.img}">
      <div class="foto-nome">${f.nome}</div>
      <div class="foto-acoes">
        <button class="like-btn" onclick="curtir(${f.id})">❤️ ${f.likes}</button>
        <button class="del-btn" onclick="deletar(${f.id})">🗑</button>
      </div>
    `;

    grid.appendChild(card);
  });
}

function curtir(id){
  const fotos = JSON.parse(localStorage.getItem("galeria3b"));
  const f = fotos.find(x=>x.id===id);
  f.likes++;
  localStorage.setItem("galeria3b",JSON.stringify(fotos));
  carregarGaleria();
}

function deletar(id){
  let fotos = JSON.parse(localStorage.getItem("galeria3b"));
  fotos = fotos.filter(f=>f.id!==id);
  localStorage.setItem("galeria3b",JSON.stringify(fotos));
  carregarGaleria();
}

/* MODERAÇÃO */
function aprovarUltima(){
  const fotos = JSON.parse(localStorage.getItem("galeria3b")||"[]");
  const pendente = fotos.find(f=>!f.aprovado);
  if(pendente){
    pendente.aprovado=true;
    localStorage.setItem("galeria3b",JSON.stringify(fotos));
    carregarGaleria();
  }else{
    alert("Nenhuma pendente");
  }
}

/* ORDEM */
function ordenarLikes(){
  carregarGaleria("likes");
}

window.onload=carregarGaleria;