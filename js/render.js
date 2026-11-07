import { gameDifficulty } from "./state.js";

export function renderMenu(menuscreen, leaderboardData = []) {
  const optionsHtml = gameDifficulty.difficulties
    .map((d) => `<option value="${d.value}">${d.label}</option>`)
    .join("");

  const diffSelect = menuscreen.querySelector("#diffSelect");
  if (diffSelect) diffSelect.innerHTML = optionsHtml;

  //leaderboard
  const lbContainer = menuscreen.querySelector("#leaderboard-container");
  if (lbContainer) {
    if (leaderboardData.length === 0) {
      lbContainer.innerHTML = "<p>Még nincs rögzített eredmény.</p>";
    } else {
      const rows = leaderboardData
        .map(
          (entry) => `
        <tr>
          <td>${entry.name}</td>
          <td>${entry.level}</td>
          <td>${entry.time}</td>
          <td>${entry.fails} hiba</td>
          <td>${entry.date}</td>
        </tr>
      `,
        )
        .join("");
      lbContainer.innerHTML = `
        <table class="leaderboard-table">
          <thead>
            <tr><th>Név</th><th>Pálya</th><th>Idő</th><th>Hiba</th><th>Dátum</th></tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      `;
    }
  }
}

export function renderHUD(gameScreen, model) {
  const infoContainer = gameScreen.querySelector("#info-container");
  if (!infoContainer) return;

  const minutes = String(Math.floor(model.elapsedTime / 60)).padStart(2, "0");
  const seconds = String(Math.floor(model.elapsedTime % 60)).padStart(2, "0");
  const totalTrains = model.levelConfig ? model.levelConfig.schedule.length : 0;

  infoContainer.innerHTML = `
    <div class="hud-item">
      <span class="hud-label">Játékos</span>
      <span class="hud-value">${model.playerName}</span>
    </div>
    <div class="hud-item">
      <span class="hud-label">Pálya</span>
      <span class="hud-value">${model.levelConfig ? model.levelConfig.name : ""}</span>
    </div>
    <div class="hud-item">
      <span class="hud-label">Idő</span>
      <span class="hud-value">${minutes}:${seconds}</span>
    </div>
    <div class="hud-item">
      <span class="hud-label">Célba ért</span>
      <span class="hud-value">${model.successCount} / ${totalTrains}</span>
    </div>
    <div class="hud-item">
      <span class="hud-label">Hiba</span>
      <span class="hud-value" style="color: ${model.failCount > 0 ? "#ef4444" : "#fff"}">${model.failCount}</span>
    </div>
  `;
}

export function renderCanvas(ctx, model) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  if (!model.levelConfig) return;

  const { nodes, paths, exits } = model.levelConfig;

  //pathek (vágányok) rajzolása
  paths.forEach((path) => {
    const fn = nodes[path.from];
    const tn = nodes[path.to];

    ctx.save();
    ctx.beginPath();
    ctx.lineWidth = 6;
    ctx.strokeStyle = "#2e3352";
    ctx.moveTo(fn.x, fn.y);
    ctx.lineTo(tn.x, tn.y);
    ctx.stroke();

    ctx.lineWidth = 2;
    ctx.strokeStyle = "#7c81ab";
    ctx.stroke();
    ctx.restore();
  });

  //exit rajzolása
  exits.forEach((exit) => {
    const node = nodes[exit.node];
    ctx.save();
    ctx.fillStyle = exit.color;
    ctx.fillRect(node.x - 5, node.y - 25, 20, 50);
    ctx.fillStyle = "#fff";
    ctx.font = "bold 12px Segoe UI";
    ctx.fillText(exit.label, node.x - 80, node.y + 4);
    ctx.restore();
  });

  //valtok rajzolása
  model.switches.forEach((sw) => {
    const node = nodes[sw.node];
    ctx.save();
    ctx.beginPath();
    ctx.arc(node.x, node.y, 16, 0, Math.PI * 2);
    ctx.fillStyle = "#0d0d14";
    ctx.strokeStyle = "#38bdf8";
    ctx.lineWidth = 2;
    ctx.fill();
    ctx.stroke();

    const activePathId = sw.outPaths[sw.activeIndex];
    const activePath = paths.find((e) => e.id === activePathId);
    if (activePath) {
      const targetNode = nodes[activePath.to];
      const angle = Math.atan2(targetNode.y - node.y, targetNode.x - node.x);
      ctx.beginPath();
      ctx.strokeStyle = "#38bdf8";
      ctx.lineWidth = 3;
      ctx.moveTo(node.x, node.y);
      ctx.lineTo(node.x + Math.cos(angle) * 12, node.y + Math.sin(angle) * 12);
      ctx.stroke();
    }
    ctx.restore();
  });

  //lámpák rajzolása
  model.lamps.forEach((lamp) => {
    const path = paths.find((e) => e.id === lamp.path);
    const fn = nodes[path.from];
    const tn = nodes[path.to];
    const lx = fn.x + (tn.x - fn.x) * lamp.posRatio;
    const ly = fn.y + (tn.y - fn.y) * lamp.posRatio;

    ctx.save();
    ctx.fillStyle = "#1e293b";
    ctx.fillRect(lx - 8, ly - 20, 16, 26);
    ctx.strokeStyle = "#475569";
    ctx.strokeRect(lx - 8, ly - 20, 16, 26);

    ctx.beginPath();
    ctx.arc(lx, ly - 7, 5, 0, Math.PI * 2);
    ctx.fillStyle = lamp.state === "GREEN" ? "#22c55e" : "#ef4444";
    ctx.shadowColor = lamp.state === "GREEN" ? "#22c55e" : "#ef4444";
    ctx.shadowBlur = 10;
    ctx.fill();
    ctx.restore();
  });

  //vonatok
  model.trains.forEach((train) => {
    ctx.save();

    if (model.activeWarningTrainIds.has(train.id)) {
      ctx.beginPath();
      ctx.arc(train.x, train.y, 30, 0, Math.PI * 2);
      ctx.strokeStyle = "#eab308";
      ctx.lineWidth = 3;
      ctx.setLineDash([6, 6]);
      ctx.stroke();
    }

    ctx.beginPath();
    ctx.arc(train.x, train.y, 14, 0, Math.PI * 2);
    ctx.fillStyle = train.color;
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#ffffff";
    ctx.stroke();

    if (train.isBraked) {
      ctx.fillStyle = "#ef4444";
      ctx.font = "bold 11px Segoe UI";
      ctx.fillText("FÉK", train.x - 10, train.y - 18);
    } else if (train.isWaitingAtRed) {
      ctx.fillStyle = "#eab308";
      ctx.font = "bold 11px Segoe UI";
      ctx.fillText("TILOS", train.x - 14, train.y - 18);
    }

    ctx.restore();
  });
}
