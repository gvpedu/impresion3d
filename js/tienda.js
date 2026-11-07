const CART_KEY = "gvp-cart-v1";

const state = {
  filter: "todos",
  productId: null,
  color: "negro",
};

const productDialog = document.querySelector("#product-dialog");
const cartDialog = document.querySelector("#cart-dialog");

function money(value) {
  return new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: "PEN",
    minimumFractionDigits: 2,
  }).format(value);
}

function round2(value) {
  return Math.round(value * 100) / 100;
}

function esc(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  }[char]));
}

function productById(id) {
  return PRODUCTS.find((item) => item.id === id);
}

function colorById(id) {
  return COLORS.find((item) => item.id === id) || COLORS[1];
}

function minOf(product) {
  return product && product.minOrder > 1 ? product.minOrder : 1;
}

function clampQty(value, minimum = 1) {
  const number = Math.round(Number(value));
  if (!Number.isFinite(number)) return minimum;
  return Math.min(500, Math.max(minimum, number));
}

function pricing(product, qty) {
  if (product.price == null) return { unit: null, total: null };
  return { unit: product.price, total: round2(product.price * qty) };
}

function loadCart() {
  try {
    const raw = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
    if (!Array.isArray(raw)) return [];
    return raw.filter((item) => productById(item.id) && colorById(item.color) && item.qty > 0).map((item) => {
      const product = productById(item.id);
      const qty = clampQty(item.qty, minOf(product));
      return { ...item, qty };
    });
  } catch {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  renderCart(cart);
}

function cartKey(item) {
  return `${item.id}|${item.color}|${(item.note || "").trim()}`;
}

function addToCart(item) {
  const product = productById(item.id);
  const cart = loadCart();
  const key = cartKey(item);
  const found = cart.find((line) => line.key === key);
  const qty = clampQty(item.qty, minOf(product));
  if (found) found.qty = clampQty(found.qty + qty, minOf(product));
  else cart.push({ ...item, key, qty, note: (item.note || "").trim() });
  saveCart(cart);
  toast(product.price == null ? "Agregado para cotizar" : "Agregado al carrito");
}

function renderFilters() {
  document.querySelector("#filters").innerHTML = FILTERS.map((filter) => `
    <button class="chip" type="button" data-filter="${filter.id}" aria-pressed="${filter.id === state.filter}">
      ${esc(filter.label)}
    </button>
  `).join("");
}

function renderCatalog() {
  const list = PRODUCTS.filter((item) => state.filter === "todos" || item.category === state.filter);
  document.querySelector("#grid").innerHTML = list.map((item) => {
    const price = item.price == null
      ? "A cotizar"
      : money(item.price);
    const detail = item.cardNote === false
      ? ""
      : item.price == null
        ? "Se confirma por WhatsApp"
        : item.minOrder > 1
          ? `Mínimo ${item.minOrder} u. · ${item.size}`
          : item.size;
    const action = item.price == null ? "Cotizar" : "Agregar";
    return `
      <article class="card">
        <button class="card-media" type="button" data-open="${item.id}">
          <img src="${esc(item.image)}" alt="${esc(item.imageAlt)}">
          <span class="tag">${esc(item.categoryLabel)}</span>
        </button>
        <div class="card-body">
          <h3>${esc(item.name)}</h3>
          <p class="summary">${esc(item.summary)}</p>
          <div class="price-row">
            <p class="price">${price}${detail ? `<small>${esc(detail)}</small>` : ""}</p>
            <button class="add" type="button" data-add="${item.id}">${action}</button>
          </div>
        </div>
      </article>
    `;
  }).join("");
}

function renderOffers() {
  const rows = PRODUCTS.map((item) => `
    <tr>
      <td>${esc(item.name)}</td>
      <td>${esc(item.size || "—")}</td>
      <td>${item.price == null ? "A cotizar" : money(item.price)}</td>
      <td>${item.minOrder > 1 ? `${item.minOrder} unidades` : "1 unidad"}</td>
    </tr>
  `).join("");
  document.querySelector("#offer-table").innerHTML = `
    <table class="offer-table">
      <thead>
        <tr><th>Pieza</th><th>Medida</th><th>Precio</th><th>Pedido mínimo</th></tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  `;
}

function currentQty() {
  const product = productById(state.productId);
  return clampQty(document.querySelector("#pd-qty").value, minOf(product));
}

function refreshProductPrice() {
  const product = productById(state.productId);
  if (!product) return;
  const qty = currentQty();
  const input = document.querySelector("#pd-qty");
  input.value = qty;
  input.min = String(minOf(product));
  const price = pricing(product, qty);
  const upsell = document.querySelector("#pd-upsell");
  const quote = document.querySelector("#pd-quote");
  const add = document.querySelector("#pd-add");
  if (price.unit == null) {
    document.querySelector("#pd-price").innerHTML = "A cotizar<small>Según tamaño y detalle</small>";
    upsell.hidden = true;
    quote.hidden = false;
    quote.textContent = "Esta pieza no tiene precio fijo en la lista. La agregamos al pedido y el monto se confirma por WhatsApp.";
    add.textContent = "Agregar para cotizar";
    return;
  }
  document.querySelector("#pd-price").innerHTML = `${money(price.total)}<small>${qty} × ${money(price.unit)}</small>`;
  quote.hidden = true;
  add.textContent = "Agregar al carrito";
  if (product.minOrder > 1) {
    upsell.hidden = false;
    upsell.textContent = `Pedido mínimo: ${product.minOrder} unidades. El precio de lista es ${money(product.price)} por unidad.`;
  } else {
    upsell.hidden = false;
    upsell.textContent = `Precio de lista: ${money(product.price)} por unidad. ${product.size}.`;
  }
}

function openProduct(id) {
  const product = productById(id);
  state.productId = id;
  state.color = "negro";
  document.querySelector("#pd-img").src = product.image;
  document.querySelector("#pd-img").alt = product.imageAlt;
  document.querySelector("#pd-cat").textContent = product.categoryLabel;
  document.querySelector("#pd-title").textContent = product.name;
  document.querySelector("#pd-desc").textContent = product.description;
  document.querySelector("#pd-note").value = "";
  document.querySelector("#pd-qty").value = minOf(product);
  document.querySelector("#pd-colors").innerHTML = COLORS.map((color) => `
    <button class="swatch ${color.id === "negro" ? "is-on" : ""}" type="button" data-color="${color.id}" aria-pressed="${color.id === "negro"}">
      <span class="dot" style="background:${color.hex}"></span>${esc(color.name)}
    </button>
  `).join("");
  refreshProductPrice();
  document.body.classList.add("lock");
  productDialog.showModal();
}

function renderCart(cart = loadCart()) {
  const count = cart.reduce((sum, item) => sum + item.qty, 0);
  for (const badge of document.querySelectorAll("#cart-count, #cart-count-mobile")) {
    badge.hidden = count === 0;
    badge.textContent = String(count);
  }
  for (const button of document.querySelectorAll("#open-cart, #open-cart-mobile")) {
    button.setAttribute("aria-label", count ? `Abrir carrito, ${count} unidades` : "Abrir carrito");
  }

  const box = document.querySelector("#cart-items");
  if (!cart.length) {
    box.innerHTML = `
      <div class="empty">
        <p>El carrito está vacío.</p>
        <button class="btn btn-ink" type="button" data-goto-catalog>Ver catálogo</button>
      </div>
    `;
  } else {
    box.innerHTML = cart.map((item) => {
      const product = productById(item.id);
      const price = pricing(product, item.qty);
      const color = colorById(item.color);
      return `
        <article class="cart-item">
          <img src="${esc(product.image)}" alt="">
          <div>
            <h3>${esc(product.name)}</h3>
            <p class="muted">${esc(color.name)}${item.note ? ` · ${esc(item.note)}` : ""}</p>
            <div class="cart-line">
              <div class="stepper">
                <button type="button" data-step="-1" data-key="${esc(item.key)}" aria-label="Reducir">−</button>
                <span style="min-width:32px;text-align:center;font-weight:800">${item.qty}</span>
                <button type="button" data-step="1" data-key="${esc(item.key)}" aria-label="Aumentar">+</button>
              </div>
              <strong>${price.total == null ? "A cotizar" : money(price.total)}</strong>
            </div>
            <p class="muted">${price.unit == null ? "Se confirma por WhatsApp" : `${money(price.unit)} c/u`}</p>
            <button class="remove" type="button" data-remove="${esc(item.key)}">Quitar</button>
          </div>
        </article>
      `;
    }).join("");
  }

  let total = 0;
  let quoted = false;
  for (const item of cart) {
    const product = productById(item.id);
    const price = pricing(product, item.qty);
    if (price.total == null) quoted = true;
    else total += price.total;
  }
  document.querySelector("#cart-total").textContent = money(round2(total));
  document.querySelector("#cart-total-label").textContent = quoted ? "Total con precio" : "Total";
  document.querySelector("#cart-savings").hidden = true;
  document.querySelector("#cart-quote").hidden = !quoted;
  document.querySelector("#checkout").disabled = cart.length === 0;
}

function buildMessage(cart) {
  const lines = ["Hola, Grupo Visión Publicidad. Quiero este pedido de impresión 3D en PLA:", ""];
  let total = 0;
  cart.forEach((item, index) => {
    const product = productById(item.id);
    const price = pricing(product, item.qty);
    lines.push(`${index + 1}. ${product.name}`);
    lines.push(`Color: ${colorById(item.color).name}`);
    lines.push(`Cantidad: ${item.qty}`);
    if (product.size) lines.push(`Medida: ${product.size}`);
    if (item.note) lines.push(`Detalle: ${item.note}`);
    if (price.unit == null) {
      lines.push("Precio: a cotizar por WhatsApp");
    } else {
      total += price.total;
      lines.push(`Precio unitario: ${money(price.unit)}`);
      lines.push(`Subtotal: ${money(price.total)}`);
    }
    lines.push("");
  });
  lines.push(`Total de piezas con precio: ${money(round2(total))}`);
  lines.push("");
  lines.push("Material: plástico PLA.");
  lines.push("Colores disponibles: celeste, negro y gris.");
  return lines.join("\n");
}

function openCart() {
  renderCart();
  document.body.classList.add("lock", "cart-open");
  cartDialog.showModal();
}

function closeMenus() {
  document.querySelector("#mobile-menu").classList.remove("open");
  document.querySelector("#menu-btn").setAttribute("aria-expanded", "false");
}

let toastTimer;
function toast(message) {
  const element = document.querySelector("#toast");
  element.textContent = message;
  element.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => element.classList.remove("show"), 2200);
}

document.querySelector("#filters").addEventListener("click", (event) => {
  const button = event.target.closest("[data-filter]");
  if (!button) return;
  state.filter = button.dataset.filter;
  renderFilters();
  renderCatalog();
});

document.querySelector("#grid").addEventListener("click", (event) => {
  const open = event.target.closest("[data-open]");
  const add = event.target.closest("[data-add]");
  if (open) openProduct(open.dataset.open);
  if (add) {
    const product = productById(add.dataset.add);
    addToCart({ id: product.id, color: "negro", note: "", qty: minOf(product) });
  }
});

document.querySelector("#pd-colors").addEventListener("click", (event) => {
  const button = event.target.closest("[data-color]");
  if (!button) return;
  state.color = button.dataset.color;
  for (const swatch of document.querySelectorAll("#pd-colors .swatch")) {
    const on = swatch.dataset.color === state.color;
    swatch.classList.toggle("is-on", on);
    swatch.setAttribute("aria-pressed", String(on));
  }
});

document.querySelector("#pd-minus").addEventListener("click", () => {
  document.querySelector("#pd-qty").value = currentQty() - 1;
  refreshProductPrice();
});
document.querySelector("#pd-plus").addEventListener("click", () => {
  document.querySelector("#pd-qty").value = currentQty() + 1;
  refreshProductPrice();
});
document.querySelector("#pd-qty").addEventListener("input", refreshProductPrice);
document.querySelector("#pd-add").addEventListener("click", () => {
  addToCart({
    id: state.productId,
    color: state.color,
    note: document.querySelector("#pd-note").value,
    qty: currentQty(),
  });
  productDialog.close();
});

document.querySelector("#cart-items").addEventListener("click", (event) => {
  if (event.target.closest("[data-goto-catalog]")) {
    cartDialog.close();
    document.querySelector("#catalogo").scrollIntoView({ behavior: "smooth" });
    return;
  }
  const step = event.target.closest("[data-step]");
  const remove = event.target.closest("[data-remove]");
  const cart = loadCart();
  if (step) {
    const line = cart.find((item) => item.key === step.dataset.key);
    if (!line) return;
    const next = line.qty + Number(step.dataset.step);
    const minimum = minOf(productById(line.id));
    if (next < minimum) saveCart(cart.filter((item) => item.key !== line.key));
    else {
      line.qty = clampQty(next, minimum);
      saveCart(cart);
    }
  }
  if (remove) saveCart(cart.filter((item) => item.key !== remove.dataset.remove));
});

function openWhatsApp(text) {
  const message = text || "Hola, Grupo Visión Publicidad. Quiero información sobre impresión 3D en PLA.";
  const web = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  if (/Android/i.test(navigator.userAgent)) {
    const intent = `intent://send?phone=${WHATSAPP_NUMBER}&text=${encodeURIComponent(message)}#Intent;scheme=whatsapp;S.browser_fallback_url=${encodeURIComponent(web)};end`;
    window.location.href = intent;
    return;
  }
  window.open(web, "_blank", "noopener");
}

document.addEventListener("click", (event) => {
  const link = event.target.closest("a[href*='wa.me']");
  if (!link) return;
  event.preventDefault();
  const text = new URL(link.href).searchParams.get("text");
  openWhatsApp(text);
});

document.querySelector("#checkout").addEventListener("click", () => {
  const cart = loadCart();
  if (!cart.length) return;
  openWhatsApp(buildMessage(cart));
});

for (const id of ["#open-cart", "#open-cart-mobile"]) {
  document.querySelector(id).addEventListener("click", openCart);
}

document.querySelector("#menu-btn").addEventListener("click", () => {
  const menu = document.querySelector("#mobile-menu");
  const open = menu.classList.toggle("open");
  document.querySelector("#menu-btn").setAttribute("aria-expanded", String(open));
});
document.querySelector("#mobile-menu").addEventListener("click", (event) => {
  if (event.target.closest("a")) closeMenus();
});

for (const dialog of [productDialog, cartDialog]) {
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog || event.target.closest("[data-close]")) dialog.close();
  });
  dialog.addEventListener("close", () => {
    document.body.classList.remove("lock", "cart-open");
  });
}

renderFilters();
renderCatalog();
renderCart();

(function () {
  const gallery = document.querySelector("#hero-gallery");
  if (!gallery || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const movers = [...gallery.querySelectorAll(".mover")];
  let raf = 0;
  let px = 0;
  let py = 0;
  let tx = 0;
  let ty = 0;

  function frame() {
    px += (tx - px) * 0.08;
    py += (ty - py) * 0.08;
    for (const el of movers) {
      const depth = Number(el.dataset.depth) || 0;
      el.style.transform = "translate3d(" + (px * depth).toFixed(2) + "px, " + (py * depth).toFixed(2) + "px, 0)";
    }
    if (Math.abs(tx - px) > 0.02 || Math.abs(ty - py) > 0.02) raf = requestAnimationFrame(frame);
    else raf = 0;
  }

  function aim(x, y) {
    tx = x;
    ty = y;
    if (!raf) raf = requestAnimationFrame(frame);
  }

  gallery.addEventListener("pointermove", (event) => {
    const box = gallery.getBoundingClientRect();
    aim((event.clientX - box.left) / box.width - 0.5, (event.clientY - box.top) / box.height - 0.5);
  });
  gallery.addEventListener("pointerleave", () => aim(0, 0));
})();

(function () {
  const slides = [...document.querySelectorAll(".hero-cover")];
  if (slides.length < 2) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  let index = 0;
  setInterval(() => {
    slides[index].classList.remove("is-on");
    index = (index + 1) % slides.length;
    slides[index].classList.add("is-on");
  }, 6500);
})();
