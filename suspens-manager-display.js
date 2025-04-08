/**
 * suspens-manager-display.js - Fonctions d'affichage et manipulation des suspens
 * 
 * Ce fichier contient les fonctions pour afficher, filtrer et manipuler
 * les suspens dans l'interface utilisateur
 */

/**
 * Récupère les données des suspens (simulation API)
 * @returns {Array} Liste des suspens
 */
function getSuspensData() {
    // Dans un environnement réel, ces données viendraient d'une API
    return [
        {
            id: 'SUS-2025-001',
            reference: 'VIR-1234567',
            amount: 4250.75,
            client: 'ACME CORP',
            date: '2025-03-20',
            age: 19,
            status: 'pending',
            category: 'unidentified',
            origin: 'Bank Statement',
            details: 'Payment received without invoice reference'
        },
        {
            id: 'SUS-2025-002',
            reference: 'PAY-7891011',
            amount: 3680.50,
            client: 'GLOBEX INC',
            date: '2025-03-15',
            age: 24,
            status: 'pending',
            category: 'partial',
            origin: 'Bank Statement',
            details: 'Partial payment for invoice FAC-2025-0031 (5000€)'
        },
        {
            id: 'SUS-2025-003',
            reference: 'CHQ-9876543',
            amount: 12750.00,
            client: 'STARK INDUSTRIES',
            date: '2025-02-28',
            age: 39,
            status: 'critical',
            category: 'unidentified',
            origin: 'Bank Statement',
            details: 'Cheque payment without invoice reference'
        },
        {
            id: 'SUS-2025-004',
            reference: 'VIR-2468013',
            amount: 8430.25,
            client: 'WAYNE ENTERPRISES',
            date: '2025-03-25',
            age: 14,
            status: 'pending',
            category: 'overpayment',
            origin: 'Bank Statement',
            details: 'Overpayment for invoice FAC-2025-0035 (8400€)'
        },
        {
            id: 'SUS-2025-005',
            reference: 'PAY-1357924',
            amount: 950.00,
            client: 'OSCORP',
            date: '2025-04-01',
            age: 7,
            status: 'normal',
            category: 'pending',
            origin: 'Bank Statement',
            details: 'Recent payment, waiting for matching'
        }
    ];
}

/**
 * Affiche les données des suspens dans le tableau
 * @param {Array} data - Liste des suspens à afficher
 */
function displaySuspensData(data) {
    const suspensTable = document.querySelector('.suspens-table tbody');
    if (!suspensTable) return;
    
    if (data.length === 0) {
        suspensTable.innerHTML = `
            <tr>
                <td colspan="7" class="text-center py-4">
                    <div class="alert alert-info mb-0">
                        <i class="fas fa-info-circle me-2"></i>
                        ${window.__('no_suspens_found')}
                    </div>
                </td>
            </tr>
        `;
        return;
    }
    
    let rowsHtml = '';
    
    data.forEach(suspens => {
        const statusClass = getStatusClass(suspens.status, suspens.age);
        const amountClass = getAmountClass(suspens.amount);
        
        rowsHtml += `
            <tr data-id="${suspens.id}" data-category="${suspens.category}">
                <td>
                    <div class="form-check">
                        <input class="form-check-input suspens-checkbox" type="checkbox" value="${suspens.id}" id="check-${suspens.id}">
                        <label class="form-check-label" for="check-${suspens.id}"></label>
                    </div>
                </td>
                <td>
                    ${suspens.reference}
                    <div class="small text-muted">${suspens.id}</div>
                </td>
                <td class="${amountClass}">${formatCurrency(suspens.amount)}</td>
                <td>${suspens.client}</td>
                <td>${formatDate(suspens.date)}</td>
                <td>
                    <span class="badge ${statusClass}">
                        ${suspens.age} ${window.__('days')}
                    </span>
                </td>
                <td>
                    <span class="badge ${getCategoryClass(suspens.category)}">
                        ${window.__(getCategoryLabel(suspens.category))}
                    </span>
                </td>
                <td>
                    <div class="btn-group">
                        <button type="button" class="btn btn-sm btn-outline-primary view-suspens" 
                            data-id="${suspens.id}" title="${window.__('view_details')}">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button type="button" class="btn btn-sm btn-outline-success match-suspens" 
                            data-id="${suspens.id}" title="${window.__('match_payment')}">
                            <i class="fas fa-link"></i>
                        </button>
                        <button type="button" class="btn btn-sm btn-outline-danger delete-suspens" 
                            data-id="${suspens.id}" title="${window.__('delete')}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    });
    
    suspensTable.innerHTML = rowsHtml;
    
    // Attacher les écouteurs d'événements
    attachSuspensActionListeners();
}

/**
 * Met à jour les compteurs de catégories
 * @param {Array} data - Liste des suspens
 */
function updateCategoryCounts(data) {
    // Compter les suspens par catégorie
    const counts = {
        all: data.length,
        critical: data.filter(s => s.status === 'critical' || s.age >= suspensManagerConfig.agingThresholds.critical).length,
        unidentified: data.filter(s => s.category === 'unidentified').length,
        partial: data.filter(s => s.category === 'partial').length,
        pending: data.filter(s => s.category === 'pending').length,
        overpayment: data.filter(s => s.category === 'overpayment').length
    };
    
    // Mettre à jour les badges
    Object.keys(counts).forEach(category => {
        const badge = document.getElementById(`count-${category}`);
        if (badge) {
            badge.textContent = counts[category];
            
            // Mettre en évidence les catégories avec des éléments
            if (counts[category] > 0) {
                badge.classList.remove('bg-secondary');
                
                if (category === 'critical' && counts[category] > 0) {
                    badge.classList.add('bg-danger');
                } else {
                    badge.classList.add('bg-primary');
                }
            } else {
                badge.classList.remove('bg-primary', 'bg-danger');
                badge.classList.add('bg-secondary');
            }
        }
    });
}

/**
 * Attache les écouteurs d'événements pour les actions sur les suspens
 */
function attachSuspensActionListeners() {
    // Boutons de visualisation
    document.querySelectorAll('.view-suspens').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            showSuspensDetails(id);
        });
    });
    
    // Boutons de rapprochement
    document.querySelectorAll('.match-suspens').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            showMatchModal(id);
        });
    });
    
    // Boutons de suppression
    document.querySelectorAll('.delete-suspens').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            confirmDeleteSuspens(id);
        });
    });
    
    // Case à cocher principale (sélectionner tout)
    const selectAllCheckbox = document.querySelector('.select-all-suspens');
    if (selectAllCheckbox) {
        selectAllCheckbox.addEventListener('change', function() {
            const isChecked = this.checked;
            document.querySelectorAll('.suspens-checkbox').forEach(cb => {
                cb.checked = isChecked;
            });
            
            // Mettre à jour l'état des boutons d'action groupée
            updateBulkActionButtons();
        });
    }
    
    // Cases à cocher individuelles
    document.querySelectorAll('.suspens-checkbox').forEach(cb => {
        cb.addEventListener('change', function() {
            updateBulkActionButtons();
            
            // Vérifier si toutes les cases sont cochées
            const allCheckboxes = document.querySelectorAll('.suspens-checkbox');
            const checkedCheckboxes = document.querySelectorAll('.suspens-checkbox:checked');
            
            const selectAllCheckbox = document.querySelector('.select-all-suspens');
            if (selectAllCheckbox) {
                selectAllCheckbox.checked = allCheckboxes.length === checkedCheckboxes.length;
                selectAllCheckbox.indeterminate = checkedCheckboxes.length > 0 && 
                                                 allCheckboxes.length !== checkedCheckboxes.length;
            }
        });
    });
}

/**
 * Filtre les suspens par catégorie
 * @param {string} categoryId - Identifiant de la catégorie
 */
function filterSuspensByCategory(categoryId) {
    const rows = document.querySelectorAll('.suspens-table tbody tr');
    
    if (categoryId === 'all') {
        // Afficher tous les suspens
        rows.forEach(row => {
            row.classList.remove('d-none');
        });
    } else if (categoryId === 'critical') {
        // Filtrer par statut critique (basé sur l'âge)
        rows.forEach(row => {
            const statusCell = row.querySelector('td:nth-child(6) .badge');
            const isVisible = statusCell && statusCell.classList.contains('bg-danger');
            
            row.classList.toggle('d-none', !isVisible);
        });
    } else {
        // Filtrer par catégorie
        rows.forEach(row => {
            const rowCategory = row.getAttribute('data-category');
            row.classList.toggle('d-none', rowCategory !== categoryId);
        });
    }
    
    // Mettre à jour le titre de la section
    updateSectionTitle(categoryId);
}

/**
 * Filtre les suspens par montant
 * @param {string} range - Plage de montants (low, medium, high)
 */
function filterSuspensByAmount(range) {
    const rows = document.querySelectorAll('.suspens-table tbody tr');
    const thresholds = suspensManagerConfig.amountThresholds;
    
    rows.forEach(row => {
        // Si la ligne est déjà masquée par un autre filtre, ne pas modifier
        if (row.classList.contains('d-none')) return;
        
        const amountCell = row.querySelector('td:nth-child(3)');
        const amount = parseFloat(amountCell.textContent.replace(/[^\d.-]/g, ''));
        
        let isVisible = true;
        
        switch (range) {
            case 'low':
                isVisible = amount < thresholds.low;
                break;
            case 'medium':
                isVisible = amount >= thresholds.low && amount < thresholds.high;
                break;
            case 'high':
                isVisible = amount >= thresholds.high;
                break;
            default:
                isVisible = true;
        }
        
        row.classList.toggle('filter-hidden', !isVisible);
    });
}

/**
 * Filtre les suspens par terme de recherche
 * @param {string} term - Terme de recherche
 */
function filterSuspensBySearchTerm(term) {
    if (!term) {
        // Réinitialiser le filtre si le terme est vide
        document.querySelectorAll('.suspens-table tbody tr').forEach(row => {
            row.classList.remove('search-hidden');
        });
        return;
    }
    
    document.querySelectorAll('.suspens-table tbody tr').forEach(row => {
        // Si la ligne est déjà masquée par un autre filtre, ne pas modifier
        if (row.classList.contains('d-none') || row.classList.contains('filter-hidden')) return;
        
        const reference = row.querySelector('td:nth-child(2)').textContent.toLowerCase();
        const amount = row.querySelector('td:nth-child(3)').textContent.toLowerCase();
        const client = row.querySelector('td:nth-child(4)').textContent.toLowerCase();
        
        const isMatch = reference.includes(term) || amount.includes(term) || client.includes(term);
        
        row.classList.toggle('search-hidden', !isMatch);
    });
}

/**
 * Trie le tableau des suspens
 * @param {string} field - Champ de tri
 * @param {string} order - Ordre de tri (asc, desc)
 */
function sortSuspensTable(field, order) {
    const tbody = document.querySelector('.suspens-table tbody');
    if (!tbody) return;
    
    const rows = Array.from(tbody.querySelectorAll('tr'));
    
    rows.sort((a, b) => {
        let valueA, valueB;
        
        switch (field) {
            case 'reference':
                valueA = a.querySelector('td:nth-child(2)').textContent.trim();
                valueB = b.querySelector('td:nth-child(2)').textContent.trim();
                return order === 'asc' 
                    ? valueA.localeCompare(valueB)
                    : valueB.localeCompare(valueA);
                
            case 'amount':
                valueA = parseFloat(a.querySelector('td:nth-child(3)').textContent.replace(/[^\d.-]/g, ''));
                valueB = parseFloat(b.querySelector('td:nth-child(3)').textContent.replace(/[^\d.-]/g, ''));
                break;
                
            case 'client':
                valueA = a.querySelector('td:nth-child(4)').textContent.trim();
                valueB = b.querySelector('td:nth-child(4)').textContent.trim();
                return order === 'asc'
                    ? valueA.localeCompare(valueB)
                    : valueB.localeCompare(valueA);
                
            case 'date':
                valueA = new Date(a.querySelector('td:nth-child(5)').textContent.trim().split('/').reverse().join('-'));
                valueB = new Date(b.querySelector('td:nth-child(5)').textContent.trim().split('/').reverse().join('-'));
                break;
                
            case 'age':
                valueA = parseInt(a.querySelector('td:nth-child(6) .badge').textContent, 10);
                valueB = parseInt(b.querySelector('td:nth-child(6) .badge').textContent, 10);
                break;
                
            case 'category':
                valueA = a.querySelector('td:nth-child(7) .badge').textContent.trim();
                valueB = b.querySelector('td:nth-child(7) .badge').textContent.trim();
                return order === 'asc'
                    ? valueA.localeCompare(valueB)
                    : valueB.localeCompare(valueA);
                
            default:
                return 0;
        }
        
        return order === 'asc' ? valueA - valueB : valueB - valueA;
    });
    
    // Recréer le tableau avec les lignes triées
    rows.forEach(row => tbody.appendChild(row));
}

/**
 * Met à jour le titre de la section en fonction de la catégorie sélectionnée
 * @param {string} categoryId - Identifiant de la catégorie
 */
function updateSectionTitle(categoryId) {
    const titleElement = document.querySelector('.suspens-section-title');
    if (!titleElement) return;
    
    const category = suspensManagerConfig.categories.find(c => c.id === categoryId);
    if (category) {
        titleElement.innerHTML = `
            <i class="${category.icon} me-2"></i>
            <span data-i18n="${category.label}">${window.__(category.label)}</span>
        `;
    }
}

/**
 * Configure les actions groupées pour les suspens
 */
function setupBulkActions() {
    // Écouteur pour le bouton d'action groupée de rapprochement
    document.getElementById('bulk-match')?.addEventListener('click', function() {
        const selectedIds = getSelectedSuspensIds();
        if (selectedIds.length > 0) {
            showBulkMatchModal(selectedIds);
        }
    });
    
    // Écouteur pour le bouton d'action groupée de suppression
    document.getElementById('bulk-delete')?.addEventListener('click', function() {
        const selectedIds = getSelectedSuspensIds();
        if (selectedIds.length > 0) {
            confirmBulkDeleteSuspens(selectedIds);
        }
    });
    
    // Écouteur pour le bouton d'action groupée de catégorisation
    document.getElementById('bulk-categorize')?.addEventListener('click', function() {
        const selectedIds = getSelectedSuspensIds();
        if (selectedIds.length > 0) {
            showBulkCategorizeModal(selectedIds);
        }
    });
    
    // Écouteur pour le bouton d'action groupée d'exportation
    document.getElementById('bulk-export')?.addEventListener('click', function() {
        const selectedIds = getSelectedSuspensIds();
        if (selectedIds.length > 0) {
            exportSuspens(selectedIds);
        }
    });
}

/**
 * Met à jour l'état des boutons d'action groupée
 */
function updateBulkActionButtons() {
    const selectedCount = document.querySelectorAll('.suspens-checkbox:checked').length;
    const buttons = document.querySelectorAll('.bulk-action-btn');
    
    buttons.forEach(btn => {
        btn.disabled = selectedCount === 0;
        
        // Mettre à jour le compteur sur le bouton
        const counter = btn.querySelector('.selected-count');
        if (counter) {
            counter.textContent = selectedCount;
            counter.classList.toggle('d-none', selectedCount === 0);
        }
    });
}

/**
 * Récupère les identifiants des suspens sélectionnés
 * @returns {Array} Liste des identifiants sélectionnés
 */
function getSelectedSuspensIds() {
    const selected = [];
    document.querySelectorAll('.suspens-checkbox:checked').forEach(cb => {
        selected.push(cb.value);
    });
    return selected;
}

/**
 * Récupère la classe CSS pour un statut donné
 * @param {string} status - Statut du suspens
 * @param {number} age - Âge du suspens en jours
 * @returns {string} Classe CSS
 */
function getStatusClass(status, age) {
    if (status === 'critical' || age >= suspensManagerConfig.agingThresholds.critical) {
        return 'bg-danger';
    } else if (age >= suspensManagerConfig.agingThresholds.warning) {
        return 'bg-warning text-dark';
    } else {
        return 'bg-info text-dark';
    }
}

/**
 * Récupère la classe CSS pour un montant donné
 * @param {number} amount - Montant
 * @returns {string} Classe CSS
 */
function getAmountClass(amount) {
    if (amount >= suspensManagerConfig.amountThresholds.high) {
        return 'text-danger fw-bold';
    } else if (amount >= suspensManagerConfig.amountThresholds.medium) {
        return 'text-warning fw-bold';
    } else {
        return '';
    }
}

/**
 * Récupère la classe CSS pour une catégorie donnée
 * @param {string} category - Catégorie du suspens
 * @returns {string} Classe CSS
 */
function getCategoryClass(category) {
    switch (category) {
        case 'unidentified':
            return 'bg-danger';
        case 'partial':
            return 'bg-warning text-dark';
        case 'pending':
            return 'bg-info text-dark';
        case 'overpayment':
            return 'bg-success';
        default:
            return 'bg-secondary';
    }
}

/**
 * Récupère le libellé de traduction pour une catégorie donnée
 * @param {string} category - Catégorie du suspens
 * @returns {string} Clé de traduction
 */
function getCategoryLabel(category) {
    return category + '_category';
}

/**
 * Met à jour les libellés des suspens après un changement de langue
 */
function updateSuspensLabels() {
    // Mettre à jour les libellés des catégories
    document.querySelectorAll('.suspens-categories .nav-link span[data-i18n]').forEach(span => {
        const key = span.getAttribute('data-i18n');
        span.textContent = window.__(key);
    });
    
    // Mettre à jour le titre de la section
    const activeCategory = document.querySelector('.suspens-categories .nav-link.active');
    if (activeCategory) {
        const categoryId = activeCategory.getAttribute('data-category');
        updateSectionTitle(categoryId);
    }
    
    // Mettre à jour les badges de catégorie
    document.querySelectorAll('.suspens-table tbody tr td:nth-child(7) .badge').forEach(badge => {
        const category = badge.textContent.trim();
        badge.textContent = window.__(getCategoryLabel(category));
    });
    
    // Recharger les données pour mettre à jour tous les autres textes
    loadSuspensData();
}

/**
 * Formate un montant en devise
 * @param {number} amount - Montant à formater
 * @returns {string} Montant formaté
 */
function formatCurrency(amount) {
    return new Intl.NumberFormat('fr-FR', { 
        style: 'currency', 
        currency: 'EUR',
        maximumFractionDigits: 2
    }).format(amount);
}

/**
 * Formate une date
 * @param {string} dateStr - Date au format YYYY-MM-DD
 * @returns {string} Date formatée
 */
function formatDate(dateStr) {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('fr-FR').format(date);
}

// Exposer les fonctions nécessaires globalement
window.suspensManager = {
    loadSuspensData,
    filterSuspensByCategory,
    filterSuspensBySearchTerm,
    updateSuspensLabels
};
