async function carregarDados() {
  const data = document.getElementById('data-selecionada').value;
  if (!data) return;

  const vRes = await fetch('/api/visitantes?data=' + data);
  const visitantes = await vRes.json();
  document.getElementById('visitantes-list').innerHTML = visitantes.map(v =>
    `<li>${v.nome} (${v.turno}) <button onclick="excluirVisitante(${v.id})">Excluir</button></li>`
  ).join('');

  const aRes = await fetch('/api/acompanhantes?data=' + data);
  const acompanhantes = await aRes.json();
  document.getElementById('acompanhantes-list').innerHTML = acompanhantes.map(a =>
    `<li>${a.nome} (${a.turno}) <button onclick="excluirAcompanhante(${a.id})">Excluir</button></li>`
  ).join('');
}

async function addVisitante() {
  const nomeInput = document.getElementById('novo-visitante');
  const nome = nomeInput.value;
  const data = document.getElementById('data-selecionada').value;
  if (!nome || !data) return alert("Preencha o nome e selecione a data.");

  const turno = document.getElementById('turno-visitante').value;
  const res = await fetch('/api/visitantes', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ nome, data, turno })
  });
  if (res.ok) {
    nomeInput.value = '';
    carregarDados();
  } else alert("Limite de visitantes atingido.");
}

async function excluirVisitante(id) {
  await fetch('/api/visitantes/' + id, { method: 'DELETE' });
  carregarDados();
}

async function addAcompanhante() {
  const nomeInput = document.getElementById('novo-acompanhante');
  const nome = nomeInput.value;
  const data = document.getElementById('data-selecionada').value;
  const turno = document.getElementById('turno').value;
  if (!nome || !data) return alert("Preencha o nome e selecione a data.");

  const res = await fetch('/api/acompanhantes', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ nome, data, turno })
  });
  if (res.ok) {
    nomeInput.value = '';
    carregarDados();
  } else alert("Já existe acompanhante para esse turno.");
}

async function excluirAcompanhante(id) {
  await fetch('/api/acompanhantes/' + id, { method: 'DELETE' });
  carregarDados();
}

document.getElementById('data-selecionada').addEventListener('change', carregarDados);