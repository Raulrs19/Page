// --- DATOS DE PRODUCTOS (Simulando tu base de datos SQL para el Frontend) ---
const products = [
    {
        id: 1,
        name: "Parka Técnica",
        price: 129.00,
        image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=736&auto=format&fit=crop", // Placeholder
        sizes: ["S", "M", "L", "XL"]
    },
    {
        id: 2,
        name: "Jersey Oversize",
        price: 59.90,
        image: "https://images.unsplash.com/photo-1572495641004-28421ae52e52?q=80&w=687&auto=format&fit=crop", // Placeholder
        sizes: ["XS", "S", "M", "L"]
    },
    {
        id: 3,
        name: "Jeans Flare",
        price: 59.99,
        image: "https://images.unsplash.com/photo-1542272617-08f086303294?q=80&w=687&auto=format&fit=crop", // Placeholder
        sizes: ["28", "30", "32", "34"]
    },
    {
        id: 4,
        name: "Chaqueta Mixta",
        price: 89.00,
        image: "https://images.unsplash.com/photo-1551028919-ac7d21422db7?q=80&w=689&auto=format&fit=crop", // Placeholder
        sizes: ["S", "M", "L", "XL"]
    },
    {
        id: 5,
        name: "Vestido Midi",
        price: 79.00,
        image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=683&auto=format&fit=crop", // Placeholder
        sizes: ["XS", "S", "M"]
    },
    {
        id: 6,
        name: "Sudadera Capucha",
        price: 49.90,
        image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=1170&auto=format&fit=crop", // Placeholder
        sizes: ["S", "M", "L", "XL"]
    }
];

// Estado del Carrito y Selección
let cart = JSON.parse(localStorage.getItem('vourne-cart')) || [];
let selectedSizes = {}; // Almacena temporalmente la talla seleccionada por ID de producto

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    updateCartUI();
});

// 1. RENDERIZAR PRODUCTOS EN EL GRID
function renderProducts() {
    const grid = document.getElementById('product-grid');
    
    grid.innerHTML = products.map(product => `
        <div class="product-card">
            <div class="image-container">
                <img src="${product.image}" alt="${product.name}" class="product-img">
                
                <div class="hover-overlay">
                    <span class="size-label">Seleccionar Talla</span>
                    <div class="size-options" id="sizes-${product.id}">
                        ${product.sizes.map(size => `
                            <button class="size-btn" 
                                onclick="selectSize(event, ${product.id}, '${size}')">
                                ${size}
                            </button>
                        `).join('')}
                    </div>
                    <button class="add-btn" onclick="addToCart(${product.id})">
                        AÑADIR - ${product.price.toFixed(2)} €
                    </button>
                </div>
            </div>

            <div class="product-info-static">
                <span class="product-name">${product.name}</span>
                <span class="product-price">${product.price.toFixed(2)} €</span>
            </div>
        </div>
    `).join('');
}

// 2. LÓGICA DE SELECCIÓN DE TALLA
function selectSize(e, productId, size) {
    // Evita que el click se propague a elementos padres si fuera necesario
    if(e) e.stopPropagation();

    // Guardar selección
    selectedSizes[productId] = size;

    // Actualizar visualmente los botones
    const container = document.getElementById(`sizes-${productId}`);
    const buttons = container.getElementsByClassName('size-btn');
    
    // Quitar clase active de todos y poner al seleccionado
    Array.from(buttons).forEach(btn => {
        btn.classList.remove('active');
        if (btn.innerText === size) {
            btn.classList.add('active');
        }
    });
}

// 3. AÑADIR AL CARRITO
function addToCart(productId) {
    const size = selectedSizes[productId];

    if (!size) {
        alert("Por favor, selecciona una talla primero.");
        return;
    }

    const product = products.find(p => p.id === productId);

    // Buscar si ya existe este producto con esa talla en el carrito
    const existingItem = cart.find(item => item.id === productId && item.size === size);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            size: size,
            quantity: 1
        });
    }

    // Guardar y actualizar UI
    saveCart();
    updateCartUI();
    toggleCart(true); // Abrir el carrito para mostrar confirmación
}

// 4. GESTIÓN DEL CARRITO (UI y Lógica)
function updateCartUI() {
    const cartCount = document.getElementById('cart-count');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');

    // Actualizar contador
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.innerText = totalItems;

    // Calcular precio total
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.innerText = totalPrice.toFixed(2) + ' €';

    // Renderizar lista
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-msg">Tu carrito está vacío.</p>';
    } else {
        cartItemsContainer.innerHTML = cart.map((item, index) => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <p>Talla: ${item.size}</p>
                    <p>${item.quantity} x ${item.price.toFixed(2)} €</p>
                </div>
                <button class="close-cart" style="font-size:14px; margin-left:auto;" onclick="removeFromCart(${index})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');
    }
}

function removeFromCart(index) {
    cart.splice(index, 1);
    saveCart();
    updateCartUI();
}

function saveCart() {
    localStorage.setItem('vourne-cart', JSON.stringify(cart));
}

// 5. ABRIR/CERRAR SIDEBAR
function toggleCart(forceOpen = false) {
    const sidebar = document.getElementById('cart-sidebar');
    const overlay = document.getElementById('overlay');

    if (forceOpen) {
        sidebar.classList.add('open');
        overlay.classList.add('active');
    } else {
        sidebar.classList.toggle('open');
        overlay.classList.toggle('active');
    }
}
