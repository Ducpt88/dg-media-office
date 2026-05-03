// ═══════════════════════════════════════════════════════════
// DG MEDIA HOLDING — Office Character System (Web Version)
// Standalone Canvas chibi characters — no React/Electron needed
// ═══════════════════════════════════════════════════════════

const CHAR_SCALE = 1.3;
const CEO_SCALE = 1.8;
const DESIGN_W = 1100;
const DESIGN_H = 620;

const DEFAULT_CHARACTERS = [
  { id:'ceo', name:'Đức (CEO)', role:'CEO', gender:'M', hair:'#1a1a2e', skin:'#f5d0a9', shirt:'#ffffff', pants:'#1a1a2e', accent:'#ffd700', deskX:550, deskY:155, deskFace:'down', hasDesk:true },
  { id:'dev1', name:'Minh (Dev)', role:'Developer', gender:'M', hair:'#2c2c54', skin:'#f0c8a0', shirt:'#636e72', pants:'#2d3436', accent:'#00b894', deskX:315, deskY:335, deskFace:'right', hasDesk:true },
  { id:'dev2', name:'Tùng (Dev)', role:'Developer', gender:'M', hair:'#4a2800', skin:'#e8b88a', shirt:'#0984e3', pants:'#2d3436', accent:'#74b9ff', deskX:420, deskY:335, deskFace:'left', hasDesk:true },
  { id:'dev3', name:'Khoa (Dev)', role:'Developer', gender:'M', hair:'#0c0c0c', skin:'#e8b88a', shirt:'#55efc4', pants:'#2d3436', accent:'#55efc4', deskX:680, deskY:335, deskFace:'right', hasDesk:true },
  { id:'dev4', name:'Phong (Dev)', role:'Developer', gender:'M', hair:'#2c3e50', skin:'#f0c8a0', shirt:'#a29bfe', pants:'#2d3436', accent:'#a29bfe', deskX:785, deskY:335, deskFace:'left', hasDesk:true },
  { id:'pm1', name:'Linh (PM)', role:'Project Manager', gender:'F', hair:'#3d1c00', skin:'#fce4c4', shirt:'#e17055', pants:'#2d3436', accent:'#e17055', deskX:315, deskY:480, deskFace:'right', hasDesk:true },
  { id:'design1', name:'Ngân (Design)', role:'Designer', gender:'F', hair:'#6c3483', skin:'#fce4c4', shirt:'#fd79a8', pants:'#dfe6e9', accent:'#a29bfe', deskX:420, deskY:480, deskFace:'left', hasDesk:true },
  { id:'mkt1', name:'Thảo (MKT)', role:'Marketing', gender:'F', hair:'#6b4226', skin:'#fce4c4', shirt:'#ff7675', pants:'#b2bec3', accent:'#ff7675', deskX:680, deskY:480, deskFace:'right', hasDesk:true },
  { id:'acc1', name:'Vy (Kế toán)', role:'Accountant', gender:'F', hair:'#1a1a2e', skin:'#fce4c4', shirt:'#ffeaa7', pants:'#636e72', accent:'#fdcb6e', deskX:785, deskY:480, deskFace:'left', hasDesk:true },
  { id:'test1', name:'Hùng (QA)', role:'Tester', gender:'M', hair:'#1e272e', skin:'#f0c8a0', shirt:'#00cec9', pants:'#636e72', accent:'#00cec9', deskX:100, deskY:350, deskFace:'right', hasDesk:false },
  { id:'hr1', name:'Mai (HR)', role:'HR', gender:'F', hair:'#2c1810', skin:'#fce4c4', shirt:'#fab1a0', pants:'#2d3436', accent:'#fdcb6e', deskX:140, deskY:400, deskFace:'right', hasDesk:false },
  { id:'intern1', name:'Quân (Intern)', role:'Intern', gender:'M', hair:'#34495e', skin:'#f0c8a0', shirt:'#dfe6e9', pants:'#636e72', accent:'#b2bec3', deskX:110, deskY:455, deskFace:'right', hasDesk:false },
  { id:'yt1', name:'Tuấn', role:'YT Quản lý', team:'YouTube', gender:'M', hair:'#1a1a2e', skin:'#f0c8a0', shirt:'#ffffff', pants:'#2d3436', accent:'#ff0000', deskX:980, deskY:310, deskFace:'left', hasDesk:false },
  { id:'yt2', name:'N Linh', role:'YT Content', team:'YouTube', gender:'F', hair:'#4a2800', skin:'#fce4c4', shirt:'#ffffff', pants:'#636e72', accent:'#ff0000', deskX:1020, deskY:365, deskFace:'left', hasDesk:false },
  { id:'yt3', name:'Thủy', role:'YT Design', team:'YouTube', gender:'F', hair:'#2c1810', skin:'#fce4c4', shirt:'#ffffff', pants:'#dfe6e9', accent:'#ff0000', deskX:970, deskY:420, deskFace:'left', hasDesk:false },
  { id:'yt4', name:'Cường (YT)', role:'YT Editor', team:'YouTube', gender:'M', hair:'#0c0c0c', skin:'#e8b88a', shirt:'#ffffff', pants:'#2d3436', accent:'#ff0000', deskX:1020, deskY:470, deskFace:'left', hasDesk:false },
  { id:'ytc_duc', name:'Hoàng Đức', role:'Leader', team:'YouTube Content', gender:'M', hair:'#1a1a2e', skin:'#f0c8a0', shirt:'#1a1a1a', pants:'#2d3436', accent:'#ff0000', deskX:500, deskY:570, deskFace:'right', hasDesk:false },
  { id:'ytc_cuong', name:'Hoàng Cường', role:'Editor', team:'YouTube Content', gender:'M', hair:'#3d1c00', skin:'#e8b88a', shirt:'#1a1a1a', pants:'#2d3436', accent:'#ff0000', deskX:570, deskY:570, deskFace:'left', hasDesk:false },
  { id:'ytc_truong', name:'Trường', role:'Media', team:'YouTube Content', gender:'M', hair:'#0c0c0c', skin:'#f5d0a9', shirt:'#1a1a1a', pants:'#636e72', accent:'#ff0000', deskX:640, deskY:570, deskFace:'left', hasDesk:false },
];

const STATES = { idle:'idle', walk:'walk', sit:'sit', typing:'typing', talking:'talking', drinking:'drinking', pointing:'pointing', sleeping:'sleeping', walkToRest:'walkToRest' };

function initCharacters(dims) {
  const sx = dims ? dims.w / DESIGN_W : 1;
  const sy = dims ? dims.h / DESIGN_H : 1;
  return DEFAULT_CHARACTERS.map((c, i) => ({
    ...c,
    _designDeskX: c.deskX, _designDeskY: c.deskY,
    deskX: c.deskX * sx, deskY: c.deskY * sy,
    x: c.deskX * sx, y: c.deskY * sy,
    tx: c.deskX * sx, ty: c.deskY * sy,
    state: c.hasDesk !== false ? STATES.sit : STATES.idle,
    stateTimer: Math.random() * 200,
    walkPhase: Math.random() * Math.PI * 2,
    facingRight: c.deskFace === 'right' || c.deskFace === 'down',
    scale: c.role === 'CEO' ? CEO_SCALE : CHAR_SCALE,
    typingPhase: Math.random() * Math.PI * 2,
    idleAction: ['typing','typing','typing','idle','drinking','pointing'][i % 6],
  }));
}

function rescaleCharacters(chars, dims) {
  if (!dims || !dims.w || !dims.h) return;
  const sx = dims.w / DESIGN_W, sy = dims.h / DESIGN_H;
  chars.forEach(c => {
    const origDX = c._designDeskX ?? c.deskX;
    const origDY = c._designDeskY ?? c.deskY;
    c.deskX = origDX * sx; c.deskY = origDY * sy;
    if (c.state !== 'walk' && c.state !== 'walkToRest') {
      c.x = c.deskX; c.y = c.deskY; c.tx = c.deskX; c.ty = c.deskY;
    }
  });
}

function updateCharacters(chars, dims) {
  const speed = 3.5;
  chars.forEach(c => {
    c.stateTimer += 1;
    c.walkPhase += 0.12;
    c.typingPhase += 0.08;
    switch (c.state) {
      case STATES.sit: case STATES.typing: case STATES.drinking: case STATES.pointing: {
        if (c.hasDesk === false) { c.state = STATES.idle; c.stateTimer = 0; break; }
        c.x += (c.deskX - c.x) * 0.12; c.y += (c.deskY - c.y) * 0.12;
        if (c.deskFace === 'right') c.facingRight = true;
        else if (c.deskFace === 'left') c.facingRight = false;
        if (c.stateTimer > 180 + Math.random() * 120) {
          const isCEO = c.role === 'CEO';
          const r = Math.random();
          if (r < (isCEO ? 0.45 : 0.2)) {
            c.state = STATES.walk;
            if (isCEO) { c.tx = 60 + Math.random() * Math.min(dims.w - 120, 1200); c.ty = 100 + Math.random() * Math.min(dims.h - 150, 600); }
            else { c.tx = c.deskX + (Math.random() - 0.5) * 150; c.ty = c.deskY + (Math.random() - 0.5) * 100; }
            c.stateTimer = 0;
          } else if (r < 0.55) { c.state = STATES.typing; c.stateTimer = 0; }
          else if (r < 0.75) { c.state = STATES.drinking; c.stateTimer = 0; }
          else { c.state = STATES.idle; c.stateTimer = 0; }
        }
        break;
      }
      case STATES.idle: {
        c.x += (c.deskX - c.x) * 0.08; c.y += (c.deskY - c.y) * 0.08;
        if (c.hasDesk === false) {
          if (c.stateTimer > 100 + Math.random() * 80) {
            const r = Math.random();
            if (r < 0.35) {
              const nearby = chars.find(o => o !== c && o.hasDesk === false && Math.abs(o.deskX - c.deskX) < 200 && Math.abs(o.deskY - c.deskY) < 200);
              if (nearby) { c.state = STATES.talking; c.facingRight = nearby.x > c.x; c.stateTimer = 0; }
            } else if (r < 0.55) {
              c.state = STATES.walk; c.tx = c.deskX + (Math.random()-0.5)*80; c.ty = c.deskY + (Math.random()-0.5)*60; c.stateTimer = 0;
            } else { c.stateTimer = 0; }
          }
        } else {
          if (c.stateTimer > 60 + Math.random() * 40) { c.state = STATES.sit; c.stateTimer = 0; }
        }
        break;
      }
      case STATES.walk: {
        const dx = c.tx - c.x, dy = c.ty - c.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 6) {
          if (c.hasDesk !== false) { c.state = STATES.sit; c.tx = c.deskX; c.ty = c.deskY; c.stateTimer = 0; }
          else { c.state = STATES.idle; c.stateTimer = 0; }
        } else {
          c.x += (dx / dist) * speed; c.y += (dy / dist) * speed;
          c.facingRight = dx > 0;
        }
        break;
      }
      case STATES.talking: {
        if (c.stateTimer > 100 + Math.random() * 60) {
          if (c.hasDesk !== false) { c.state = STATES.walk; c.tx = c.deskX; c.ty = c.deskY; c.stateTimer = 0; }
          else { c.state = STATES.idle; c.stateTimer = 0; }
        }
        break;
      }
      default: { c.state = STATES.sit; c.stateTimer = 0; }
    }
  });
}

// ═══ Draw character ═══
function drawCharacter(ctx, c, t) {
  const isCEO = c.role === 'CEO';
  const s = (c.scale || 1) * 1.8;
  const isWalking = c.state === STATES.walk;
  const isSitting = c.state === STATES.sit || c.state === STATES.typing || c.state === STATES.drinking || c.state === STATES.pointing;
  const isTalking = c.state === STATES.talking;
  const bob = isWalking ? Math.abs(Math.sin(c.walkPhase * 2)) * 2.5 * s : 0;
  const armSwing = isWalking ? Math.sin(c.walkPhase * 2) * 15 : 0;
  const legSwing = isWalking ? Math.sin(c.walkPhase * 2) * 10 : 0;
  const typeArm = (c.state === STATES.typing) ? Math.sin(c.typingPhase * 6) * 3 : 0;
  const talkNod = isTalking ? Math.sin(t * 0.06) * 2 : 0;
  const drinkArm = (c.state === STATES.drinking) ? -15 + Math.sin(t * 0.04) * 3 : 0;
  const outlineW = isCEO ? 2.5 : 1.5;

  ctx.save();
  ctx.translate(c.x, c.y - bob);
  if (!c.facingRight) ctx.scale(-1, 1);

  // CEO gold glow
  if (isCEO) { ctx.fillStyle = 'rgba(255,215,0,0.08)'; ctx.beginPath(); ctx.arc(0, 0, 35 * s, 0, Math.PI * 2); ctx.fill(); }

  // Shadow
  if (!isSitting) {
    ctx.beginPath(); ctx.ellipse(0, 20 * s, 12 * s, 4 * s, 0, 0, Math.PI * 2);
    ctx.fillStyle = isCEO ? 'rgba(255,215,0,0.15)' : 'rgba(0,0,0,0.25)'; ctx.fill();
  }

  // Legs
  ctx.fillStyle = c.pants; ctx.strokeStyle = 'rgba(0,0,0,0.4)'; ctx.lineWidth = outlineW;
  if (isSitting) {
    const tw = 4.5*s, tl = 8*s;
    ctx.fillRect(2*s, 6*s, tl, tw); ctx.fillRect(2*s, 1*s, tl, tw);
    ctx.fillRect(2*s+tl-tw, 6*s+tw, tw, 6*s); ctx.fillRect(2*s+tl-tw, 1*s+tw, tw, 6*s);
    ctx.fillStyle = isCEO ? '#111' : '#1a1a2e';
    ctx.fillRect(2*s+tl-tw-1*s, 6*s+tw+6*s, 6*s, 2.5*s);
    ctx.fillRect(2*s+tl-tw-1*s, 1*s+tw+6*s, 6*s, 2.5*s);
  } else {
    const legY = 10*s, legH = 10*s;
    const lx1 = -5*s + (isWalking ? -legSwing*0.35 : 0);
    ctx.fillRect(lx1, legY, 4.5*s, legH);
    const lx2 = 0.5*s + (isWalking ? legSwing*0.35 : 0);
    ctx.fillRect(lx2, legY, 4.5*s, legH);
    ctx.fillStyle = isCEO ? '#111' : '#1a1a2e';
    ctx.fillRect(lx1-1*s, legY+legH-1, 6.5*s, 2.5*s);
    ctx.fillRect(lx2-0.5*s, legY+legH-1, 6.5*s, 2.5*s);
  }

  // Body
  const bodyY = -4*s;
  ctx.fillStyle = c.shirt;
  ctx.beginPath();
  ctx.moveTo(-8.5*s, bodyY+14*s); ctx.lineTo(-7.5*s, bodyY);
  ctx.lineTo(7.5*s, bodyY); ctx.lineTo(8.5*s, bodyY+14*s);
  ctx.closePath(); ctx.fill();
  ctx.strokeStyle = 'rgba(0,0,0,0.35)'; ctx.lineWidth = outlineW; ctx.stroke();
  ctx.fillStyle = c.accent; ctx.fillRect(-3*s, bodyY, 6*s, 3*s);

  // Arms
  ctx.fillStyle = c.shirt; ctx.save();
  ctx.translate(-8.5*s, bodyY+2*s);
  ctx.rotate(((isWalking ? armSwing : (c.state === STATES.drinking ? drinkArm : typeArm)) * Math.PI) / 180);
  ctx.fillRect(-2.5*s, 0, 4*s, 10*s);
  ctx.fillStyle = c.skin; ctx.fillRect(-2.5*s, 9*s, 4*s, 3.5*s);
  if (c.state === STATES.drinking) { ctx.fillStyle = '#8b4513'; ctx.fillRect(-3*s, 7*s, 5*s, 5*s); ctx.fillStyle = '#fff'; ctx.fillRect(-3*s, 7*s, 5*s, 1.5*s); }
  ctx.restore();

  ctx.save(); ctx.fillStyle = c.shirt;
  ctx.translate(8.5*s, bodyY+2*s);
  ctx.rotate((-(isWalking ? armSwing : typeArm) * Math.PI) / 180);
  ctx.fillRect(-1.5*s, 0, 4*s, 10*s);
  ctx.fillStyle = c.skin; ctx.fillRect(-1.5*s, 9*s, 4*s, 3.5*s);
  ctx.restore();

  // Head
  const headY = bodyY - 10*s + talkNod, headR = 9.5*s;
  ctx.fillStyle = c.skin; ctx.beginPath(); ctx.arc(0, headY, headR, 0, Math.PI*2); ctx.fill();
  ctx.strokeStyle = 'rgba(0,0,0,0.35)'; ctx.lineWidth = outlineW; ctx.stroke();

  // Hair
  ctx.fillStyle = c.hair; ctx.beginPath();
  ctx.arc(0, headY-2*s, headR+1.5*s, Math.PI, 0); ctx.fill();
  if (c.gender === 'F') {
    ctx.fillRect(-10.5*s, headY-4*s, 4.5*s, 17*s);
    ctx.fillRect(6*s, headY-4*s, 4.5*s, 17*s);
    ctx.beginPath(); ctx.arc(0, headY-2*s, headR+2.5*s, Math.PI*1.1, Math.PI*-0.1); ctx.fill();
  } else { ctx.fillRect(-10.5*s, headY-6*s, 21*s, 6.5*s); }

  // Eyes
  ctx.fillStyle = '#111';
  const eyeY = headY + 1*s;
  const blink = Math.sin(t * 0.02 + c.deskX) > 0.95;
  if (blink) {
    ctx.fillRect(-5.5*s, eyeY-0.5*s, 3.5*s, 1.2*s);
    ctx.fillRect(2*s, eyeY-0.5*s, 3.5*s, 1.2*s);
  } else {
    ctx.beginPath(); ctx.arc(-3.5*s, eyeY, 2*s, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(3.5*s, eyeY, 2*s, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.beginPath(); ctx.arc(-2.8*s, eyeY-0.6*s, 0.8*s, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(4.2*s, eyeY-0.6*s, 0.8*s, 0, Math.PI*2); ctx.fill();
  }

  // CEO sunglasses
  if (isCEO) {
    ctx.fillStyle = 'rgba(0,0,0,0.8)';
    ctx.fillRect(-6*s, eyeY-2.5*s, 5*s, 4.5*s); ctx.fillRect(1*s, eyeY-2.5*s, 5*s, 4.5*s);
    ctx.fillRect(-1*s, eyeY-0.5*s, 2*s, 1*s);
  }

  // Mouth
  if (isTalking) {
    ctx.fillStyle = '#c0392b';
    const mouthOpen = Math.abs(Math.sin(t * 0.1)) * 2.5 * s;
    ctx.beginPath(); ctx.ellipse(0, headY+5*s, 2.5*s, mouthOpen, 0, 0, Math.PI*2); ctx.fill();
  } else {
    ctx.strokeStyle = '#c0392b'; ctx.lineWidth = 1.2; ctx.beginPath();
    ctx.arc(0, headY+3.5*s, 2.5*s, 0.1*Math.PI, 0.9*Math.PI); ctx.stroke();
  }

  // Glasses for QA/Accountant
  if (c.role === 'Accountant' || c.role === 'Tester') {
    ctx.strokeStyle = '#222'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.arc(-3.5*s, eyeY, 3.5*s, 0, Math.PI*2); ctx.stroke();
    ctx.beginPath(); ctx.arc(3.5*s, eyeY, 3.5*s, 0, Math.PI*2); ctx.stroke();
  }

  // CEO vest + tie
  if (isCEO) {
    ctx.fillStyle = '#ffd700'; ctx.fillRect(-2*s, bodyY+2*s, 4*s, 12*s);
    ctx.fillStyle = 'rgba(255,215,0,0.1)'; ctx.fillRect(-8.5*s, bodyY, 17*s, 14*s);
  }

  // YouTube team logo
  if (c.team === 'YouTube' || c.team === 'YouTube Content') {
    const lx = 0, ly = bodyY + 6*s, lw = 6*s, lh = 4*s;
    ctx.fillStyle = '#ff0000';
    ctx.beginPath();
    ctx.moveTo(lx-lw/2+1*s, ly-lh/2); ctx.lineTo(lx+lw/2-1*s, ly-lh/2);
    ctx.lineTo(lx+lw/2, ly); ctx.lineTo(lx+lw/2-1*s, ly+lh/2);
    ctx.lineTo(lx-lw/2+1*s, ly+lh/2); ctx.lineTo(lx-lw/2, ly);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#fff'; ctx.beginPath();
    ctx.moveTo(lx-1.2*s, ly-1.5*s); ctx.lineTo(lx+1.8*s, ly); ctx.lineTo(lx-1.2*s, ly+1.5*s);
    ctx.closePath(); ctx.fill();
  }

  // Talk bubble
  if (isTalking) {
    ctx.fillStyle = 'rgba(255,255,255,0.92)';
    const bx = 12*s, by = headY-16*s;
    ctx.beginPath();
    ctx.moveTo(bx, by); ctx.lineTo(bx+22*s, by); ctx.lineTo(bx+22*s, by+11*s);
    ctx.lineTo(bx+5*s, by+11*s); ctx.lineTo(bx+2*s, by+15*s);
    ctx.lineTo(bx+4*s, by+11*s); ctx.lineTo(bx, by+11*s);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#333'; ctx.font = `bold ${4.5*s}px Inter`;
    ctx.textAlign = 'left'; ctx.fillText(isCEO ? '📋 Check!' : '💬 ...', bx+2*s, by+8*s);
  }

  ctx.restore();

  // Name labels (shadow fillText — no expensive strokeText)
  const nameSize = isCEO ? 12 : 10;
  const roleSize = isCEO ? 9 : 8;
  const nameY = c.y + 28 * s;
  const roleY = c.y + 38 * s;
  ctx.textAlign = 'center';
  ctx.font = `bold ${nameSize}px Inter,sans-serif`;
  ctx.fillStyle = 'rgba(0,0,0,0.75)'; ctx.fillText(c.name, c.x+1, nameY+1);
  ctx.fillStyle = isCEO ? '#ffd700' : 'rgba(255,230,120,0.95)'; ctx.fillText(c.name, c.x, nameY);
  ctx.font = `bold ${roleSize}px Inter`;
  ctx.fillStyle = 'rgba(0,0,0,0.6)'; ctx.fillText(c.role, c.x+1, roleY+1);
  ctx.fillStyle = c.accent; ctx.fillText(c.role, c.x, roleY);

  // State indicator
  if (c.state === STATES.typing) { ctx.font = '9px Inter'; ctx.fillStyle = '#00b894'; ctx.fillText('⌨️', c.x, c.y+47*s); }
  else if (c.state === STATES.drinking) { ctx.font = '10px Inter'; ctx.fillStyle = '#8b4513'; ctx.fillText('☕', c.x, c.y+47*s); }
  else if (isWalking && isCEO) { ctx.font = '9px Inter'; ctx.fillStyle = '#ffd700'; ctx.fillText('🚶', c.x, c.y+47*s); }
}

// ═══ Draw all characters with depth sort ═══
let _sorted = [];
let _lastSort = 0;
function drawAllCharacters(ctx, chars, t) {
  if (t - _lastSort > 15 || _sorted.length !== chars.length) {
    _sorted = [...chars].sort((a, b) => a.y - b.y);
    _lastSort = t;
  }
  for (let i = 0; i < _sorted.length; i++) drawCharacter(ctx, _sorted[i], t);
}
