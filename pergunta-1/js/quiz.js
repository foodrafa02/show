/* ---------- variáveis de DOM ---------- */
const opts   = document.querySelectorAll('.opt');      // botões de resposta
const imgHost= document.getElementById('host');        // foto do apresentador
const okMsg  = document.getElementById('msg-ok');      // “certa resposta”
const noMsg  = document.getElementById('msg-no');      // “errou”
const nextBtn= document.getElementById('next');        // botão desktop
const nextBtnMobile = document.getElementById('next-mobile'); // botão mobile
const barra  = document.getElementById('barra-cont');  // barra fixa de continuar
const saldoEl= document.getElementById('saldoxx');     // saldo no topo
const pararEl= document.getElementById('pararxx');     // saldo “parar”

/* ---------- config ---------- */
const premioPergunta = 50.84;   // valor desta pergunta

// imagens do apresentador (agora .png)
const faces = {
  serio : 'images/host-serio.png',
  feliz : 'images/host-feliz.png',
  triste: 'images/host-triste.png'
};

// sons
const aud = {
  sel : document.getElementById('sfx-select'),  // “posso perguntar?”
  ok  : document.getElementById('sfx-correct'), // “certa resposta!”
  no  : document.getElementById('sfx-wrong'),   // “que pena…”
  coin: document.getElementById('sfx-coins'),   // moedas
  next: document.getElementById('sfx-next')     // vinheta próxima pergunta
};

/* ---------- placar (localStorage) ---------- */
function carregarSaldo(){
  const valor = parseFloat(localStorage.getItem('valor') || '0');
  saldoEl.textContent = `R$ ${valor.toFixed(2)}`;
  pararEl.textContent = `R$ ${valor.toFixed(2)}`;
  return valor;
}

function salvarSaldo(novo){
  localStorage.setItem('valor', novo.toFixed(2));
  carregarSaldo();
}

let saldoAtual = carregarSaldo();

/* ---------- lógica de seleção ---------- */
let selecionado = null;

opts.forEach(btn=>{
  btn.addEventListener('click', ()=>{
    // 1º clique = marcar
    if(!btn.classList.contains('ativo')){
      opts.forEach(o=>o.classList.remove('ativo','inativo'));
      opts.forEach(o=>o.classList.add('inativo'));
      btn.classList.add('ativo');
      btn.classList.remove('inativo');
      imgHost.src = faces.serio;
      aud.sel.play();
      selecionado = btn;
      return;
    }
    // 2º clique = confirmar
    avaliar(btn);
  });
});

/* ---------- avaliar ---------- */
function avaliar(btn){
  const acerto = btn.dataset.correct === 'true';

  // desliga cliques
  opts.forEach(o=>o.disabled = true);

  if(acerto){
    btn.classList.add('correta');
    okMsg.style.display = 'block';
    imgHost.src = faces.feliz;
    aud.ok.play();
    aud.coin.play();

    saldoAtual += premioPergunta;
    salvarSaldo(saldoAtual);

    // confetes
    confetti({ particleCount: 120, spread: 80, origin:{y:0.6} });

    mostrarContinuar();
  }else{
    btn.classList.add('errada');
    noMsg.style.display = 'block';
    imgHost.src = faces.triste;
    aud.no.play();

    // recarrega em 2 s
    setTimeout(()=>location.reload(), 2000);
  }
}

/* ---------- continuar ---------- */
function mostrarContinuar(){
  nextBtn.style.display = 'inline-block';
  barra.style.display   = 'block';
}

function irProxima(){
  aud.next.play();
  setTimeout(()=>location.href='/pergunta-2', 2000);
}

nextBtn.addEventListener('click', irProxima);
nextBtnMobile.addEventListener('click', irProxima);
