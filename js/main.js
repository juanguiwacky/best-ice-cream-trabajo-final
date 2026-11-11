// ==========================================================================
// Base de Datos de Productos
// ==========================================================================
const products = [
    { id: 1, name: "Pastel Hawaiano", category: "especiales", price: 4800, desc: "Pastel horneado de la casa con delicioso relleno hawaiano.", image: "img/hawai.jpg", star: true },
    { id: 2, name: "Pastel de Arequipe", category: "especiales", price: 4000, desc: "Pastel horneado hojaldrado relleno de dulce arequipe tradicional.", image: "img/areques.jpeg", star: false },
    { id: 3, name: "Pastel Arequipe Queso", category: "especiales", price: 4900, desc: "Combinación perfecta de arequipe cremoso y queso salado.", image: "img/parequipe.jpeg", star: false },
    { id: 4, name: "Pastel de Queso", category: "especiales", price: 4000, desc: "Pastel de textura suave con abundante queso horneado.", image: "img/pqueso.jpg", star: false },
    { id: 5, name: "Pastel Jamón Queso", category: "especiales", price: 4500, desc: "Clásico pastel hojaldrado relleno de jamón y queso derretido.", image: "img/pjamque.jpeg", star: false },
    { id: 6, name: "Torta de Chocolate", category: "especiales", price: 4500, desc: "Porción de torta húmeda de chocolate artesanal.", image: "img/chocolate.jpeg", star: false },
    { id: 7, name: "Torta Tres Leches", category: "especiales", price: 4500, desc: "Esponjosa torta bañada en mezcla de tres leches y cubierta cremosa.", image: "img/tresleches.jpeg", star: false },
    { id: 8, name: "Copa Queso", category: "copas", price: 14000, desc: "2 sabores de helado a elección, acompañado de abundante queso y crema chantilly.", image: "img/copa queso.jpeg", star: false },
    { id: 9, name: "Copa Hacienda", category: "copas", price: 17500, desc: "3 sabores de helado, galleta Oreo, barquillo crujiente y crema chantilly.", image: "img/copahaciena.jpg", star: true },
    { id: 10, name: "Copa Durazno", category: "copas", price: 14000, desc: "2 sabores de helado, trozos de durazno dulce en almíbar y crema chantilly.", image: "img/durazno.jpeg", star: false },
    { id: 11, name: "Waffle con Helado", category: "copas", price: 12000, desc: "Waffle caliente, 1 sabor de helado a elección, salsa de chocolate caliente y fresas frescas.", image: "img/waflehelado.jpeg", star: false },
    { id: 12, name: "Brownie con Helado", category: "copas", price: 16000, desc: "Brownie caliente de la casa, 2 sabores de helado, salsa de chocolate, fresas frescas y barquillo.", image: "img/browine.jpeg", star: true },
    { id: 13, name: "Malteada Gourmet (16 oz)", category: "malteadas", price: 11000, desc: "Cremosa malteada batida al instante, decorada con crema batida y galleta de topping.", image: "img/malteada.jpeg", star: false },
    { id: 14, name: "Cono Sencillo", category: "helados", price: 5000, desc: "1 sabor de helado artesanal servido en cucurucho crujiente.", image: "img/csencillo.jpeg", star: false },
    { id: 15, name: "Cono Doble", category: "helados", price: 7000, desc: "2 sabores de helado artesanal servidos en cucurucho crujiente.", image: "img/cono doble.jpeg", star: false }
];

let cart = [];

// Selección DOM basada en los IDs exactos de tu HTML
const menuContainer = document.getElementById('menuContainer');
const cartModal = document.getElementById('cartModal');
const overlay = document.getElementById('overlay');
const openCartBtn = document.getElementById('openCart');
const closeCartBtn = document.getElementById('closeCart');
const cartItemsContainer = document.getElementById('cartItems');
const cartCountEl = document.getElementById('cartCount');
const cartTotalEl = document.getElementById('cartTotal');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
const navItems = document.querySelectorAll('#navLinks a');
const sendOrderBtn = document.getElementById('sendOrderBtn');

// Renderizar Menú
function renderMenu(category = 'todos') {
    if (!menuContainer) return;
    menuContainer.innerHTML = '';

    const filteredProducts = category === 'todos' 
        ? products 
        : products.filter(p => p.category === category);

    filteredProducts.forEach(product => {
        const card = document.createElement('div');
        card.className = 'menu-card';
        card.innerHTML = `
            ${product.star ? '<span class="badge-star"><i class="fa-solid fa-star"></i> Destacado</span>' : ''}
            <img src="${product.image}" alt="${product.name}" class="menu-card-img" onerror="this.src='https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=500&q=80'">
            <div class="menu-card-body">
                <h3 class="menu-card-title">${product.name}</h3>
                <p class="menu-card-desc">${product.desc}</p>
                <div class="menu-card-footer">
                    <span class="price">$${product.price.toLocaleString('es-CO')} COP</span>
                    <button class="btn-add" onclick="addToCart(${product.id})" title="Agregar al pedido">
                        <i class="fa-solid fa-plus"></i>
                    </button>
                </div>
            </div>
        `;
        menuContainer.appendChild(card);
    });
}

// Filtros por pestañas
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderMenu(btn.dataset.category);
    });
});

// Lógica de Carrito
function addToCart(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;

    const existingItem = cart.find(item => item.id === id);
    if (existingItem) {
        existingItem.qty += 1;
    } else {
        cart.push({ ...product, qty: 1 });
    }
    updateCart();
    openCart();
}

function changeQty(id, delta) {
    const item = cart.find(i => i.id === id);
    if (item) {
        item.qty += delta;
        if (item.qty <= 0) {
            cart = cart.filter(i => i.id !== id);
        }
    }
    updateCart();
}

function updateCart() {
    if (cartCountEl) {
        const totalCount = cart.reduce((sum, i) => sum + i.qty, 0);
        cartCountEl.textContent = totalCount;
    }

    if (cartTotalEl) {
        const totalMoney = cart.reduce((sum, i) => sum + (i.price * i.qty), 0);
        cartTotalEl.textContent = `$${totalMoney.toLocaleString('es-CO')} COP`;
    }

    if (!cartItemsContainer) return;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="text-center" style="color: var(--text-muted); margin-top: 30px;">Tu carrito está vacío.<br>¡Elige algo delicioso del menú!</p>';
        return;
    }

    cartItemsContainer.innerHTML = '';
    cart.forEach(item => {
        const el = document.createElement('div');
        el.className = 'cart-item';
        const subtotal = item.price * item.qty;
        el.innerHTML = `
            <div>
                <div class="cart-item-title">${item.name}</div>
                <div class="cart-item-price">$${subtotal.toLocaleString('es-CO')} COP</div>
            </div>
            <div class="cart-item-qty">
                <button class="qty-btn" onclick="changeQty(${item.id}, -1)">-</button>
                <span>${item.qty}</span>
                <button class="qty-btn" onclick="changeQty(${item.id}, 1)">+</button>
            </div>
        `;
        cartItemsContainer.appendChild(el);
    });
}

function openCart() {
    if (cartModal) cartModal.classList.add('open');
    if (overlay) overlay.classList.add('active');
}

function closeCart() {
    if (cartModal) cartModal.classList.remove('open');
    if (overlay) overlay.classList.remove('active');
}

if (openCartBtn) openCartBtn.addEventListener('click', openCart);
if (closeCartBtn) closeCartBtn.addEventListener('click', closeCart);

if (overlay) {
    overlay.addEventListener('click', () => {
        closeCart();
        if (navLinks) navLinks.classList.remove('active');
    });
}

// Menú Hamburguesa Móvil
if (hamburger && navLinks) {
    hamburger.addEventListener('click', (e) => {
        e.stopPropagation();
        navLinks.classList.toggle('active');
        if (overlay) overlay.classList.toggle('active');
    });
}


// Cerrar el menú automáticamente al tocar cualquier opción y permitir navegar
if (navLinks) {
    const navItems = document.querySelectorAll('.nav-links a');
    navItems.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            if (overlay) overlay.classList.remove('active');
        });
    });
}
// Envío a WhatsApp optimizado para móviles
// Envío a WhatsApp optimizado para móviles
if (sendOrderBtn) {
    sendOrderBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            alert('Tu carrito está vacío. Agrega productos antes de realizar el pedido.');
            return;
        }

        let lines = [];
        lines.push("¡Hola! Quisiera realizar el siguiente pedido a domicilio en Hacienda Niquía:");
        lines.push("");

        cart.forEach(item => {
            const subtotal = item.price * item.qty;
            lines.push(`- ${item.qty} x ${item.name} ($${subtotal.toLocaleString('es-CO')} COP)`);
        });

        const total = cart.reduce((sum, i) => sum + (i.price * i.qty), 0);
        lines.push("");
        lines.push(`Total Estimado: $${total.toLocaleString('es-CO')} COP`);
        lines.push("");
        lines.push("Dirección / Unidad Residencial: ");

        let fullMessage = lines.join("\n");
        let encodedMsg = encodeURIComponent(fullMessage);
        
        window.open(`https://wa.me/573146151822?text=${encodedMsg}`, '_blank');
    });
}