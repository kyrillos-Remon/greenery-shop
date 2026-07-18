const cartBtn = document.getElementById('cartBtn');
const cartDrawer = document.getElementById('cartDrawer');
const closeCart = document.getElementById('closeCart');
const cartOverlay = document.getElementById('cartOverlay');
const checkoutBtn = document.getElementById('checkoutBtn');

const addButtons = document.querySelectorAll('.add-to-cart-btn');
const cartItemsContainer = document.getElementById('cartItems');
const cartTotalValue = document.getElementById('cartTotalValue');
const cartCountBadge = document.getElementById('cartCount');

let cart = JSON.parse(localStorage.getItem('greenery_cart')) || [];

function toggleCart() {
    cartDrawer.classList.toggle('open');
    cartOverlay.classList.toggle('open');
}

if (cartBtn) cartBtn.addEventListener('click', toggleCart);
if (closeCart) closeCart.addEventListener('click', toggleCart);
if (cartOverlay) cartOverlay.addEventListener('click', toggleCart);

if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
        alert("ℹ️ Portfolio Project Notice:\n\nThis is a frontend demo website built for presentation purposes. Checkout forms, payment integration, and backend ordering are not active on this version.");
    });
}

addButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        const card = e.target.closest('.plant-card');
        const id = card.getAttribute('data-id');
        const name = card.getAttribute('data-name');
        const price = parseFloat(card.getAttribute('data-price'));
        const image = card.querySelector('img').src;

        addToCart(id, name, price, image);
    });
});

function addToCart(id, name, price, image) {
    const existing = cart.find(item => item.id === id);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ id, name, price, image, quantity: 1 });
    }
    saveAndRender();
    toggleCart(); 
}

if (cartItemsContainer) {
    cartItemsContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('remove-btn')) {
            const id = e.target.getAttribute('data-id');
            removeFromCart(id);
        }
    });
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    saveAndRender();
}

function saveAndRender() {
    localStorage.setItem('greenery_cart', JSON.stringify(cart));
    renderCart();
}

function renderCart() {
    if (!cartItemsContainer) return;
    cartItemsContainer.innerHTML = '';

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `<div class="empty-msg">Your shopping bag is empty!</div>`;
        cartTotalValue.innerText = '$0.00';
        cartCountBadge.innerText = '0';
        return;
    }

    let subtotal = 0;
    let count = 0;

    cart.forEach(item => {
        subtotal += item.price * item.quantity;
        count += item.quantity;

        const itemMarkup = `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <p>$${item.price.toFixed(2)} &times; ${item.quantity}</p>
                </div>
                <button class="remove-btn" data-id="${item.id}">Remove</button>
            </div>
        `;
        cartItemsContainer.insertAdjacentHTML('beforeend', itemMarkup);
    });

    cartTotalValue.innerText = `$${subtotal.toFixed(2)}`;
    cartCountBadge.innerText = count;
}

const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');

navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            targetSection.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

const observerOptions = {
    root: null,
    rootMargin: '-50% 0px -50% 0px', 
    threshold: 0
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${id}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}, observerOptions);

sections.forEach(section => observer.observe(section));

const heroBtn = document.querySelector('.scroll-trigger');
if (heroBtn) {
    heroBtn.addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelector('#shop').scrollIntoView({ behavior: 'smooth' });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    renderCart();
});