// Script pour la gestion multilingue de l'application
document.addEventListener('DOMContentLoaded', function() {
    // Langues disponibles
    const languages = {
        'fr': 'Français',
        'es': 'Español'
    };
    
    // Langue par défaut
    let currentLang = localStorage.getItem('preferredLanguage') || 'fr';
    
    // Fonction pour charger les traductions
    function loadTranslations(lang) {
        // Les traductions sont chargées dans des variables globales via les scripts
        if (lang === 'fr' && window.translations_fr) {
            applyTranslations(window.translations_fr);
            localStorage.setItem('preferredLanguage', lang);
            return;
        }
        else if (lang === 'es' && window.translations_es) {
            applyTranslations(window.translations_es);
            localStorage.setItem('preferredLanguage', lang);
            return;
        }
        
        console.error('Traductions non trouvées pour la langue:', lang);
    }
    
    // Fonction pour appliquer les traductions à tous les éléments
    function applyTranslations(translations) {
        // Appliquer les traductions aux éléments statiques
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (translations[key]) {
                el.textContent = translations[key];
            }
        });
        
        // Appliquer les traductions aux placeholders
        const placeholders = document.querySelectorAll('[data-i18n-placeholder]');
        placeholders.forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            if (translations[key]) {
                el.setAttribute('placeholder', translations[key]);
            }
        });
        
        // Appliquer les traductions aux titres
        const titles = document.querySelectorAll('[data-i18n-title]');
        titles.forEach(el => {
            const key = el.getAttribute('data-i18n-title');
            if (translations[key]) {
                el.setAttribute('title', translations[key]);
            }
        });
        
        // Appliquer les traductions aux boutons et autres éléments
        updateChartLabels(translations);
        updateTableHeaders(translations);
        updateDynamicContent(translations);
    }
    
    // Mettre à jour les étiquettes des graphiques
    function updateChartLabels(translations) {
        if (window.charts) {
            Object.values(window.charts).forEach(chart => {
                if (chart && chart.config) {
                    if (chart.config.options.title && chart.config.options.title.text) {
                        const key = chart.config.options.title._titleI18n;
                        if (key && translations[key]) {
                            chart.config.options.title.text = translations[key];
                        }
                    }
                    
                    if (chart.config.options.scales && chart.config.options.scales.xAxes) {
                        chart.config.options.scales.xAxes.forEach(axis => {
                            if (axis.scaleLabel && axis.scaleLabel._labelI18n) {
                                const key = axis.scaleLabel._labelI18n;
                                if (translations[key]) {
                                    axis.scaleLabel.labelString = translations[key];
                                }
                            }
                        });
                    }
                    
                    if (chart.config.options.scales && chart.config.options.scales.yAxes) {
                        chart.config.options.scales.yAxes.forEach(axis => {
                            if (axis.scaleLabel && axis.scaleLabel._labelI18n) {
                                const key = axis.scaleLabel._labelI18n;
                                if (translations[key]) {
                                    axis.scaleLabel.labelString = translations[key];
                                }
                            }
                        });
                    }
                    
                    chart.update();
                }
            });
        }
    }
    
    // Mettre à jour les en-têtes des tableaux et autres éléments dynamiques
    function updateTableHeaders(translations) {
        // Pourrait être implémenté si des tableaux sont générés dynamiquement
        // et nécessitent une traduction
    }
    
    // Mettre à jour tout contenu généré dynamiquement
    function updateDynamicContent(translations) {
        // Pourrait être implémenté pour d'autres éléments dynamiques
        // comme les modales, messages d'erreur, etc.
    }
    
    // Fonction dédiée pour mettre à jour l'apparence des boutons de langue
    function updateLanguageButtons(activeLang) {
        // Réinitialiser tous les boutons
        document.querySelectorAll('[data-lang]').forEach(btn => {
            btn.classList.remove('btn-primary');
            btn.classList.add('btn-outline-secondary');
            // S'assurer que le bouton n'est pas "enfoncé"
            btn.classList.remove('active');
            btn.setAttribute('aria-pressed', 'false');
        });
        
        // Activer le bouton de la langue sélectionnée
        const activeButton = document.querySelector(`[data-lang="${activeLang}"]`);
        if (activeButton) {
            activeButton.classList.remove('btn-outline-secondary');
            activeButton.classList.add('btn-primary');
            // Éviter l'effet "bouton enfoncé"
            activeButton.classList.remove('active');
            activeButton.setAttribute('aria-pressed', 'false');
        }
    }
    
    // Gestionnaire d'événements pour les boutons de langue
    document.querySelectorAll('[data-lang]').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const lang = this.getAttribute('data-lang');
            if (languages[lang]) {
                // Mettre à jour l'apparence des boutons de langue
                updateLanguageButtons(lang);
                
                // Charger les traductions
                currentLang = lang;
                loadTranslations(lang);
            }
        });
    });
    
    // Initialiser la langue au chargement
    loadTranslations(currentLang);
    
    // Mettre à jour l'apparence du bouton de langue actif
    updateLanguageButtons(currentLang);
    
    // Exposer les fonctions et variables pour d'autres scripts
    window.i18n = {
        currentLang,
        loadTranslations,
        applyTranslations,
        updateChartLabels,
        updateLanguageButtons
    };
});
