/**
 * Gestion des filtres de l'application
 * Ce script gère tous les filtres, y compris les filtres de booking entity et de compte
 */
document.addEventListener('DOMContentLoaded', function() {
    // Initialisation des filtres
    initFilters();
    
    // Écouter les changements de booking
    document.addEventListener('bookingChanged', function(event) {
        applyFilters();
    });
    
    // Fonction d'initialisation des filtres
    function initFilters() {
        // Initialiser les écouteurs d'événements pour les filtres du suivi des suspens
        const suspensFiltersBtn = document.getElementById('filter-suspens-btn');
        const resetSuspensFiltersBtn = document.getElementById('reset-suspens-filters-btn');
        
        if (suspensFiltersBtn) {
            suspensFiltersBtn.addEventListener('click', function() {
                applyFilters('suspens');
            });
        }
        
        if (resetSuspensFiltersBtn) {
            resetSuspensFiltersBtn.addEventListener('click', function() {
                resetFilters('suspens');
            });
        }
        
        // Initialiser les écouteurs d'événements pour les filtres des suspens inversés
        const reverseSuspensFiltersBtn = document.getElementById('filter-reverse-suspens-btn');
        const resetReverseSuspensFiltersBtn = document.getElementById('reset-reverse-suspens-filters-btn');
        
        if (reverseSuspensFiltersBtn) {
            reverseSuspensFiltersBtn.addEventListener('click', function() {
                applyFilters('reverse-suspens');
            });
        }
        
        if (resetReverseSuspensFiltersBtn) {
            resetReverseSuspensFiltersBtn.addEventListener('click', function() {
                resetFilters('reverse-suspens');
            });
        }
    }
    
    // Fonction d'application des filtres
    function applyFilters(viewType) {
        const currentBooking = window.bookingManager ? window.bookingManager.getCurrentBooking() : 'all';
        
        if (viewType === 'suspens' || !viewType) {
            applySuspensFilters(currentBooking);
        }
        
        if (viewType === 'reverse-suspens' || !viewType) {
            applyReverseSuspensFilters(currentBooking);
        }
        
        // Mise à jour des compteurs et statistiques
        updateCounters();
    }
    
    // Fonction de réinitialisation des filtres
    function resetFilters(viewType) {
        if (viewType === 'suspens' || !viewType) {
            document.getElementById('suspens-status-filter').value = 'all';
            document.getElementById('suspens-account-filter').value = 'all';
            document.getElementById('suspens-period-filter').value = 'all';
        }
        
        if (viewType === 'reverse-suspens' || !viewType) {
            document.getElementById('reverse-suspens-status-filter').value = 'all';
            document.getElementById('reverse-suspens-account-filter').value = 'all';
            document.getElementById('reverse-suspens-period-filter').value = 'all';
        }
        
        // Appliquer les filtres réinitialisés
        applyFilters(viewType);
    }
    
    // Fonction d'application des filtres pour le suivi des suspens
    function applySuspensFilters(currentBooking) {
        const statusFilter = document.getElementById('suspens-status-filter').value;
        const accountFilter = document.getElementById('suspens-account-filter').value;
        const periodFilter = document.getElementById('suspens-period-filter').value;
        
        const table = document.getElementById('suspens-table');
        if (!table) return;
        
        const rows = table.querySelectorAll('tbody tr');
        
        rows.forEach(row => {
            let showRow = true;
            
            // Filtrer par booking
            if (currentBooking !== 'all') {
                const bookingCell = row.querySelector('td:nth-child(5)');
                if (bookingCell && bookingMapNameToId(bookingCell.textContent.trim()) !== currentBooking) {
                    showRow = false;
                }
            }
            
            // Filtrer par compte
            if (showRow && accountFilter !== 'all') {
                const accountCell = row.querySelector('td:nth-child(6)');
                if (accountCell && accountCell.textContent.trim() !== accountFilter) {
                    showRow = false;
                }
            }
            
            // Filtrer par statut
            if (showRow && statusFilter !== 'all') {
                const statusCell = row.querySelector('td:nth-child(8) .status');
                if (statusCell) {
                    const statusClasses = statusCell.className.split(' ');
                    const hasStatusClass = statusClasses.some(cls => cls === 'status-' + statusFilter);
                    if (!hasStatusClass) {
                        showRow = false;
                    }
                }
            }
            
            // Filtrer par période
            if (showRow && periodFilter !== 'all') {
                const dateCell = row.querySelector('td:nth-child(1)');
                if (dateCell) {
                    const rowDate = parseDate(dateCell.textContent.trim());
                    const now = new Date();
                    let threshold = new Date();
                    
                    if (periodFilter === 'week') {
                        threshold.setDate(now.getDate() - 7);
                    } else if (periodFilter === 'month') {
                        threshold.setMonth(now.getMonth() - 1);
                    } else if (periodFilter === 'quarter') {
                        threshold.setMonth(now.getMonth() - 3);
                    }
                    
                    if (rowDate < threshold) {
                        showRow = false;
                    }
                }
            }
            
            // Afficher ou masquer la ligne
            row.style.display = showRow ? '' : 'none';
        });
    }
    
    // Fonction d'application des filtres pour les suspens inversés
    function applyReverseSuspensFilters(currentBooking) {
        const statusFilter = document.getElementById('reverse-suspens-status-filter').value;
        const accountFilter = document.getElementById('reverse-suspens-account-filter').value;
        const periodFilter = document.getElementById('reverse-suspens-period-filter').value;
        
        const table = document.getElementById('reverse-suspens-table');
        if (!table) return;
        
        const rows = table.querySelectorAll('tbody tr');
        
        rows.forEach(row => {
            let showRow = true;
            
            // Filtrer par booking
            if (currentBooking !== 'all') {
                const bookingCell = row.querySelector('td:nth-child(5)');
                if (bookingCell && bookingMapNameToId(bookingCell.textContent.trim()) !== currentBooking) {
                    showRow = false;
                }
            }
            
            // Filtrer par compte
            if (showRow && accountFilter !== 'all') {
                const accountCell = row.querySelector('td:nth-child(6)');
                if (accountCell && accountCell.textContent.trim() !== accountFilter) {
                    showRow = false;
                }
            }
            
            // Filtrer par statut
            if (showRow && statusFilter !== 'all') {
                const statusCell = row.querySelector('td:nth-child(8) .status');
                if (statusCell) {
                    const statusClasses = statusCell.className.split(' ');
                    const hasStatusClass = statusClasses.some(cls => cls === 'status-' + statusFilter);
                    if (!hasStatusClass) {
                        showRow = false;
                    }
                }
            }
            
            // Filtrer par période
            if (showRow && periodFilter !== 'all') {
                const dateCell = row.querySelector('td:nth-child(1)');
                if (dateCell) {
                    const rowDate = parseDate(dateCell.textContent.trim());
                    const now = new Date();
                    let threshold = new Date();
                    
                    if (periodFilter === 'week') {
                        threshold.setDate(now.getDate() - 7);
                    } else if (periodFilter === 'month') {
                        threshold.setMonth(now.getMonth() - 1);
                    } else if (periodFilter === 'quarter') {
                        threshold.setMonth(now.getMonth() - 3);
                    }
                    
                    if (rowDate < threshold) {
                        showRow = false;
                    }
                }
            }
            
            // Afficher ou masquer la ligne
            row.style.display = showRow ? '' : 'none';
        });
    }
    
    // Fonction utilitaire pour convertir une date du format DD/MM/YYYY en objet Date
    function parseDate(dateString) {
        const parts = dateString.split('/');
        if (parts.length === 3) {
            return new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
        }
        return new Date();
    }
    
    // Fonction utilitaire pour correspondre un nom de booking à son identifiant
    function bookingMapNameToId(bookingName) {
        const mapping = {
            'France': 'france',
            'Espagne': 'espagne',
            'Royaume-Uni': 'uk',
            'Allemagne': 'allemagne'
        };
        
        return mapping[bookingName] || 'unknown';
    }
    
    // Fonction pour mettre à jour les compteurs et statistiques
    function updateCounters() {
        // Mise à jour du nombre total de suspens visibles
        updateTableCounter('suspens-table', 'suspens-counter');
        
        // Mise à jour du nombre total de suspens inversés visibles
        updateTableCounter('reverse-suspens-table', 'reverse-suspens-counter');
    }
    
    // Fonction pour mettre à jour un compteur spécifique
    function updateTableCounter(tableId, counterId) {
        const table = document.getElementById(tableId);
        const counter = document.getElementById(counterId);
        
        if (table && counter) {
            const visibleRows = Array.from(table.querySelectorAll('tbody tr')).filter(row => row.style.display !== 'none');
            counter.textContent = visibleRows.length;
        }
    }
    
    // Exposer des fonctions publiques
    window.filterManager = {
        applyFilters: applyFilters,
        resetFilters: resetFilters
    };
});
