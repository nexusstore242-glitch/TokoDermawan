/* ==================== 1. DATABASE & CONFIG ==================== */
const USERS_KEY = 'nexus_db_users';
let currentUser = null; 
let activeOrder = null; 
let pendingDeposit = 0;
let isSpinning = false;

const sfx = { click: document.getElementById("sfx-click"), spin: document.getElementById("sfx-spin"), win: document.getElementById("sfx-win") };
function playSfx(t) { if(sfx[t]) { sfx[t].currentTime=0; sfx[t].play().catch(()=>{}); } }

function getDB() { return JSON.parse(localStorage.getItem(USERS_KEY)) || {}; }
function saveDB(db) { localStorage.setItem(USERS_KEY, JSON.stringify(db)); }
function formatRp(angka) { return "Rp " + parseInt(angka).toLocaleString('id-ID'); }
function copyData(id) { navigator.clipboard.writeText(document.getElementById(id).innerText); alert("Disalin!"); }

/* ==================== 2. DATA PRODUK & TALENT ==================== */
const products = [
    // --- TIPE LINK (Auto Akses) ---
    {name:"SUPERGRUP VIP", price:50000, type:"link", link:"https://t.me/+XTHT-nfZ1c9hZDRl", isHot: true}, 
    {name:"STW CUCKMOM PREMIUM", price:30000, type:"link", link:"https://t.me/+HJb70Z-zEt4yNzRl"},
    {name:"HIJAB EKSKLUSIF", price:30000, type:"link", link:"https://t.me/+5kvfGv3Qozo0NTI1"},
    {name:"ABG INDO", price:30000, type:"link", link:"https://t.me/+Dpl0nfrJyLowYTk1"},
    {name:"TALENT INDO", price:30000, type:"link", link:"https://t.me/+g26TeYwkMjM2ZTBl"},
    {name:"BLOWJOB", price:30000, type:"link", link:"https://t.me/+iukHyeiHEq1kODc1"},
    {name:"COSPLAYERS", price:30000, type:"link", link:"https://t.me/+yK3RLPcI0xZmYTll"},
    {name:"VIP COLMEK", price:30000, type:"link", link:"https://t.me/+yK3RLPcI0xZmYTll"},
    {name:"TAKE ALL VIP", price:300000, type:"link", link:"https://t.me/addlist/adamCuZd6MYwN2Y9", isHot: true},

    // --- TIPE RESI (Manual Kirim Admin) ---
    {name:"BOCIL INDO (GARANSI)", price:50000, type:"resi", isHot: true}, 
    {name:"BOCIL BARAT (GARANSI)", price:50000, type:"resi"},
    {name:"PEDMOM (GARANSI)", price:50000, type:"resi"},
    {name:"BOCIL CHINESE (GARANSI)", price:50000, type:"resi"},
    {name:"BOCIL LONGDUR (GARANSI)", price:50000, type:"resi"},
    {name:"BOCIL INDO (STD)", price:30000, type:"resi"},
    {name:"BOCIL BARAT (STD)", price:30000, type:"resi"},
    {name:"PEDMOM (STD)", price:30000, type:"resi"},
    {name:"BOCIL CHINESE (STD)", price:30000, type:"resi"},
    {name:"BOCIL LONGDUR (STD)", price:30000, type:"resi"}
];

/* ==================== 5. RENDER SHOP, EXCHANGE & TALENT ==================== */
function renderShop() {
    const grid = document.getElementById('shop-grid'); 
    if(!grid) return; 
    grid.innerHTML = '';
    
    products.forEach((p, i) => {
        // Tambahkan Label Pemisah Kategori
        if(i === 0) grid.innerHTML += `<div class="prod-sep">>>> AUTO LINK VIP <<<</div>`;
        if(i === 9) grid.innerHTML += `<div class="prod-sep" style="color:#f1c40f;">>>> PREMIUM GARANSI <<<</div>`;
        if(i === 14) grid.innerHTML += `<div class="prod-sep" style="color:#aaa;">>>> STANDARD EDITION <<<</div>`;
        
        // Cek apakah item ini kategori Garansi
        const isGaransi = p.name.includes("GARANSI");
        
        // Buat style khusus untuk Garansi (Tema Emas/Gold)
        const boxStyle = isGaransi ? 'border-color:#f1c40f; background: rgba(241, 196, 15, 0.05);' : '';
        const titleColor = isGaransi ? 'color:#f1c40f;' : 'color:#fff;';
        const priceColor = isGaransi ? 'color:#f1c40f;' : 'color:var(--acc);';
        const btnStyle = isGaransi ? 'background: linear-gradient(135deg, #f39c12, #f1c40f); color: #000; border: none;' : '';

        grid.innerHTML += `
        <div class="product" style="${boxStyle}">
            ${p.isHot ? '<div class="hot-badge">HOT</div>' : ''}
            <h3 style="${titleColor}">${p.name}</h3>
            <p style="${priceColor}">${formatRp(p.price)}</p>
            <button class="cyber-btn full-width" style="${btnStyle}" onclick="buyItem(${i}, 'shop')">BELI</button>
        </div>`;
    });
}

const vipFreeData = [
    {name: "VIP FREE 1", cost: 3000, link: "https://t.me/+"},
    {name: "VIP FREE 2", cost: 5000, link: "https://t.me/+"},
    {name: "VIP TAKE ALL", cost: 30000, link: "https://t.me/addlist/adamCuZd6MYwN2Y9"}
];

const talents = [
    { name: "Siska", type: "vcs/video", price: 40000, status: "Online", img: "siska.png" },
    { name: "Chika", type: "vcs/Teman mabar/video", price: 65000, status: "Sibuk", img: "chika.png" }
];

const spinPrizes = [
    { label: "SUPER", val: "https://t.me/+XTHT-nfZ1c9hZDRl", type: "grand", color: "#2d3436", icon:'👑' }, 
    { label: "50 TKN", val: 50, type: "token", color: "#e67e22", icon:'🪙' },  
    { label: "TAKE ALL", val: "https://t.me/addlist/adamCuZd6MYwN2Y9", type: "grand", color: "#9b59b6", icon:'⭐' }, 
    { label: "100 TKN", val: 100, type: "token", color: "#e84393", icon:'💎' },  
    { label: "ZONK", val: 0, type: "zonk", color: "#0984e3", icon:'❌' }, 
    { label: "10 TKN", val: 10, type: "token", color: "#00cec9", icon:'💎' },   
    { label: "ZONK", val: 0, type: "zonk", color: "#d63031", icon:'💣' },      
    { label: "BOCIL", val: "PRODUK GARANSI", type: "product", color: "#f1c40f", icon:'📦' } 
];

/* ==================== 3. AUTH & UI ==================== */
function checkSession() {
    const sess = sessionStorage.getItem('nexusActive');
    if(sess) { const db=getDB(); currentUser = {username:sess, ...db[sess]}; } 
    else currentUser = null;
    updateUI();
}

function updateUI() {
    const hSal=document.getElementById('header-saldo'), hTok=document.getElementById('header-token');
    const pName=document.getElementById('prof-name'), pSal=document.getElementById('prof-saldo'), pTok=document.getElementById('prof-token'), pImg=document.getElementById('prof-img'), pRank=document.getElementById('prof-rank');
    const authBtn=document.getElementById('btn-auth-action'); // <--- Tarik tombolnya ke sistem

    if(currentUser) {
        // TAMPILAN JIKA SUDAH LOGIN
        hSal.innerText = formatRp(currentUser.saldo); hTok.innerText = currentUser.token;
        pName.innerText = currentUser.username.toUpperCase();
        pSal.innerText = formatRp(currentUser.saldo); pTok.innerText = currentUser.token;
        pImg.src = currentUser.avatar || `https://ui-avatars.com/api/?name=${currentUser.username}&background=d63031&color=fff`;
        pRank.innerHTML = currentUser.saldo > 100000 ? `<i class="fas fa-crown"></i> ELITE AGENT` : `<i class="fas fa-star"></i> NEW AGENT`;
        
        // Ubah tombol jadi LOGOUT
        if(authBtn) {
            authBtn.innerHTML = 'LOGOUT';
            authBtn.style.background = '#2d3436';
            authBtn.setAttribute('onclick', 'logout()');
        }
    } else {
        // TAMPILAN JIKA GUEST (BELUM LOGIN)
        hSal.innerText = "0"; hTok.innerText = "0";
        pName.innerText = "GUEST"; pSal.innerText = "IDR 0"; pTok.innerText = "0";
        pImg.src = `https://ui-avatars.com/api/?name=Guest&background=333&color=fff`;
        
        // Ubah tombol jadi DAFTAR / LOGIN
        if(authBtn) {
            authBtn.innerHTML = 'DAFTAR / LOGIN';
            authBtn.style.background = 'linear-gradient(135deg, #e67e22, #d35400)'; // Dikasih warna oren biar nyala
            authBtn.setAttribute('onclick', "openAuthModal('login')");
        }
    }
    renderHistory();
}


function openAuthModal(mode) { document.getElementById('auth-overlay').classList.add('active'); switchAuth(mode); }
function closeAuthModal() { document.getElementById('auth-overlay').classList.remove('active'); }
let currentAuthMode = 'login';
function switchAuth(mode) {
    currentAuthMode = mode;
    document.getElementById('tab-login').style.color = mode==='login'?'var(--acc)':'#666';
    document.getElementById('tab-register').style.color = mode==='register'?'var(--acc)':'#666';
    document.getElementById('auth-btn').innerText = mode==='login'?"MASUK SYSTEM":"DAFTAR AKUN";
    document.getElementById('auth-msg').innerText = "";
}

function handleAuth(e) {
    e.preventDefault(); playSfx('click');
    const user = document.getElementById('username').value.trim().toLowerCase(), pass = document.getElementById('password').value, msg = document.getElementById('auth-msg'), db = getDB();
    if(!user || !pass) return msg.innerText = "Isi data dengan lengkap!";

    if(currentAuthMode === 'register') {
        if(db[user]) return msg.innerText = "Username sudah ada!";
        db[user] = { password:pass, saldo:0, token:0, history:[], talentUnlocked:false }; saveDB(db);
        msg.innerText="Daftar Sukses!"; msg.style.color="#55efc4"; setTimeout(()=>switchAuth('login'), 1000);
    } else {
        if(db[user] && db[user].password === pass) {
            sessionStorage.setItem('nexusActive', user); checkSession(); closeAuthModal();
        } else msg.innerText = "Username/Password salah!";
    }
}
function logout() { if(confirm("Keluar dari sistem?")) { sessionStorage.removeItem('nexusActive'); checkSession(); showPage('home'); } }
/* ==================== 4. NAVIGATION ==================== */
function showPage(id) {
    if(id === 'topup' && !currentUser && !activeOrder) { alert("Guest hanya bisa membuka kasir untuk bayar pesanan. Login untuk Deposit."); return openAuthModal('login'); }
    if(id === 'talent') renderTalent();

    playSfx('click');
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    
    const navs = {'home':0, 'shop':1, 'talent':2, 'spin':3, 'profile':4};
    if(navs[id]!==undefined) document.querySelectorAll('.nav-btn')[navs[id]].classList.add('active');
    
    // INI DIA BIANG KEROKNYA YANG SUDAH DIPERBAIKI 👇
    if(id !== 'topup') {
        activeOrder = null; 
    } else {
        preparePaymentUI(); // Sekarang sistem akan selalu merender ulang halaman kasir
    }
    
    window.scrollTo(0,0);
}




function renderExchange() {
    const grid = document.getElementById('exchange-grid'); if(!grid) return; grid.innerHTML = '';
    vipFreeData.forEach((v, i) => {
        grid.innerHTML += `<div class="product" style="border-color:#f1c40f; background:rgba(241,196,15,0.05);">
        <h3 style="color:#f1c40f;">${v.name}</h3><p style="color:#fff;">${v.cost} TKN</p>
        <button class="cyber-btn full-width" style="background:#f1c40f; color:#000;" onclick="buyVipFree(${i})">TUKAR</button></div>`;
    });
}

function buyVipFree(idx) {
    if(!currentUser) return openAuthModal('login');
    const v = vipFreeData[idx];
    if(currentUser.token < v.cost) return alert(`Token kurang! Butuh ${v.cost} TKN.`);
    if(confirm(`Tukar ${v.cost} TKN untuk ${v.name}?`)) {
        const db=getDB(); db[currentUser.username].token -= v.cost; saveDB(db); checkSession();
        saveHistory(`Tukar: ${v.name}`, 0, v.link); playSfx('win'); alert("Berhasil! Link ada di Riwayat.");
    }
}

function renderTalent() {
    const lock = document.getElementById('talent-lock'), content = document.getElementById('talent-content'), grid = document.getElementById('talent-grid');
    if(!currentUser || !currentUser.talentUnlocked) { lock.style.display='block'; content.style.display='none'; } 
    else {
        lock.style.display='none'; content.style.display='block'; grid.innerHTML = '';
        talents.forEach((t, i) => {
            const c = t.status==='Online'?'#55efc4':'#ff7675';
            grid.innerHTML += `<div class="product" style="border-color:var(--acc);">
            <img src="${t.img}" style="width:60px; height:60px; border-radius:50%; border:2px solid var(--acc); margin-bottom:5px;">
            <h3 style="color:var(--acc);">${t.name}</h3><p style="font-size:0.6rem; color:#aaa;">${t.type}</p>
            <p>${formatRp(t.price)}/jam</p><div style="font-size:0.6rem; color:${c}; margin-bottom:5px;">${t.status}</div>
            <button class="cyber-btn full-width" onclick="buyItem(${i}, 'talent')">BOOKING</button></div>`;
        });
    }
}

function unlockTalent() {
    if(!currentUser) return openAuthModal('login');
    if(currentUser.saldo < 5000) return alert("Saldo kurang! Butuh Rp 5.000");
    if(confirm("Buka akses Talent seharga Rp 5.000?")) {
        const db=getDB(); db[currentUser.username].saldo -= 5000; db[currentUser.username].talentUnlocked = true; saveDB(db); checkSession();
        saveHistory("Unlock Talent Access", 5000, null); playSfx('win'); renderTalent();
    }
}

/* ==================== DATA & FUNGSI PROMO ==================== */
const promoProducts = [
    {name:"10K VIP RANDOM", price:10000, type:"resi"}, 
    {name:"TAKE ALL VIP", price:120000, type:"link", link:"https://t.me/addlist/adamCuZd6MYwN2Y9"}, // Diskon dari 300k
    {name:"50K BEBAS PILIH", price:50000, type:"resi"}
];

function renderPromo() {
    const grid = document.getElementById('promo-grid'); 
    if(!grid) return; 
    grid.innerHTML = '';
    
    promoProducts.forEach((p, i) => {
        // Efek coret khusus buat Take All VIP
        const originalPrice = p.price === 120000 ? `<span style="text-decoration: line-through; color:#ff7675; font-size:0.65rem;">Rp 300.000</span><br>` : '';
        
        grid.innerHTML += `
        <div class="product" style="border-color:#f1c40f; background: rgba(241, 196, 15, 0.05);">
            <div class="hot-badge" style="background:#e84393; color:#fff;">PROMO</div>
            <h3 style="color:#f1c40f;">${p.name}</h3>
            <p style="color:#f1c40f; font-weight:900;">${originalPrice}${formatRp(p.price)}</p>
            <button class="cyber-btn full-width" style="background: linear-gradient(135deg, #f39c12, #f1c40f); color: #000; border: none;" onclick="buyItem(${i}, 'promo')">AMBIL PROMO</button>
        </div>`;
    });
}

function buyItem(idx, source) {
    // Cek beli darimana (Shop biasa, Promo, atau Talent)
    if(source === 'shop') activeOrder = products[idx];
    else if(source === 'promo') activeOrder = promoProducts[idx];
    else activeOrder = { name: `[VC] ${talents[idx].name}`, price: talents[idx].price, type: 'resi' };
    
    showPage('topup');
}


/* ==================== 6. PAYMENT, INVOICE & TIMER ==================== */
function preparePaymentUI() {
    document.getElementById('btn-konfirmasi').style.display = 'block';
    document.getElementById('btn-loading').style.display = 'none';
    document.getElementById('btn-akses').style.display = 'none';

    if(activeOrder) {
        document.getElementById('invoice-area').style.display='block'; 
        document.getElementById('topup-manual').style.display='none';
        
        // Buat Invoice Baru
        document.getElementById('inv-no').innerText = "#NX-" + Math.floor(Math.random() * 99999);
        document.getElementById('inv-user').innerText = currentUser ? currentUser.username.toUpperCase() : "GUEST";
        document.getElementById('inv-item').innerText = activeOrder.name; 
        document.getElementById('inv-total').innerText = formatRp(activeOrder.price);
    } else {
        document.getElementById('invoice-area').style.display='none'; 
        document.getElementById('topup-manual').style.display='block';
    }
}

function processTransaction() {
    playSfx('click'); 
    const uname = currentUser ? currentUser.username : "GUEST"; 
    let msg = "";
    
    // Ambil tanggal & waktu sekarang
    const dateStr = new Date().toLocaleString('id-ID');

    if(activeOrder) {
        const invNo = document.getElementById('inv-no').innerText;
        // FORMAT TEKS INVOICE PRODUK KE ADMIN
        msg = `🧾 *INVOICE PEMBELIAN*\n` +
              `━━━━━━━━━━━━━━━━━━━━━━\n` +
              `🆔 No. Pesanan : ${invNo}\n` +
              `👤 Username : ${uname}\n` +
              `📅 Tanggal : ${dateStr}\n` +
              `📦 Item : ${activeOrder.name}\n` +
              `💰 Total Tagihan : ${formatRp(activeOrder.price)}\n` +
              `━━━━━━━━━━━━━━━━━━━━━━\n` +
              `Min, saya sudah transfer. Mohon segera diproses ya!`;
    } else {
        pendingDeposit = parseInt(document.getElementById('topup-amount').value);
        if(!pendingDeposit || pendingDeposit < 1000) return alert("Minimal deposit adalah Rp 1.000");
        
        // FORMAT TEKS INVOICE DEPOSIT SALDO KE ADMIN
        msg = `💎 *INVOICE DEPOSIT SALDO*\n` +
              `━━━━━━━━━━━━━━━━━━━━━━\n` +
              `🆔 No. Transaksi : #DP-${Math.floor(Math.random() * 99999)}\n` +
              `👤 Username : ${uname}\n` +
              `📅 Tanggal : ${dateStr}\n` +
              `💰 Nominal Deposit : ${formatRp(pendingDeposit)}\n` +
              `━━━━━━━━━━━━━━━━━━━━━━\n` +
              `Min, saya sudah transfer untuk isi saldo akun. Tolong dicek.`;
    }
    
    window.open(`https://t.me/OrangPentingKlikAja?text=${encodeURIComponent(msg)}`, "_blank");
    runTimer();
}


function runTimer() {
    document.getElementById('btn-konfirmasi').style.display='none'; document.getElementById('btn-loading').style.display='block';
    let t = 15;
    const cd = setInterval(() => {
        t--; document.getElementById('timer').innerText = t;
        if(t <= 0) {
            clearInterval(cd); playSfx('win'); document.getElementById('btn-loading').style.display='none';
            if(activeOrder) {
                if(activeOrder.type === 'link') { document.getElementById('btn-akses').style.display='block'; alert("Terverifikasi! Klik Buka Produk."); }
                else { alert("Masuk! Admin akan chat kamu segera."); showPage('home'); }
                
                saveHistory(`Beli ${activeOrder.name}`, activeOrder.price, activeOrder.link || null);
                if(currentUser) { const db=getDB(); db[currentUser.username].token += Math.floor(Math.random()*50)+10; saveDB(db); checkSession(); }
            } else {
                if(currentUser && pendingDeposit > 0) {
                    const db=getDB(); db[currentUser.username].saldo += pendingDeposit; saveDB(db); checkSession();
                    saveHistory("Deposit Saldo", pendingDeposit, null); alert(`Deposit ${formatRp(pendingDeposit)} masuk!`); showPage('profile');
                }
                pendingDeposit = 0;
            }
        }
    }, 1000);
}
function openProductLink() { if(activeOrder && activeOrder.link) window.open(activeOrder.link, '_blank'); }

/* ==================== 7. HISTORY ==================== */
function saveHistory(desc, amount, link) {
    const tx = { desc, amount, date: new Date().toLocaleDateString(), link };
    if(currentUser) { const db=getDB(); db[currentUser.username].history.push(tx); saveDB(db); checkSession(); }
}

function renderHistory() {
    const list = document.getElementById('hist-list'); if(!list) return;
    const data = currentUser ? currentUser.history : [];
    list.innerHTML = data.length===0 ? '<p style="text-align:center; color:#666; font-size:0.8rem;">Belum ada jejak.</p>' : '';
    
    data.slice().reverse().forEach(h => {
        const isInc = h.desc.toLowerCase().includes('deposit') || h.amount === 0;
        const trxId = "TRX-" + Math.random().toString(36).substr(2, 4).toUpperCase();
        const btn = h.link ? `<button onclick="window.open('${h.link}')" style="background:#d63031; color:#fff; border:none; padding:3px 8px; border-radius:4px; font-size:0.6rem; cursor:pointer; margin-top:5px;">BUKA</button>` : '';
        list.innerHTML += `<div class="hist-card"><div class="hist-left"><span class="hist-title">${h.desc}</span><span class="hist-date">${h.date} • ${trxId}</span>${btn}</div><div class="hist-right"><span class="hist-amount ${isInc?'amount-plus':'amount-min'}">${isInc?'+':'-'} ${h.amount===0?'GRATIS':formatRp(h.amount)}</span></div></div>`;
    });
}

/* ==================== 8. SPIN WHEEL ==================== */
function renderWheel() {
    const w = document.getElementById('wheel'); if(!w) return; w.innerHTML = "";
    let grad = "conic-gradient(from 0deg, ";
    spinPrizes.forEach((p, i) => { grad += `${p.color} ${i*45}deg ${(i+1)*45}deg,`; });
    w.style.background = grad.slice(0, -1) + ")";

    spinPrizes.forEach((p, i) => {
        const deg = (i*45) + 22.5;
        w.innerHTML += `<div style="position:absolute; top:0; left:50%; width:70px; height:50%; margin-left:-35px; transform-origin:50% 100%; display:flex; flex-direction:column; align-items:center; padding-top:15px; transform:rotate(${deg}deg); z-index:10;"><div style="color:#fff; font-size:0.65rem; font-weight:900; text-align:center; text-shadow:1px 1px 3px #000;">${p.icon}<br>${p.label}</div></div>`;
    });
}

function spinWheel(cost) {
    if(!currentUser) return openAuthModal('login');
    if(currentUser.saldo < cost) return alert(`Saldo kurang! Butuh ${formatRp(cost)}`);
    if(isSpinning) return; if(!confirm(`Putar seharga ${formatRp(cost)}?`)) return;

    const db=getDB(); db[currentUser.username].saldo -= cost; saveDB(db); checkSession();
    playSfx('spin'); isSpinning = true; document.getElementById('spin-res').innerHTML = "MENCARI...";
    const w = document.getElementById('wheel');
    
    let chances = cost===700 ? [0.1, 15, 0.1, 4.8, 30, 15, 30, 5] : (cost===2000 ? [1,20,1,18,15,15,15,15] : [4,25,4,27,5,5,5,25]);
    let r = Math.random() * chances.reduce((a,b)=>a+b,0), idx = 0;
    for(let i=0; i<chances.length; i++) { r -= chances[i]; if(r<=0) { idx=i; break; } }
    
    const win = spinPrizes[idx];
    const targetRotation = 3600 - ((idx * 45) + 22.5);
    w.style.transform = `rotate(${targetRotation}deg)`;

    setTimeout(() => {
        w.style.transition = 'none'; w.style.transform = `rotate(${targetRotation % 360}deg)`; isSpinning = false;
        if(win.type === 'zonk') { playSfx('click'); document.getElementById('spin-res').innerHTML = `<span style="color:#ff7675">ZONK! 🤣</span>`; } 
        else {
            playSfx('win'); document.getElementById('spin-res').innerHTML = `<span style="color:var(--acc)">WIN: ${win.label}</span>`;
            if(win.type === 'token') { db[currentUser.username].token+=win.val; saveDB(db); checkSession(); alert(`Token +${win.val}`); }
            else { saveHistory(`Spin: ${win.label}`, 0, win.type==='grand'?win.val:null); alert(`Kamu dapat ${win.label}! Cek Riwayat / Lapor Admin.`); }
        }
        setTimeout(() => w.style.transition = '4s cubic-bezier(0.15,0,0.15,1)', 100);
    }, 4000);
}

/* ==================== 9. EXTRAS ==================== */
function triggerUpload() { if(!currentUser) return; document.getElementById('file-input').click(); }
function handleAvatarUpload(input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) { const b64 = e.target.result; const db=getDB(); db[currentUser.username].avatar = b64; saveDB(db); checkSession(); }
        reader.readAsDataURL(input.files[0]);
    }
}

function initSlider() {
    const w = document.getElementById('slider-wrapper'); if(!w) return;
    let idx = 0; setInterval(() => { idx = (idx+1)%2; w.style.transform = `translateX(-${idx*100}%)`; }, 3000);
}



function executeShareTask() {
    if(!currentUser) return alert("Login dulu!");
    window.open("https://t.me/share/url?url=Media", "_blank");
    setTimeout(() => { const db=getDB(); db[currentUser.username].token += 50; saveDB(db); checkSession(); alert("Share Berhasil! +50 Token."); }, 3000);
}

/* ==================== 10. LIVE CHAT / TESTIMONIAL SYSTEM ==================== */
function initComments() {
    const list = document.getElementById('com-list');
    if(!list) return;
    list.innerHTML = '';
    
    // Data list chat sesuai request (p: true untuk yang punya foto profil, false untuk yang default)
    const dummyChats = [
        { n: "Anonim", t: "Ok 💥", p: false },
        { n: "4", t: "jujur dan amanah", p: true },
        { n: "اذهب إلى الجحيم", t: "backup nya di perbanyak minn", p: false },
        { n: "AD", t: "Terbaik ini mah", p: true },
        { n: "G D", t: "Mantap", p: false },
        { n: "Nothingtosay", t: "Mantap", p: true },
        { n: "ramsvck", t: "terbaekkkk", p: true },
        { n: "ar", t: "goksss🙌🙌", p: false },
        { n: "sopi", t: "mantap", p: true },
        { n: "IshhHemi", t: "terbaikk", p: false },
        { n: "Masalah", t: "Top 🔥🔥🔥", p: true },
        { n: "Ghrx Iyzh", t: "Mantapp", p: false },
        { n: "Az Awan,an", t: "Goof<br>Good", p: true },
        { n: "Second Foruy", t: "Gacor min", p: true },
        { n: "Rimo Remi", t: "Nais", p: false },
        { n: "toke", t: "good", p: true },
        { n: "A p", t: "Jossssss", p: false },
        { n: "sopi", t: "mntp", p: true },
        { n: "Ocil", t: "Mantap", p: false },
        { n: "Ahmad Rifa'i", t: "Mantap", p: true },
        { n: "Acha", t: "Mantap", p: false },
        { n: "Boyman", t: "Langganan gw ini mah", p: true },
        { n: "Gbk Yus", t: "Mantap 10000/10 pokoke", p: true },
        { n: "askar", t: "mantap", p: false },
        { n: "Chreeezzz", t: "Mantepp pkoknya Mahh🤙🏻", p: true },
        { n: "🤠", t: "Mantapp", p: false },
        { n: "A p", t: "Siiiip", p: true },
        { n: ".. Kaka bu", t: "Mntppp", p: false },
        { n: "J R", t: "top martokop", p: true },
        { n: "R", t: "mantap", p: false },
        { n: "cookie", t: "paling terbaik", p: true },
        { n: "Ridho Harun", t: "Baik", p: false },
        { n: "Grizz Lazy", t: "gg", p: true },
        { n: "Acha", t: "Gercep dan dibantu, mantap lah", p: true },
        { n: "Mas Wo", t: "Ok crot", p: false }
    ];

    dummyChats.forEach(c => {
        // Jika p = true, buat avatar warna-warni pakai inisial nama. Jika false, jadikan abu-abu polos.
        const avatarUrl = c.p 
            ? `https://ui-avatars.com/api/?name=${encodeURIComponent(c.n)}&background=random&color=fff&bold=true` 
            : `https://ui-avatars.com/api/?name=User&background=333&color=555`;
        
        list.innerHTML += `
        <div class="chat-item">
            <img src="${avatarUrl}" style="width:25px; height:25px; border-radius:50%; object-fit:cover; flex-shrink:0; border:1px solid #440000;">
            <div class="chat-content"><span class="chat-name">${c.n}</span>${c.t}</div>
        </div>`;
    });
    
    // Otomatis scroll ke chat paling bawah saat web baru dibuka
    setTimeout(() => { list.scrollTop = list.scrollHeight; }, 300);
}

function postComment() {
    const i = document.getElementById('com-input');
    const t = i.value.trim(); 
    if(!t) return;
    
    // Tarik data nama dan foto profil user saat ini
    const username = currentUser ? currentUser.username : 'Guest';
    const avatarUrl = currentUser && currentUser.avatar 
        ? currentUser.avatar 
        : `https://ui-avatars.com/api/?name=${username}&background=d63031&color=fff`;

    // Render pesan baru dari user di sebelah kanan (me)
    document.getElementById('com-list').innerHTML += `
    <div class="chat-item me">
        <img src="${avatarUrl}" style="width:25px; height:25px; border-radius:50%; object-fit:cover; flex-shrink:0; border:1px solid var(--acc);">
        <div class="chat-content"><span class="chat-name">${username}</span>${t}</div>
    </div>`;
    
    i.value = ''; 
    const list = document.getElementById('com-list');
    list.scrollTop = list.scrollHeight; // Auto-scroll setelah ngetik
    playSfx('click');
}

function executeShareTask() {
    if(!currentUser) return alert("Login dulu!");
    window.open("https://t.me/share/url?url=Media", "_blank");
    setTimeout(() => { const db=getDB(); db[currentUser.username].token += 50; saveDB(db); checkSession(); alert("Share Berhasil! +50 Token."); }, 3000);
}

/* ==================== INIT WEB FINAL ==================== */
document.addEventListener('DOMContentLoaded', () => {
    checkSession(); 
    renderShop(); 
    renderExchange(); 
    renderWheel(); 
    renderPromo();      // <- Render list promo
    initSlider(); 
    initComments(); 
    
    // OBAT TIMER HILANG: Panggil render peti tiap web di-refresh!
    if(typeof renderDailyChest === 'function') {
        renderDailyChest(); 
    }
});

/* ==================== 11. CUSTOMER SERVICE (CHATBOT) ==================== */
function openCS() {
    document.getElementById('cs-overlay').classList.add('active');
    const body = document.getElementById('cs-chat-body');
    
    // Jika chat masih kosong, mulai percakapan baru
    if(body.innerHTML.trim() === '') {
        setTimeout(() => {
            appendCSMessage('bot', "Halo Kak! 👋<br>Saya dermawan Assistant. Ada yang bisa saya bantu hari ini?");
            showCSOptions();
        }, 300);
    }
}

function closeCS() {
    document.getElementById('cs-overlay').classList.remove('active');
}

function appendCSMessage(sender, text) {
    const body = document.getElementById('cs-chat-body');
    const div = document.createElement('div');
    div.className = `cs-bubble ${sender}`;
    div.innerHTML = text;
    body.appendChild(div);
    body.scrollTop = body.scrollHeight; // Auto-scroll ke bawah
    if(sender === 'bot') playSfx('click');
}

function showCSOptions() {
    const qr = document.getElementById('cs-quick-replies');
    qr.innerHTML = `
        <button class="cs-qr-btn" onclick="handleCSOption('Cara Order')">Cara Order</button>
        <button class="cs-qr-btn" onclick="handleCSOption('Info Token')">Info Token & Spin</button>
        <button class="cs-qr-btn" onclick="handleCSOption('Live Agent')">Hubungi Admin 🙋‍♂️</button>
    `;
}

function handleCSOption(option) {
    // Sembunyikan tombol pilihan sementara bot mengetik
    document.getElementById('cs-quick-replies').innerHTML = '';
    
    // Cetak pesan user di layar kanan
    appendCSMessage('user', option);

    // Animasi delay (seolah bot sedang mengetik)
    setTimeout(() => {
        let reply = "";
        
        if(option === 'Cara Order') {
            reply = `<b style="color:var(--acc);">CARA TRANSAKSI:</b><br>1. Login/Daftar akun dulu ya kak.<br>2. Pilih produk di Market atau Talent.<br>3. Transfer sesuai nominal tagihan.<br>4. Klik <b>Konfirmasi Bayar</b>.<br>5. Link/Barang otomatis masuk ke Profil > Riwayat. Gampang kan? 😎`;
        } 
        else if(option === 'Info Token') {
            reply = `<b style="color:#f1c40f;">INFO TOKEN & SPIN:</b><br>- <b>Token</b> otomatis didapat tiap belanja/deposit.<br>- Bisa dapet Token gratis dari misi Share.<br>- Mainkan <b>Cyber Spin</b> pakai Saldo (Mulai Rp 700) untuk gacha hadiah Token & VIP Akses! 🎰`;
        } 
        else if(option === 'Live Agent') {
            reply = `Tentu kak! Jika ada kendala, admin kami siap melayani 24/7. Silakan pilih kontak di bawah ini:<br><br>
            <button onclick="window.open('https://wa.me/6283125398104', '_blank')" class="cyber-btn full-width" style="background:#25D366; border-color:#25D366; padding:8px; font-size:0.75rem; margin-bottom:8px;"><i class="fab fa-whatsapp" style="font-size:1rem;"></i> WHATSAPP</button>
            <button onclick="window.open('https://t.me/OrangPentingKlikAja', '_blank')" class="cyber-btn full-width" style="background:#0088cc; border-color:#0088cc; padding:8px; font-size:0.75rem;"><i class="fab fa-telegram-plane" style="font-size:1rem;"></i> TELEGRAM</button>`;
        }

        // Balasan bot muncul di layar kiri
        appendCSMessage('bot', reply);
        
        // Munculkan opsi topik lagi setelah bot selesai membalas
        setTimeout(showCSOptions, 600);
    }, 800); // Jeda 0.8 detik
}
/* ==================== 12. DAILY CHECK-IN (CHEST 24 JAM) ==================== */
let chestTimerInterval;

function renderDailyChest() {
    const chestImg = document.getElementById('daily-chest-img');
    const timerDiv = document.getElementById('chest-timer');
    const glow = document.getElementById('chest-glow');
    if(!chestImg) return;

    clearInterval(chestTimerInterval); // Bersihkan timer lama

    if(!currentUser) {
        // GUEST: Peti Tertutup, Minta Login
        chestImg.src = "chest-closed.jpg";
        glow.style.display = "block";
        timerDiv.style.display = "none";
        return;
    }

    const lastClaim = currentUser.lastCheckInTime || 0; // Waktu klaim terakhir (ms)
    const now = Date.now();
    const twentyFourHours = 24 * 60 * 60 * 1000; // 24 Jam dalam Milidetik
    const timeDiff = now - lastClaim;

    if(timeDiff < twentyFourHours) {
        // SUDAH KLAIM: Peti Terbuka & Timer Jalan
        chestImg.src = "chest-open.jpg";
        glow.style.display = "none";
        timerDiv.style.display = "block";
        startChestTimer(twentyFourHours - timeDiff); // Mulai hitung mundur
    } else {
        // BISA KLAIM: Peti Tertutup & Nyala
        chestImg.src = "chest-closed.jpg";
        glow.style.display = "block";
        timerDiv.style.display = "none";
    }
}

function startChestTimer(remainingMs) {
    const timerDiv = document.getElementById('chest-timer');
    let timeLeft = Math.floor(remainingMs / 1000);

    chestTimerInterval = setInterval(() => {
        if (timeLeft <= 0) {
            clearInterval(chestTimerInterval);
            renderDailyChest(); // Refresh otomatis kalau waktu habis
            return;
        }
        
        // Format detik menjadi Jam:Menit:Detik
        const h = Math.floor(timeLeft / 3600).toString().padStart(2, '0');
        const m = Math.floor((timeLeft % 3600) / 60).toString().padStart(2, '0');
        const s = (timeLeft % 60).toString().padStart(2, '0');
        
        timerDiv.innerText = `${h}:${m}:${s}`;
        timeLeft--;
    }, 1000);
}

function claimDaily() {
    if(!currentUser) return openAuthModal('login'); // Cegah Guest

    const lastClaim = currentUser.lastCheckInTime || 0;
    const now = Date.now();
    const twentyFourHours = 24 * 60 * 60 * 1000;

    // Cegah klaim dobel (kalau belum 24 jam)
    if(now - lastClaim < twentyFourHours) {
        return alert("Peti sedang disiapkan!\nTunggu waktu mundur selesai ya.");
    }

    const chestImg = document.getElementById('daily-chest-img');
    
    // Animasi getar manual sebelum terbuka
    chestImg.style.transform = "scale(1.1) rotate(5deg)";
    setTimeout(() => chestImg.style.transform = "scale(1.1) rotate(-5deg)", 100);
    setTimeout(() => chestImg.style.transform = "scale(1)", 200);

    // Proses Buka Peti
    setTimeout(() => {
        // Gacha Token (Random 10 sampai 100)
        const reward = Math.floor(Math.random() * 91) + 10; 
        
        const db = getDB();
        db[currentUser.username].token += reward;
        db[currentUser.username].lastCheckInTime = Date.now(); // Catat detik klaim
        saveDB(db);
        
        checkSession(); // Update UI Saldo
        playSfx('win');
        
        // Tampilkan Popup Keren
        document.getElementById('reward-amount').innerText = reward;
        document.getElementById('reward-overlay').classList.add('active');
        
        saveHistory("Daily Login Chest", 0, null);
        
        renderDailyChest(); // Ubah gambar jadi terbuka dan jalanin timer
    }, 400);
}
