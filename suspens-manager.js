/**
 * suspens-manager.js - Gestion avancée des suspens
 * 
 * Fonctionnalités:
 * - Visualisation et catégorisation des suspens
 * - Suivi des suspens par ancienneté et montant
 * - Actions groupées sur les suspens
 * - Génération de rapports et alertes
 */

// Configuration des options de gestion des suspens
const suspensManagerConfig = {
    // Niveaux d'alerte pour les suspens anciens (en jours)
    agingThresholds: {
        warning: 15,     // Niveau d'alerte modéré
        critical: 30     // Niveau d'alerte critique
    },
    
    // Montants seuils pour les suspens
    amountThresholds: {
        low: 1000,       // Suspens de faible montant
        medium: 5000,    // Suspens de montant moyen
        high: 10000      // Suspens de montant élevé
    },
    
    // Catégories de suspens
    categories: [
        { id: 'all', label: 'all_suspens', icon: 'fas fa-list' },
        { id: 'critical', label: 'critical_suspens', icon: 'fas fa-exclamation-triangle' },
        { id: 'unidentified', label: 'unidentified_payments', icon: 'fas fa-question-circle' },
        { id: 'partial', label: 'partial_payments', icon: 'fas fa-percentage' },
        { id: 'pending', label: 'pending_identification', icon: 'fas fa-hourglass-half' },
        { id: 'overpayment', label: 'overpayments', icon: 'fas fa-plus-circle' }
    ],
    
    // Options de filtrage
    filterOptions: {
        dateRange: 90,       // Plage de dates par défaut (jours)
        defaultSortField: 'date', // Champ de tri par défaut
        defaultSortOrder: 'desc'  // Ordre de tri par défaut
    },
    
    // Options de notification
    notifications: {
        emailAlerts: true,      // Envoyer des alertes par email
        emailRecipients: [],    // Liste des destinataires des emails
        dailyDigest: true,      // Résumé quotidien
        criticalAlerts: true    // Alertes pour suspens critiques
    }
};

// Initialisation du gestionnaire de suspens
document.addEventListener('DOMContentLoaded', function() {
    // Charger la configuration depuis le localStorage ou utiliser les valeurs par défaut
    loadSuspensConfig();
    
    // Initialiser les filtres
    initSuspensFilters();
    
    // Charger les données initiales
    loadSuspensData();
    
    // Initialiser les catégories
    initSuspensCategories();
    
    // Configurer les actions groupées
    setupBulkActions();
    
    // Initialiser les écouteurs pour le changement de langue
    document.addEventListener('languageChanged', function(e) {
        updateSuspensLabels();
    });
});

/**
 * Charge la configuration du gestionnaire de suspens
 */
function loadSuspensConfig() {
    try {
        const savedConfig = localStorage.getItem('suspensManagerConfig');
        if (savedConfig) {
            const parsedConfig = JSON.parse(savedConfig);
            
            // Fusionner avec les valeurs par défaut
            if (parsedConfig.agingThresholds) {
                Object.assign(suspensManagerConfig.agingThresholds, parsedConfig.agingThresholds);
            }
            
            if (parsedConfig.amountThresholds) {
                Object.assign(suspensManagerConfig.amountThresholds, parsedConfig.amountThresholds);
            }
            
            if (parsedConfig.notifications) {
                Object.assign(suspensManagerConfig.notifications, parsedConfig.notifications);
            }
            
            // Mettre à jour l'interface avec la configuration
            updateSuspensConfigUI();
        }
    } catch (error) {
        console.error('Erreur lors du chargement de la configuration des suspens:', error);
    }
}

/**
 * Sauvegarde la configuration actuelle du gestionnaire de suspens
 */
function saveSuspensConfig() {
    try {
        localStorage.setItem('suspensManagerConfig', JSON.stringify({
            agingThresholds: suspensManagerConfig.agingThresholds,
            amountThresholds: suspensManagerConfig.amountThresholds,
            notifications: suspensManagerConfig.notifications
        }));
    } catch (error) {
        console.error('Erreur lors de la sauvegarde de la configuration des suspens:', error);
    }
}

/**
 * Met à jour l'interface utilisateur avec la configuration chargée
 */
function updateSuspensConfigUI() {
    // Mettre à jour les valeurs de seuil d'ancienneté
    const warningThreshold = document.getElementById('warning-threshold');
    if (warningThreshold) {
        warningThreshold.value = suspensManagerConfig.agingThresholds.warning;
    }
    
    const criticalThreshold = document.getElementById('critical-threshold');
    if (criticalThreshold) {
        criticalThreshold.value = suspensManagerConfig.agingThresholds.critical;
    }
    
    // Mettre à jour les options de notification
    const dailyDigestToggle = document.getElementById('daily-digest-toggle');
    if (dailyDigestToggle) {
        dailyDigestToggle.checked = suspensManagerConfig.notifications.dailyDigest;
    }
    
    const criticalAlertsToggle = document.getElementById('critical-alerts-toggle');
    if (criticalAlertsToggle) {
        criticalAlertsToggle.checked = suspensManagerConfig.notifications.criticalAlerts;
    }
    
    const emailRecipients = document.getElementById('email-recipients');
    if (emailRecipients) {
        emailRecipients.value = suspensManagerConfig.notifications.emailRecipients.join('; ');
    }
}

/**
 * Initialise les catégories de suspens dans l'interface
 */
function initSuspensCategories() {
    const categoriesList = document.querySelector('.suspens-categories');
    if (!categoriesList) return;
    
    let categoriesHTML = '';
    
    suspensManagerConfig.categories.forEach(category => {
        categoriesHTML += `
            <li class="nav-item">
                <a class="nav-link ${category.id === 'all' ? 'active' : ''}" href="#" data-category="${category.id}">
                    <i class="${category.icon} me-2"></i>
                    <span data-i18n="${category.label}">${window.__(category.label)}</span>
                    <span class="badge bg-secondary rounded-pill ms-2 category-count" id="count-${category.id}">0</span>
                </a>
            </li>
        `;
    });
    
    categoriesList.innerHTML = categoriesHTML;
    
    // Ajouter les écouteurs d'événements pour les catégories
    document.querySelectorAll('.suspens-categories .nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Mettre à jour l'élément actif
            document.querySelectorAll('.suspens-categories .nav-link').forEach(l => {
                l.classList.remove('active');
            });
            this.classList.add('active');
            
            const categoryId = this.getAttribute('data-category');
            filterSuspensByCategory(categoryId);
        });
    });
}

/**
 * Initialise les filtres pour les suspens
 */
function initSuspensFilters() {
    // Filtre par date
    const dateRangeFilter = document.getElementById('suspens-date-range');
    if (dateRangeFilter) {
        dateRangeFilter.addEventListener('change', function() {
            const range = parseInt(this.value, 10);
            suspensManagerConfig.filterOptions.dateRange = range;
            loadSuspensData();
        });
    }
    
    // Filtre par montant
    const amountRangeFilter = document.getElementById('suspens-amount-range');
    if (amountRangeFilter) {
        amountRangeFilter.addEventListener('change', function() {
            const range = this.value;
            filterSuspensByAmount(range);
        });
    }
    
    // Filtre de recherche
    const searchFilter = document.getElementById('suspens-search');
    if (searchFilter) {
        searchFilter.addEventListener('input', function() {
            const searchTerm = this.value.trim().toLowerCase();
            filterSuspensBySearchTerm(searchTerm);
        });
    }
    
    // Tri des colonnes
    document.querySelectorAll('.suspens-table th[data-sort]').forEach(header => {
        header.addEventListener('click', function() {
            const field = this.getAttribute('data-sort');
            const currentOrder = this.getAttribute('data-order') || 'desc';
            const newOrder = currentOrder === 'asc' ? 'desc' : 'asc';
            
            // Réinitialiser tous les en-têtes
            document.querySelectorAll('.suspens-table th[data-sort]').forEach(h => {
                h.removeAttribute('data-order');
                h.querySelector('i')?.remove();
            });
            
            // Mettre à jour l'icône et l'ordre de tri
            this.setAttribute('data-order', newOrder);
            this.innerHTML += `<i class="fas fa-sort-${newOrder === 'asc' ? 'up' : 'down'} ms-1"></i>`;
            
            sortSuspensTable(field, newOrder);
        });
    });
}

/**
 * Charge les données des suspens
 */
function loadSuspensData() {
    // Afficher l'indicateur de chargement
    const suspensTable = document.querySelector('.suspens-table tbody');
    if (suspensTable) {
        suspensTable.innerHTML = `
            <tr>
                <td colspan="7" class="text-center py-4">
                    <div class="spinner-border text-primary" role="status">
                        <span class="visually-hidden">${window.__('loading')}</span>
                    </div>
                    <p class="mt-2">${window.__('loading_suspens')}</p>
                </td>
            </tr>
        `;
    }
    
    // Simuler un chargement depuis l'API
    setTimeout(() => {
        const data = getSuspensData();
        displaySuspensData(data);
        updateCategoryCounts(data);
    }, 800);
}
