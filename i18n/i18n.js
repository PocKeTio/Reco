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
}

// Créer une instance globale du gestionnaire i18n
const i18n = new I18nManager();

// Fonction abrégée pour faciliter la traduction
function __(key, params = {}) {
    return i18n.translate(key, params);
}

// Exporter les objets si on est dans un environnement module
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { I18nManager, i18n, __ };
}
