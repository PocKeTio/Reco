/**
 * Gestionnaire dédié pour le changement de langue
 * Version simplifiée pour éviter les problèmes de boutons "appuyés"
 */
document.addEventListener('DOMContentLoaded', function() {
    // Référence aux boutons de langue
    const btnFr = document.getElementById('btn-lang-fr');
    const btnEs = document.getElementById('btn-lang-es');
    
    // Langues disponibles
    const languages = {
        'fr': 'Français',
        'es': 'Español'
    };
    
    // Charge la langue enregistrée ou français par défaut
    const savedLang = localStorage.getItem('preferredLanguage') || 'fr';
    
    // Fonction pour activer un bouton de langue et désactiver l'autre
    function setActiveLanguage(lang) {
        // Désactiver tous les boutons d'abord
        btnFr.classList.remove('btn-primary');
        btnFr.classList.add('btn-outline-secondary');
        btnEs.classList.remove('btn-primary');
        btnEs.classList.add('btn-outline-secondary');
        
        // Activer le bouton de la langue sélectionnée
        if (lang === 'fr') {
            btnFr.classList.remove('btn-outline-secondary');
            btnFr.classList.add('btn-primary');
        } else if (lang === 'es') {
            btnEs.classList.remove('btn-outline-secondary');
            btnEs.classList.add('btn-primary');
        }
        
        // Mettre à jour la langue dans le stockage local
        localStorage.setItem('preferredLanguage', lang);
        
        // Charger les traductions si la fonction existe
        if (window.i18n && typeof window.i18n.loadTranslations === 'function') {
            window.i18n.loadTranslations(lang);
        }
    }
    
    // Initialiser l'état des boutons
    setActiveLanguage(savedLang);
    
    // Gestionnaires d'événements pour les boutons
    btnFr.addEventListener('click', function(e) {
        e.preventDefault();
        setActiveLanguage('fr');
    });
    
    btnEs.addEventListener('click', function(e) {
        e.preventDefault();
        setActiveLanguage('es');
    });
});
