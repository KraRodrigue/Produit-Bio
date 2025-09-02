const menuToggle = document.getElementById('menuToggle');
const nav = document.getElementById('nav');
const navLinks = document.querySelectorAll('.nav-link');
const logo = document.getElementById('logo');

const Menubeuger = document.querySelector('#nav-beug');
const Navgt = document.querySelector(".nvgt")
const Navgt1 = document.querySelector(".nvgt1")

console.log(Menubeuger, Navgt);

Menubeuger.addEventListener('click', () => {
    Navgt.classList.toggle('nav-menu')
    Navgt1.classList.toggle('nav-menu1')
})

function openMenu() {
    nav.classList.add('active');
    menuToggle.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeMenu() {
    nav.classList.remove('active');
    menuToggle.classList.remove('active');
    document.body.style.overflow = 'auto';
}

if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        if (nav.classList.contains('active')) {
            closeMenu();
        } else {
            openMenu();
        }
    });
}

if (navLinks) {
    navLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });
}

if (logo) {
    logo.addEventListener('click', (e) => {
        if (window.innerWidth <= 768 && nav.classList.contains('active')) {
            e.preventDefault();
            closeMenu();
        }
    });
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav && nav.classList.contains('active')) {
        closeMenu();
    }
});

window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        closeMenu();
    }
});

function toggleHeart(el) {
    el.classList.toggle("liked");
    el.classList.toggle("fa-regular");
    el.classList.toggle("fa-solid");
}

function anne() {
    const message = encodeURIComponent("Bonjour, je souhaite passer une commande")
    const lien = "https://wa.me/+2250576732167" + "?text=" + message
    window.open(lien, "_blank")
}

const Btn = document.querySelector('.btn2')
if (Btn) {
    Btn.addEventListener('click', () => {
        anne()
    })
}

// === GESTION DU PANIER AVEC LOCALSTORAGE ===

let panier = [];
const NUMERO_WHATSAPP = "+2250576732167";

// Charger le panier depuis localStorage au démarrage
function chargerPanier() {
    const panierSauvegarde = localStorage.getItem('panier');
    if (panierSauvegarde) {
        try {
            panier = JSON.parse(panierSauvegarde);
        } catch (e) {
            console.error('Erreur lors du chargement du panier:', e);
            panier = [];
        }
    }
}

// Sauvegarder le panier dans localStorage
function sauvegarderPanier() {
    try {
        localStorage.setItem('panier', JSON.stringify(panier));
    } catch (e) {
        console.error('Erreur lors de la sauvegarde du panier:', e);
    }
}

// Fonction pour ajouter un produit au panier
function ajouterAuPanier(button) {
    const produitDiv = button.closest('.photo');
    
    // Correction: utiliser data-produit-id au lieu de data-product-id
    const id = produitDiv.dataset.produitId || Date.now().toString(); // ID de fallback si pas défini
    
    const nomElement = produitDiv.querySelector('[data-produit-name]') || produitDiv.querySelector('.test');
    const prixElement = produitDiv.querySelector('[data-produit-prix]') || produitDiv.querySelector('.prix');
    const imageElement = produitDiv.querySelector('[data-produit-image]') || produitDiv.querySelector('.img1 img');
    
    if (!nomElement || !prixElement || !imageElement) {
        console.error('Éléments du produit non trouvés');
        return;
    }
    
    const nom = nomElement.textContent.trim();
    const prix = prixElement.textContent.trim();
    const image = imageElement.src;

    // Vérifier si le produit existe déjà dans le panier
    const produitExistant = panier.find(item => item.id === id);
    
    if (produitExistant) {
        produitExistant.quantite += 1;
    } else {
        panier.push({
            id: id,
            nom: nom,
            prix: prix,
            image: image,
            quantite: 1
        });
    }

    // Sauvegarder dans localStorage
    sauvegarderPanier();

    // Animation du bouton
    const textOriginal = button.innerHTML;
    button.textContent = "Ajouté ✓";
    button.classList.add('colorAjouter');
    
    setTimeout(() => {
        button.innerHTML = '<i class="fa-solid fa-cart-plus"></i> Ajouter au panier';
        button.classList.remove('colorAjouter');
    }, 1000);

    mettreAJourPanier();
}



// Fonction pour mettre à jour l'affichage du panier

function mettreAJourPanier() {
    const count = panier.reduce((total, item) => total + item.quantite, 0);
    document.getElementById('cart-count').textContent=count;

    const panierItems = document.getElementById("panier-items");
    

    if (panier.length === 0) {
        panierItems.innerHTML = '<div class="empty-cart">Votre panier est vide</div>';
        const totalElement = document.getElementById('panier-total');
        if (totalElement) {
            totalElement.textContent = 'Total: 0 FCFA';
        }
        return;
    }

    let html = '';
    let total = 0;

    panier.forEach((item, index) => {
        const prixNumerique = parseInt(item.prix.replace(/[^0-9]/g, ''));
        const sousTotal = prixNumerique * item.quantite;
        total += sousTotal;
        
        html += `
            <div class="panier-item">
                <div class="panier-item1">
                    <img src="${item.image}" alt="${item.nom}" style="width: 60px; height: 60px; object-fit: cover;">
                    
                    <div class="quantity-controls">
                        <button class="qty-btn" onclick="diminuerQuantite(${index})">-</button>
                        <span>${item.quantite}</span>
                        <button class="qty-btn" onclick="augmenterQuantite(${index})">+</button>
                    </div>
                    
                    <button class="remove-btn" onclick="retirerDuPanier(${index})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
                <div class="panier-item-info">
                    <h5>${item.nom}</h5>
                    <p>${item.prix} x ${item.quantite} = ${sousTotal.toLocaleString()} FCFA</p>
                </div>
            </div>
        `;
    });

    panierItems.innerHTML = html;
    const totalElement = document.getElementById('panier-total');
    if (totalElement) {
        totalElement.textContent = `Total: ${total.toLocaleString()} FCFA`;
    }
}

// Fonctions de gestion des quantités
function augmenterQuantite(index) {
    if (panier[index]) {
        panier[index].quantite += 1;
        sauvegarderPanier();
        mettreAJourPanier();
    }
}

function diminuerQuantite(index) {
    if (panier[index]) {
        if (panier[index].quantite > 1) {
            panier[index].quantite -= 1;
        } else {
            panier.splice(index, 1);
        }
        sauvegarderPanier();
        mettreAJourPanier();
    }
}

function retirerDuPanier(index) {
    if (panier[index]) {
        panier.splice(index, 1);
        sauvegarderPanier();
        mettreAJourPanier();
    }
}

// Fonctions de gestion de la modal
function ouvrirPanier() {
    const modal = document.getElementById('panier-modal');
    if (modal) {
        modal.style.display = 'block';
        mettreAJourPanier();
    }
}

function fermerPanier() {
    const modal = document.getElementById('panier-modal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Fermer la modal en cliquant à l'extérieur
window.onclick = function(event) {
    const modal = document.getElementById('panier-modal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
}

// Fonction pour vider le panier
function viderPanier() {
    panier = [];
    sauvegarderPanier();
    mettreAJourPanier();
}

// Fonction principale pour commander via WhatsApp
function commanderViaWhatsApp() {
    if (panier.length === 0) {
        alert("Votre panier est vide !");
        return;
    }

    const dateHeure = new Date().toLocaleString('fr-FR');
    let message = "🛒 *NOUVELLE COMMANDE - PRODUITS BIO*\n\n";
    message += "👋 Bonjour! Je souhaite commander les articles suivants:\n\n";

    let total = 0;
    let nombreArticles = 0;

    panier.forEach((item, index) => {
        const prixNumerique = parseInt(item.prix.replace(/[^0-9]/g, ''));
        const sousTotal = prixNumerique * item.quantite;
        total += sousTotal;
        nombreArticles += item.quantite;

        message += `📦 *ARTICLE ${index + 1}:*\n`;
        message += `🔹 Nom: *${item.nom}*\n`;
        message += `💰 Prix unitaire: ${item.prix}\n`;
        message += `🔢 Quantité: ${item.quantite}\n`;
        message += `📊 Sous-total: ${sousTotal.toLocaleString()} FCFA\n\n`;
    });

    message += "━━━━━━━━━━━━━━━━━━━━━\n";
    message += `💵 *TOTAL DE LA COMMANDE: ${total.toLocaleString()} FCFA*\n`;
    message += `📦 Nombre d'articles: ${nombreArticles}\n\n`;
    message += `⏰ Date et heure: ${dateHeure}\n\n`;
    message += "✅ Merci de me confirmer la disponibilité et les modalités de livraison!\n\n";
    message += "🙏 Merci et à bientôt!";

    const messageEncode = encodeURIComponent(message);
    const urlWhatsApp = `https://wa.me/${NUMERO_WHATSAPP}?text=${messageEncode}`;
    window.open(urlWhatsApp, "_blank");
    
    // Optionnel: vider le panier après commande
    // viderPanier();
}

// Initialisation
document.addEventListener('DOMContentLoaded', function() {
    chargerPanier(); // Charger le panier sauvegardé
    mettreAJourPanier(); // Mettre à jour l'affichage
    
    // Ajouter les event listeners pour tous les boutons "Ajouter au panier"
    const boutonsAjouter = document.querySelectorAll('.whatsapp-btn');
    boutonsAjouter.forEach((bouton, index) => {
        bouton.addEventListener('click', function() {
            ajouterAuPanier(this);
        });
    });
});