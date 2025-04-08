/**
 * Module de gestion de la navigation - Solution radicale pour résoudre les problèmes d'état actif
 */

// Attendre que le DOM soit complètement chargé
document.addEventListener('DOMContentLoaded', function() {
    console.log('Navigation module initialized');
    
    // Capture toutes les actions de navigation pour les router par notre gestionnaire
    document.querySelectorAll('[data-view]').forEach(link => {
        link.addEventListener('click', function(e) {
            // Empêcher la navigation par défaut
            e.preventDefault();
            
            // Obtenir la vue cible
            const targetView = this.getAttribute('data-view');
            console.log('Navigation requested to:', targetView);
            
            // Utiliser notre gestionnaire
            navigateTo(targetView);
        });
    });
    
    // Fonction principale de navigation
    function navigateTo(viewName) {
        // 1. RESET COMPLET - Supprimer toutes les classes 'active' partout dans la page
        console.log('Performing complete reset of active states');
        document.querySelectorAll('.active').forEach(element => {
            element.classList.remove('active');
        });
        
        // 2. Masquer toutes les vues
        document.querySelectorAll('.content-view').forEach(view => {
            view.classList.remove('active');
            view.style.display = 'none';
        });
        
        // 3. Activer la vue spécifique
        const viewElement = document.getElementById(viewName + '-view');
        if (viewElement) {
            viewElement.classList.add('active');
            viewElement.style.display = 'block';
            console.log('View activated:', viewName);
        }
        
        // 4. Activer l'élément de menu correspondant
        const menuItems = document.querySelectorAll('.sidebar ul li');
        menuItems.forEach(item => {
            // Réinitialiser complètement
            item.className = '';
            item.style = '';
            
            const link = item.querySelector('a');
            if (link) {
                link.style = '';
            }
        });
        
        // 5. Trouver et activer l'élément de menu correspondant
        const menuLink = document.querySelector(`[data-view="${viewName}"]`);
        if (menuLink && menuLink.closest('li')) {
            const menuItem = menuLink.closest('li');
            // Appliquer de façon explicite
            menuItem.className = 'active';
            menuLink.style.color = '#fff';
            console.log('Menu item activated:', viewName);
        }
        
        // 6. Sauvegarder l'état
        sessionStorage.setItem('activeView', viewName);
        
        // 7. Déclencher un événement personnalisé pour les autres modules
        document.dispatchEvent(new CustomEvent('navigationChanged', {
            detail: { view: viewName }
        }));
    }
    
    // Initialiser la navigation au chargement
    function initNavigation() {
        const savedView = sessionStorage.getItem('activeView') || 'dashboard';
        console.log('Initializing navigation to:', savedView);
        
        // Utiliser notre gestionnaire pour la cohérence
        navigateTo(savedView);
    }
    
    // Exposer l'API publique
    window.navigationManager = {
        navigateTo: navigateTo
    };
    
    // Exécuter l'initialisation
    // Utiliser setTimeout pour s'assurer que cela s'exécute après tout le reste
    setTimeout(initNavigation, 100);
});
