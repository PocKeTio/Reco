/**
 * Système de gestion des traductions pour l'application
 */
class I18nManager {
    constructor() {
        // Langue par défaut
        this.defaultLanguage = 'fr';
        // Langue actuelle (récupérée du localStorage ou par défaut)
        this.currentLanguage = localStorage.getItem('appLanguage') || this.defaultLanguage;
        // Cache des traductions 
        this.translations = {};
        // Langues disponibles
        this.availableLanguages = [
            { code: 'fr', name: 'Français' },
            { code: 'en', name: 'English' },
            { code: 'es', name: 'Español' }
        ];
        
        // Initialiser
        this.init();
    }
    
    /**
     * Initialise le système de traduction
     */
    async init() {
        try {
            // Charger les traductions pour la langue actuelle
            await this.loadTranslations(this.currentLanguage);
            
            // Définir la langue dans l'attribut HTML
            document.documentElement.lang = this.currentLanguage;
            
            // Traduire l'interface
            this.translateUI();
            
            // Mettre à jour le sélecteur de langue s'il existe
            this.updateLanguageSelector();
            
            // Émettre un événement pour informer l'application du chargement des traductions
            document.dispatchEvent(new CustomEvent('i18nLoaded', { 
                detail: { language: this.currentLanguage } 
            }));
        } catch (error) {
            console.error('Erreur lors de l\'initialisation des traductions:', error);
            // Fallback à la langue par défaut si une erreur se produit
            if (this.currentLanguage !== this.defaultLanguage) {
                this.currentLanguage = this.defaultLanguage;
                localStorage.setItem('appLanguage', this.defaultLanguage);
                await this.loadTranslations(this.defaultLanguage);
            }
        }
    }
    
    /**
     * Charge les traductions pour une langue donnée
     * @param {string} lang - Code de la langue à charger
     */
    async loadTranslations(lang) {
        // Si les traductions sont déjà en cache, pas besoin de les recharger
        if (this.translations[lang]) {
            return;
        }
        
        try {
            // Charger le fichier de traduction
            const response = await fetch(`i18n/${lang}.js`);
            if (!response.ok) {
                throw new Error(`Impossible de charger le fichier de traduction pour ${lang}`);
            }
            
            const text = await response.text();
            
            // Extraire l'objet de traduction du texte JavaScript
            const startIndex = text.indexOf('{');
            const endIndex = text.lastIndexOf('}');
            const translationsObj = JSON.parse(text.substring(startIndex, endIndex + 1));
            
            // Stocker les traductions dans le cache
            this.translations[lang] = translationsObj;
        } catch (error) {
            console.error(`Erreur lors du chargement des traductions pour ${lang}:`, error);
            throw error;
        }
    }
    
    /**
     * Change la langue actuelle
     * @param {string} lang - Code de la langue à définir
     */
    async changeLanguage(lang) {
        if (!this.availableLanguages.some(l => l.code === lang)) {
            console.error(`Langue '${lang}' non disponible`);
            return;
        }
        
        try {
            // Charger les traductions pour la nouvelle langue
            await this.loadTranslations(lang);
            
            // Mettre à jour la langue actuelle
            this.currentLanguage = lang;
            localStorage.setItem('appLanguage', lang);
            
            // Mettre à jour l'attribut de langue HTML
            document.documentElement.lang = lang;
            
            // Traduire l'interface
            this.translateUI();
            
            // Mettre à jour le sélecteur de langue
            this.updateLanguageSelector();
            
            // Mettre à jour l'apparence des boutons de langue
            this.updateLanguageButtons(lang);
            
            // Mettre à jour les graphiques et tableaux dynamiques
            this.updateDynamicElements();
            
            // Événement personnalisé pour signaler le changement de langue
            document.dispatchEvent(new CustomEvent('languageChanged', { detail: { language: lang } }));
        } catch (error) {
            console.error(`Erreur lors du changement de langue vers ${lang}:`, error);
        }
    }
    
    /**
     * Traduit un texte selon la langue actuelle
     * @param {string} key - Clé de traduction
     * @param {Object} params - Paramètres de substitution (optionnel)
     * @returns {string} - Texte traduit
     */
    translate(key, params = {}) {
        // Récupérer les traductions pour la langue actuelle
        const langTranslations = this.translations[this.currentLanguage] || {};
        
        // Récupérer la traduction ou utiliser la clé comme fallback
        let translation = langTranslations[key] || key;
        
        // Remplacer les paramètres s'il y en a
        if (params && Object.keys(params).length > 0) {
            Object.keys(params).forEach(param => {
                const regex = new RegExp(`{{\\s*${param}\\s*}}`, 'g');
                translation = translation.replace(regex, params[param]);
            });
        }
        
        return translation;
    }
    
    /**
     * Traduit l'interface utilisateur complète
     */
    translateUI() {
        // Traduire tous les éléments avec l'attribut data-i18n
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            element.textContent = this.translate(key);
        });
        
        // Traduire les attributs placeholder, title, alt
        ['placeholder', 'title', 'alt'].forEach(attr => {
            document.querySelectorAll(`[data-i18n-${attr}]`).forEach(element => {
                const key = element.getAttribute(`data-i18n-${attr}`);
                element.setAttribute(attr, this.translate(key));
            });
        });
    }
    
    /**
     * Met à jour le sélecteur de langue dans l'interface
     */
    updateLanguageSelector() {
        const selector = document.getElementById('language-selector');
        if (!selector) return;
        
        // Mettre à jour la sélection actuelle
        selector.value = this.currentLanguage;
    }
    
    /**
     * Initialise le sélecteur de langue
     */
    initLanguageSelector() {
        const selector = document.getElementById('language-selector');
        if (!selector) return;
        
        // Vider le sélecteur
        selector.innerHTML = '';
        
        // Ajouter les options pour chaque langue disponible
        this.availableLanguages.forEach(lang => {
            const option = document.createElement('option');
            option.value = lang.code;
            option.textContent = lang.name;
            selector.appendChild(option);
        });
        
        // Définir la langue actuelle
        selector.value = this.currentLanguage;
        
        // Ajouter l'écouteur d'événements
        selector.addEventListener('change', (e) => {
            this.changeLanguage(e.target.value);
        });
    }
    
    /**
     * Met à jour l'apparence des boutons de langue
     * @param {string} activeLang - Langue active
     */
    updateLanguageButtons(activeLang) {
        // Réinitialiser tous les boutons
        document.querySelectorAll('[data-lang]').forEach(btn => {
            btn.classList.remove('btn-primary');
            btn.classList.add('btn-outline-secondary');
            btn.classList.remove('active');
            btn.setAttribute('aria-pressed', 'false');
        });
        
        // Activer le bouton de la langue sélectionnée
        const activeButton = document.querySelector(`[data-lang="${activeLang}"]`);
        if (activeButton) {
            activeButton.classList.remove('btn-outline-secondary');
            activeButton.classList.add('btn-primary');
            activeButton.classList.remove('active');
            activeButton.setAttribute('aria-pressed', 'false');
        }
    }
    
    /**
     * Met à jour les éléments dynamiques (graphiques, tableaux, etc.)
     */
    updateDynamicElements() {
        this.updateChartLabels();
        this.updateTableHeaders();
        this.updateDynamicContent();
    }
    
    /**
     * Met à jour les étiquettes des graphiques
     */
    updateChartLabels() {
        if (window.charts) {
            Object.values(window.charts).forEach(chart => {
                if (chart && chart.config) {
                    if (chart.config.options.title && chart.config.options.title.text) {
                        const key = chart.config.options.title._titleI18n;
                        if (key && this.translations[this.currentLanguage][key]) {
                            chart.config.options.title.text = this.translations[this.currentLanguage][key];
                        }
                    }
                    
                    if (chart.config.options.scales && chart.config.options.scales.xAxes) {
                        chart.config.options.scales.xAxes.forEach(axis => {
                            if (axis.scaleLabel && axis.scaleLabel._labelI18n) {
                                const key = axis.scaleLabel._labelI18n;
                                if (this.translations[this.currentLanguage][key]) {
                                    axis.scaleLabel.labelString = this.translations[this.currentLanguage][key];
                                }
                            }
                        });
                    }
                    
                    if (chart.config.options.scales && chart.config.options.scales.yAxes) {
                        chart.config.options.scales.yAxes.forEach(axis => {
                            if (axis.scaleLabel && axis.scaleLabel._labelI18n) {
                                const key = axis.scaleLabel._labelI18n;
                                if (this.translations[this.currentLanguage][key]) {
                                    axis.scaleLabel.labelString = this.translations[this.currentLanguage][key];
                                }
                            }
                        });
                    }
                    
                    chart.update();
                }
            });
        }
    }
    
    /**
     * Met à jour les en-têtes de tableau
     */
    updateTableHeaders() {
        // Implémentation pour les tableaux générés dynamiquement
        document.querySelectorAll('th[data-i18n]').forEach(header => {
            const key = header.getAttribute('data-i18n');
            if (key && this.translations[this.currentLanguage][key]) {
                header.textContent = this.translations[this.currentLanguage][key];
            }
        });
    }
    
    /**
     * Met à jour tout contenu généré dynamiquement
     */
    updateDynamicContent() {
        // Mettre à jour les éléments de l'interface utilisateur qui sont générés dynamiquement
        // comme les modales, messages d'erreur, etc.
        
        // Émettre un événement pour que les modules externes puissent réagir
        document.dispatchEvent(new CustomEvent('dynamicContentUpdate', { 
            detail: { language: this.currentLanguage, translations: this.translations[this.currentLanguage] } 
        }));
    }
}

// Créer une instance globale du gestionnaire i18n
const i18n = new I18nManager();

// Fonction abrégée pour faciliter la traduction
window.__ = function(key, params = {}) {
    return i18n.translate(key, params);
};

// Exposer l'instance i18n globalement
window.i18n = i18n;

// Initialiser les écouteurs d'événements pour les boutons de langue après le chargement du DOM
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('[data-lang]').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const lang = this.getAttribute('data-lang');
            i18n.changeLanguage(lang);
        });
    });
    
    // Initialiser le sélecteur de langue s'il existe
    i18n.initLanguageSelector();
    
    // Mettre à jour l'apparence des boutons de langue
    i18n.updateLanguageButtons(i18n.currentLanguage);
});
