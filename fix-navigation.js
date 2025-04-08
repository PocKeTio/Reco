/**
 * Gestionnaire de navigation avec nettoyage intelligent des classes active
 */

// Fonctions accessibles globalement pour nettoyer les états actifs
window.cleanAllActiveStates = function() {
    // Nettoyer seulement les éléments de menu
    document.querySelectorAll('#sidebar ul li').forEach(element => {
        element.classList.remove('active');
    });
};

// Attendre que le DOM soit chargé
document.addEventListener('DOMContentLoaded', function() {
    console.log("Fix-navigation : initialisation");
    
    // Gestionnaire de navigation
    const navigationManager = {
        init: function() {
            // Nettoyer uniquement les classes active de navigation lors de l'initialisation
            window.cleanAllActiveStates();
            
            // Ajouter les écouteurs d'événements aux liens de navigation
            this.setupEventListeners();
            
            // Initialiser la vue active
            this.setActiveView(sessionStorage.getItem('activeView') || 'dashboard');
        },
        
        setupEventListeners: function() {
            document.querySelectorAll('[data-view]').forEach(link => {
                // Ajouter notre écouteur d'événement sans supprimer les autres
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.setActiveView(link.getAttribute('data-view'));
                });
            });
        },
        
        setActiveView: function(viewName) {
            console.log('Activation de la vue:', viewName);
            
            // 1. Nettoyer uniquement les classes active de navigation
            window.cleanAllActiveStates();
            
            // 2. Ajouter l'état actif à l'élément correspondant à la vue
            const menuItem = document.querySelector(`[data-view="${viewName}"]`);
            if (menuItem && menuItem.closest('li')) {
                menuItem.closest('li').classList.add('active');
            }
            
            // 3. Gérer les vues
            document.querySelectorAll('.content-view').forEach(view => {
                view.classList.remove('active');
            });
            
            const viewElement = document.getElementById(viewName + '-view');
            if (viewElement) {
                viewElement.classList.add('active');
            }
            
            // 4. Sauvegarder la vue active
            sessionStorage.setItem('activeView', viewName);
        }
    };
    
    // Initialiser le gestionnaire de navigation
    navigationManager.init();
    
    // Forcer un nettoyage ciblé après un court délai
    setTimeout(function() {
        console.log("Fix-navigation : correction finale");
        
        // Récupérer la vue active
        const activeView = sessionStorage.getItem('activeView') || 'dashboard';
        
        // Nettoyer uniquement les éléments de menu inactifs
        document.querySelectorAll('#sidebar ul li').forEach(item => {
            const link = item.querySelector('[data-view]');
            if (link && link.getAttribute('data-view') !== activeView) {
                item.classList.remove('active');
            }
        });
        
        // S'assurer que l'élément de menu actif a bien la classe active
        const activeMenuItem = document.querySelector(`[data-view="${activeView}"]`);
        if (activeMenuItem && activeMenuItem.closest('li')) {
            activeMenuItem.closest('li').classList.add('active');
        }
    }, 200);
});
