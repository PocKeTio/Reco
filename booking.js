/**
 * Gestion des bookings et du référentiel associé
 */
document.addEventListener('DOMContentLoaded', function() {
    // Configuration des bookings et référentiels associés
    const bookingConfig = {
        'france': {
            name: 'France',
            receivableAccounts: ['Receivable-FR', 'Receivable-FR2'],
            pivotAccounts: ['Pivot-FR'],
            bookingNumber: 'FR001',
            currency: 'EUR',
            defaultAccount: 'Receivable-FR'
        },
        'espagne': {
            name: 'Espagne',
            receivableAccounts: ['Receivable-ES'],
            pivotAccounts: ['Pivot-ES'],
            bookingNumber: 'ES001',
            currency: 'EUR',
            defaultAccount: 'Receivable-ES'
        },
        'uk': {
            name: 'Royaume-Uni',
            receivableAccounts: ['Receivable-UK'],
            pivotAccounts: ['Pivot-UK'],
            bookingNumber: 'UK001',
            currency: 'GBP',
            defaultAccount: 'Receivable-UK'
        },
        'allemagne': {
            name: 'Allemagne',
            receivableAccounts: ['Receivable-DE'],
            pivotAccounts: ['Pivot-DE'],
            bookingNumber: 'DE001',
            currency: 'EUR',
            defaultAccount: 'Receivable-DE'
        }
    };

    // Droits utilisateur simulés (à remplacer par un appel API authentifié)
    const userPermissions = {
        allowedBookings: ['france', 'espagne', 'uk', 'allemagne'],  // Par défaut tous les accès
        isAdmin: true
    };

    let currentBooking = 'all';
    
    // Initialiser le sélecteur de booking en fonction des droits utilisateur
    function initBookingSelector() {
        const selector = document.getElementById('booking-selector');
        if (!selector) return;
        
        // Réinitialiser le sélecteur
        while (selector.options.length > 1) {
            selector.remove(1);
        }
        
        // Ajouter uniquement les bookings auxquels l'utilisateur a droit
        userPermissions.allowedBookings.forEach(bookingId => {
            if (bookingConfig[bookingId]) {
                const option = document.createElement('option');
                option.value = bookingId;
                option.textContent = bookingConfig[bookingId].name;
                selector.appendChild(option);
            }
        });
        
        // Écouter les changements de booking
        selector.addEventListener('change', function() {
            setCurrentBooking(this.value);
        });
    }
    
    // Définir la booking actuelle et mettre à jour l'interface
    function setCurrentBooking(bookingId) {
        currentBooking = bookingId;
        
        // Sauvegarder la préférence utilisateur
        localStorage.setItem('preferredBooking', bookingId);
        
        // Mettre à jour les filtres de comptes dans l'interface
        updateAccountFilters();
        
        // Filtrer les données affichées
        filterDataByBooking();
        
        // Déclencher un événement personnalisé pour notifier les autres modules
        document.dispatchEvent(new CustomEvent('bookingChanged', { 
            detail: { booking: bookingId, config: bookingId === 'all' ? null : bookingConfig[bookingId] } 
        }));
    }
    
    // Mettre à jour les filtres de comptes en fonction de la booking sélectionnée
    function updateAccountFilters() {
        const accountSelectors = document.querySelectorAll('.account-selector');
        
        accountSelectors.forEach(selector => {
            // Sauvegarder la valeur actuelle
            const currentValue = selector.value;
            
            // Vider le sélecteur
            while (selector.options.length > 0) {
                selector.remove(0);
            }
            
            // Option "Tous les comptes"
            const allOption = document.createElement('option');
            allOption.value = 'all';
            allOption.textContent = 'Tous les comptes';
            selector.appendChild(allOption);
            
            // Si "Toutes les bookings" est sélectionné, ajouter tous les comptes disponibles
            if (currentBooking === 'all') {
                const allAccounts = new Set();
                
                // Collecter tous les comptes de toutes les bookings autorisées
                userPermissions.allowedBookings.forEach(bookingId => {
                    if (bookingConfig[bookingId]) {
                        bookingConfig[bookingId].receivableAccounts.forEach(account => {
                            allAccounts.add(account);
                        });
                        bookingConfig[bookingId].pivotAccounts.forEach(account => {
                            allAccounts.add(account);
                        });
                    }
                });
                
                // Ajouter chaque compte unique
                allAccounts.forEach(account => {
                    const option = document.createElement('option');
                    option.value = account;
                    option.textContent = account;
                    selector.appendChild(option);
                });
            } 
            // Sinon, ajouter seulement les comptes de la booking sélectionnée
            else if (bookingConfig[currentBooking]) {
                const config = bookingConfig[currentBooking];
                
                // Ajouter les comptes receivable
                config.receivableAccounts.forEach(account => {
                    const option = document.createElement('option');
                    option.value = account;
                    option.textContent = account;
                    selector.appendChild(option);
                });
                
                // Ajouter les comptes pivot
                config.pivotAccounts.forEach(account => {
                    const option = document.createElement('option');
                    option.value = account;
                    option.textContent = account;
                    selector.appendChild(option);
                });
            }
            
            // Essayer de restaurer la valeur précédente si elle existe toujours
            if (Array.from(selector.options).some(option => option.value === currentValue)) {
                selector.value = currentValue;
            } else {
                selector.value = 'all';
            }
            
            // Déclencher un événement change pour mettre à jour les filtres dépendants
            selector.dispatchEvent(new Event('change'));
        });
    }
    
    // Filtrer les données affichées en fonction de la booking sélectionnée
    function filterDataByBooking() {
        const tables = document.querySelectorAll('table.data-table');
        
        tables.forEach(table => {
            const rows = table.querySelectorAll('tbody tr');
            
            rows.forEach(row => {
                const bookingCell = row.querySelector('td:nth-child(5)'); // Colonne de l'entité (booking)
                
                if (bookingCell) {
                    const rowBooking = mapBookingNameToId(bookingCell.textContent.trim());
                    
                    if (currentBooking === 'all' || rowBooking === currentBooking) {
                        row.style.display = '';
                    } else {
                        row.style.display = 'none';
                    }
                }
            });
            
            // Mettre à jour les totaux et compteurs si nécessaire
            updateTableCounters(table);
        });
    }
    
    // Fonction utilitaire pour mapper un nom de booking à son identifiant
    function mapBookingNameToId(bookingName) {
        const mapping = {
            'France': 'france',
            'Espagne': 'espagne',
            'Royaume-Uni': 'uk',
            'Allemagne': 'allemagne'
        };
        
        return mapping[bookingName] || 'unknown';
    }
    
    // Mettre à jour les compteurs de table (nombre total d'éléments, etc.)
    function updateTableCounters(table) {
        const visibleRows = Array.from(table.querySelectorAll('tbody tr')).filter(row => row.style.display !== 'none');
        const totalCounter = table.parentElement.querySelector('.total-counter');
        
        if (totalCounter) {
            totalCounter.textContent = visibleRows.length;
        }
    }
    
    // Récupérer les données de référentiel pour la booking actuelle
    function getCurrentBookingConfig() {
        return currentBooking === 'all' ? null : bookingConfig[currentBooking];
    }
    
    // Initialiser avec la booking préférée de l'utilisateur ou la première disponible
    function initializeDefaultBooking() {
        const savedBooking = localStorage.getItem('preferredBooking');
        
        if (savedBooking && (savedBooking === 'all' || userPermissions.allowedBookings.includes(savedBooking))) {
            document.getElementById('booking-selector').value = savedBooking;
            setCurrentBooking(savedBooking);
        } else if (userPermissions.allowedBookings.length > 0) {
            document.getElementById('booking-selector').value = userPermissions.allowedBookings[0];
            setCurrentBooking(userPermissions.allowedBookings[0]);
        }
    }
    
    // Exposer des méthodes publiques
    window.bookingManager = {
        getCurrentBooking: () => currentBooking,
        getBookingConfig: getCurrentBookingConfig,
        setBooking: setCurrentBooking,
        getUserPermissions: () => userPermissions
    };
    
    // Initialiser la gestion des bookings
    initBookingSelector();
    initializeDefaultBooking();
});
