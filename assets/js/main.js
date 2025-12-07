// Datos de productos (Simulando base de datos)
const products = [
    {
        id: 1,
        name: "Parka Técnica Bourne",
        price: 129.00,
        image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=736&auto=format&fit=crop",
        sizes: ["S", "M", "L", "XL"]
    },
    {
        id: 2,
        name: "Jersey Oversize Negro",
        price: 59.90,
        image: "https://images.unsplash.com/photo-1572495641004-28421ae52e52?q=80&w=687&auto=format&fit=crop",
        sizes: ["XS", "S", "M"]
    },
    {
        id: 3,
        name: "Jeans Flare Dark",
        price: 59.99,
        image: "https://images.unsplash.com/photo-1542272617-08f086303294?q=80&w=687&auto=format&fit=crop",
        sizes: ["30", "32", "34", "36"]
    },
    {
        id: 4,
        name: "Chaqueta Mixta",
        price: 89.00,
        image: "https://images.unsplash.com/photo-1551028919-ac7d21422db7?q=80&w=689&auto=format&fit=crop",
        sizes: ["S", "M", "L"]
    }
];

// Estado del carrito
let cart = [];

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    updateCartUI();
});

// Renderizar Productos
function renderProducts() {
    const grid = document.getElementById('product-grid');
    grid.innerHTML = products.map(product => `
        <div class="product-card">
            <div class="product-image-wrapper">
                <img src="${product.image}" alt="${product.name}" class="product-img">
                
                <div class="product-actions">
                    <div class="size-selector" id="sizes-${product.id}">
                        ${product.sizes.map(size => `
                            <button class="size-btn" onclick="selectSize(${product.id}, '${size}', this)">${size}</button>
                        `).join('')}
                    </div>
                    <button class="btn-add-cart" onclick="addToCart(${product.id})">AÑADIR AL CARRITO</button>
                </div>
            </div>
            
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-price">${product.price.toFixed(2)} €</p>
            </div>
        </div>
    `).join('');
}

// Variables temporales para la selección de talla
let selectedSizes = {};

function selectSize(productId, size, btnElement) {
    // Guardar selección
    selectedSizes[productId] = size;
    
    // Actualizar UI visualmente
    const container = document.getElementById(`sizes-${productId}`);
    const buttons = container.getElementsByClassName('size-btn');
    
    Array.from(buttons).forEach(btn => btn.classList.remove('selected'));
    btnElement.classList.add('selected');
}

function addToCart(productId) {
    const size = selectedSizes[productId];
    
    if (!size) {
        alert("Por favor, selecciona una talla primero.");
        return;
    }

    const product = products.find(p => p.id === productId);
    
    // Verificar si ya existe en el carrito
    const existingItem = cart.find(item => item.id === productId && item.size === size);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            ...product,
            size: size,
            quantity: 1
        });
    }

    updateCartUI();
    toggleCart(true); // Abrir carrito automáticamente
}

// Funciones del Carrito UI
function updateCartUI() {
    // Actualizar contador
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    document.getElementById('cart-count').innerText = count;

    // Actualizar lista
    const itemsContainer = document.getElementById('cart-items');
    
    if (cart.length === 0) {
        itemsContainer.innerHTML = '<p class="empty-msg" style="color: #666; text-align: center; margin-top: 20px;">Tu carrito está vacío.</p>';
    } else {
        itemsContainer.innerHTML = cart.map(item => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <span>Talla: ${item.size}</span>
                    <span>${item.quantity} x ${item.price.toFixed(2)} €</span>
                </div>
            </div>
        `).join('');
    }

    // Actualizar total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    document.getElementById('cart-total').innerText = total.toFixed(2) + ' €';
}

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
