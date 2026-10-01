const demoArt = [
  {
    id: 1,
    title: "Golden Silence",
    artist: "Aarav",
    category: "Digital Art",
    description: "A warm abstract study of light and silence.",
    likes: 12,
    image:
      "https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 2,
    title: "Blue Mind",
    artist: "Mira",
    category: "Painting",
    description: "An expressive blue-toned contemporary painting.",
    likes: 8,
    image:
      "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 3,
    title: "Quiet Portrait",
    artist: "Rohan",
    category: "Sketch",
    description: "A simple monochrome portrait study.",
    likes: 19,
    image:
      "https://images.unsplash.com/photo-1577083552431-6e5fd01988a5?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 4,
    title: "City Light",
    artist: "Nisha",
    category: "Photography",
    description: "Night lights and urban geometry.",
    likes: 6,
    image:
      "https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 5,
    title: "Orange Form",
    artist: "Kabir",
    category: "Digital Art",
    description: "Bold shapes inspired by natural forms.",
    likes: 15,
    image:
      "https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=900&q=80",
  },
];
let arts =
  JSON.parse(localStorage.getItem("artgallery_arts") || "null") || demoArt;
let currentId = null,
  currentArtist = null;
let user = JSON.parse(localStorage.getItem("artgallery_user") || "null");

function save() {
  localStorage.setItem("artgallery_arts", JSON.stringify(arts));
}
function esc(s) {
  return String(s ?? "").replace(
    /[&<>"']/g,
    (m) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;",
      })[m],
  );
}
function showPage(id) {
  document.querySelectorAll(".page").forEach((x) => x.classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");
  document
    .querySelectorAll(".main-nav a")
    .forEach((a) => a.classList.toggle("active", a.dataset.page === id));
  if (id === "gallery") renderGallery(arts);
  if (id === "dashboard") renderDashboard();
  if (id === "messages") renderMessages();
  window.scrollTo({ top: 0, behavior: "smooth" });
}
function card(a, owner = false) {
  return `<article class="art-card"><img src="${esc(a.image)}" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22800%22 height=%22500%22><rect width=%22100%%22 height=%22100%%22 fill=%22%23131c27%22/><text x=%2250%%22 y=%2250%%22 fill=%22white%22 text-anchor=%22middle%22>No Image</text></svg>'"><div class="art-info"><h3>${esc(a.title)}</h3><p>${esc(a.artist)} · ${esc(a.category)}</p><div class="art-meta"><span>❤️ ${a.likes || 0}</span><a href="#" onclick="openArtwork(${a.id});return false">View →</a></div>${owner ? `<div style="margin-top:10px;display:flex;gap:6px"><button class="btn small" onclick="deleteArt(${a.id})">Delete</button></div>` : ""}</div></article>`;
}
function renderGallery(list) {
  document.getElementById("galleryGrid").innerHTML = list.length
    ? list.map((a) => card(a)).join()
    : `<div class="empty-card"><div class="empty-icon">🎨</div><h3>No artwork found</h3><p>Try another search.</p></div>`;
}
function renderHome() {
  document.getElementById("featuredGrid").innerHTML = arts
    .slice(0, 5)
    .map((a) => card(a))
    .join("");
}
function renderDashboard() {
  document.getElementById("welcomeUser").textContent =
    "Welcome, " + (user?.name || "Guest");
  let mine = user ? arts.filter((a) => a.artist === user.name) : [];
  document.getElementById("dashboardGrid").innerHTML = mine.length
    ? mine.map((a) => card(a, true)).join("")
    : `<div class="empty-card"><div class="empty-icon">♢</div><h3>Your gallery is empty</h3><p>Login and upload your first artwork.</p><button class="btn" onclick="showPage('upload')">Upload Artwork</button></div>`;
}
function searchArt(q) {
  q = q.toLowerCase().trim();
  let list = arts.filter((a) =>
    (a.title + " " + a.artist + " " + a.category + " " + a.description)
      .toLowerCase()
      .includes(q),
  );
  renderGallery(list);
  if (
    !document.getElementById("gallery").classList.contains("hidden") &&
    q === ""
  )
    renderGallery(arts);
}
function openArtwork(id) {
  currentId = id;
  let a = arts.find((x) => x.id === id);
  if (!a) return;
  document.getElementById("detailImg").src = a.image;
  document.getElementById("detailTitle").textContent = a.title;
  document.getElementById("detailDesc").textContent = a.description;
  document.getElementById("detailArtist").textContent = a.artist;
  document.getElementById("detailLikes").textContent = a.likes || 0;
  currentArtist = a.artist;
  showPage("detail");
}
function likeCurrent() {
  let a = arts.find((x) => x.id === currentId);
  if (a) {
    a.likes = (a.likes || 0) + 1;
    save();
    document.getElementById("detailLikes").textContent = a.likes;
    renderHome();
    toast("Artwork liked.");
  }
}
function login(e) {
  e.preventDefault();
  user = {
    name: document.getElementById("loginName").value.trim(),
    email: document.getElementById("loginEmail").value.trim(),
  };
  localStorage.setItem("artgallery_user", JSON.stringify(user));
  toast("Logged in as " + user.name);
  showPage("dashboard");
}
function uploadArtwork(e) {
  e.preventDefault();
  if (!user) {
    toast("Please login first.");
    showPage("login");
    return;
  }
  const f = document.getElementById("artImage").files[0];
  if (!f) return;
  if (f.size > 5 * 1024 * 1024) {
    toast("Image must be under 5 MB.");
    return;
  }
  const reader = new FileReader();
  reader.onload = () => {
    arts.unshift({
      id: Date.now(),
      title: document.getElementById("artTitle").value.trim(),
      category: document.getElementById("artCategory").value,
      description: document.getElementById("artDescription").value.trim(),
      artist: user.name,
      likes: 0,
      image: reader.result,
    });
    save();
    renderHome();
    e.target.reset();
    toast("Artwork published.");
    showPage("dashboard");
  };
  reader.readAsDataURL(f);
}
function deleteArt(id) {
  if (!confirm("Are you sure you want to delete this artwork?")) return;
  arts = arts.filter((a) => a.id !== id);
  save();
  renderDashboard();
  renderHome();
  toast("Artwork deleted.");
}
function messageCurrent() {
  if (!user) {
    toast("Please login first.");
    showPage("login");
    return;
  }
  document.getElementById("modalArtist").textContent = "To: " + currentArtist;
  document.getElementById("messageText").value = "";
  document.getElementById("modal").classList.remove("hidden");
}
function closeModal() {
  document.getElementById("modal").classList.add("hidden");
}
function sendMessage() {
  let t = document.getElementById("messageText").value.trim();
  if (!t) {
    toast("Write a message first.");
    return;
  }
  let msgs = JSON.parse(localStorage.getItem("artgallery_messages") || "[]");
  msgs.push({
    from: user.name,
    to: currentArtist,
    message: t,
    time: new Date().toLocaleString(),
  });
  localStorage.setItem("artgallery_messages", JSON.stringify(msgs));
  closeModal();
  toast("Message sent.");
}
function renderMessages() {
  let msgs = JSON.parse(localStorage.getItem("artgallery_messages") || "[]");
  document.getElementById("messagesList").innerHTML = msgs.length
    ? msgs
        .map(
          (m) =>
            `<div class="message"><b>${esc(m.from)} → ${esc(m.to)}</b><p>${esc(m.message)}</p><small>${esc(m.time)}</small></div>`,
        )
        .join("")
    : `<div class="empty-card"><div class="empty-icon">💬</div><h3>No messages</h3><p>Open an artwork and message its artist.</p></div>`;
}
function toast(t) {
  let x = document.getElementById("toast");
  x.textContent = t;
  x.classList.remove("hidden");
  clearTimeout(window.tt);
  window.tt = setTimeout(() => x.classList.add("hidden"), 2200);
}
document
  .querySelectorAll(".main-nav a")
  .forEach((a) => a.addEventListener("click", () => showPage(a.dataset.page)));
renderHome();
renderGallery(arts);
