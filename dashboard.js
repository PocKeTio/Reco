/**
 * dashboard.js - Gestion avancée du tableau de bord et des KPIs
 * 
 * Fonctionnalités:
 * - Affichage des KPIs dynamiques
 * - Actualisation automatique des statistiques
 * - Visualisation des tendances de rapprochement
 * - Alertes et notifications interactives
 */

// Configuration des tableaux de bord et des KPIs
const dashboardConfig = {
    refreshInterval: 300000, // 5 minutes
    kpiThresholds: {
        suspensAging: {
            warning: 15,  // jours
            critical: 30  // jours
        },
        matchRate: {
            low: 85,      // pourcentage
            target: 95    // pourcentage
        }
    }
};

// Initialisation du tableau de bord
document.addEventListener('DOMContentLoaded', function() {
    // Initialiser les graphiques
    initCharts();
    
    // Charger les données initiales
    loadDashboardData();
    
    // Configurer l'actualisation périodique
    setInterval(loadDashboardData, dashboardConfig.refreshInterval);
    
    // Écouter les changements de langue
    document.addEventListener('languageChanged', function(e) {
        updateChartsLabels();
    });
    
    // Lier les actions des KPIs
    setupKpiActions();
});

/**
 * Charge les données du tableau de bord depuis l'API
 */
function loadDashboardData() {
    // Simuler une requête API pour le moment
    // Dans un environnement réel, ceci serait remplacé par un appel AJAX
    
    // Données pour les KPIs
    updateKpiValues({
        matched_this_month: { value: 152350, count: 64 },
        pending_payments: { value: 87620, count: 31 },
        suspens_total: { value: 45980, count: 18 },
        auto_matched: { value: 95460, count: 42, rate: 92 }
    });
    
    // Données pour les graphiques
    updateChartData();
    
    // Vérifier et afficher les alertes
    checkAlerts();
}

/**
 * Met à jour les valeurs des KPIs dans l'interface
 */
function updateKpiValues(data) {
    // Mettre à jour les KPIs avec les valeurs fournies
    if (data.matched_this_month) {
        document.querySelector('.kpi-card:nth-child(1) h3').textContent = 
            formatCurrency(data.matched_this_month.value);
        document.querySelector('.kpi-card:nth-child(1) .kpi-count').innerHTML = 
            `<i class="fas fa-exchange-alt me-1"></i>${data.matched_this_month.count} transactions`;
    }
    
    if (data.pending_payments) {
        document.querySelector('.kpi-card:nth-child(2) h3').textContent = 
            formatCurrency(data.pending_payments.value);
        document.querySelector('.kpi-card:nth-child(2) .kpi-count').innerHTML = 
            `<i class="fas fa-clock me-1"></i>${data.pending_payments.count} transactions`;
    }
    
    if (data.suspens_total) {
        document.querySelector('.kpi-card:nth-child(3) h3').textContent = 
            formatCurrency(data.suspens_total.value);
        document.querySelector('.kpi-card:nth-child(3) .kpi-count').innerHTML = 
            `<i class="fas fa-exclamation-triangle me-1"></i>${data.suspens_total.count} transactions`;
            
        // Afficher des alertes visuelles si le nombre de suspens est élevé
        const suspensCard = document.querySelector('.kpi-card:nth-child(3)');
        if (data.suspens_total.count > 25) {
            suspensCard.classList.add('alert-warning');
        } else {
            suspensCard.classList.remove('alert-warning');
        }
    }
    
    if (data.auto_matched) {
        document.querySelector('.kpi-card:nth-child(4) h3').textContent = 
            formatCurrency(data.auto_matched.value);
        
        const rateText = data.auto_matched.rate !== undefined 
            ? ` (${data.auto_matched.rate}%)` 
            : '';
        
        document.querySelector('.kpi-card:nth-child(4) .kpi-count').innerHTML = 
            `<i class="fas fa-robot me-1"></i>${data.auto_matched.count} transactions${rateText}`;
            
        // Visualisation de la performance du rapprochement automatique
        const autoMatchCard = document.querySelector('.kpi-card:nth-child(4)');
        if (data.auto_matched.rate < dashboardConfig.kpiThresholds.matchRate.low) {
            autoMatchCard.classList.add('alert-danger');
            autoMatchCard.classList.remove('alert-success');
        } else if (data.auto_matched.rate >= dashboardConfig.kpiThresholds.matchRate.target) {
            autoMatchCard.classList.add('alert-success');
            autoMatchCard.classList.remove('alert-danger');
        } else {
            autoMatchCard.classList.remove('alert-success', 'alert-danger');
        }
    }
}

/**
 * Initialise les graphiques du tableau de bord
 */
function initCharts() {
    // Graphique d'évolution des suspens
    const suspensCtx = document.getElementById('suspensEvolutionChart').getContext('2d');
    window.charts = window.charts || {};
    window.charts.suspensEvolution = new Chart(suspensCtx, {
        type: 'line',
        data: {
            labels: [window.__('january'), window.__('february'), window.__('march'), window.__('april'), window.__('may'), window.__('june')],
            datasets: [{
                label: window.__('open_suspens'),
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 2,
                data: [25, 32, 30, 20, 18, 14],
                tension: 0.4
            }, {
                label: window.__('unmatched_payments_chart'),
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 2,
                data: [42, 38, 35, 32, 31, 28],
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            title: {
                display: true,
                text: window.__('evolution_chart'),
                _titleI18n: 'evolution_chart'
            },
            scales: {
                x: {
                    display: true,
                    title: {
                        display: true,
                        text: window.__('date')
                    }
                },
                y: {
                    display: true,
                    title: {
                        display: true,
                        text: window.__('number')
                    },
                    beginAtZero: true
                }
            }
        }
    });

    // Graphique de distribution par âge
    const ageDistCtx = document.getElementById('ageDistributionChart').getContext('2d');
    window.charts.ageDistribution = new Chart(ageDistCtx, {
        type: 'doughnut',
        data: {
            labels: [
                window.__('less_than_15_days'), 
                window.__('15_30_days'), 
                window.__('30_60_days'), 
                window.__('more_than_60_days')
            ],
            datasets: [{
                data: [60, 25, 10, 5],
                backgroundColor: [
                    'rgba(75, 192, 192, 0.7)',
                    'rgba(255, 206, 86, 0.7)',
                    'rgba(255, 159, 64, 0.7)',
                    'rgba(255, 99, 132, 0.7)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            title: {
                display: true,
                text: window.__('age_distribution_chart'),
                _titleI18n: 'age_distribution_chart'
            },
            legend: {
                position: 'right'
            }
        }
    });
}

/**
 * Met à jour les données des graphiques
 */
function updateChartData() {
    // Simuler de nouvelles données (dans un environnement réel, ces données viendraient de l'API)
    const newSuspensData = [25, 32, 30, 20, 18, 15];
    const newPaymentsData = [42, 38, 35, 32, 31, 29];
    const newAgeData = [65, 20, 10, 5];

    // Mettre à jour les données du graphique d'évolution
    if (window.charts && window.charts.suspensEvolution) {
        window.charts.suspensEvolution.data.datasets[0].data = newSuspensData;
        window.charts.suspensEvolution.data.datasets[1].data = newPaymentsData;
        window.charts.suspensEvolution.update();
    }

    // Mettre à jour les données du graphique de distribution par âge
    if (window.charts && window.charts.ageDistribution) {
        window.charts.ageDistribution.data.datasets[0].data = newAgeData;
        window.charts.ageDistribution.update();
    }
}

/**
 * Met à jour les étiquettes des graphiques après un changement de langue
 */
function updateChartsLabels() {
    if (window.charts && window.charts.suspensEvolution) {
        // Mettre à jour les étiquettes de mois
        window.charts.suspensEvolution.data.labels = [
            window.__('january'), window.__('february'), window.__('march'), 
            window.__('april'), window.__('may'), window.__('june')
        ];
        
        // Mettre à jour les légendes
        window.charts.suspensEvolution.data.datasets[0].label = window.__('open_suspens');
        window.charts.suspensEvolution.data.datasets[1].label = window.__('unmatched_payments_chart');
        
        // Mettre à jour le titre
        window.charts.suspensEvolution.options.title.text = window.__('evolution_chart');
        
        // Mettre à jour les axes
        window.charts.suspensEvolution.options.scales.x.title.text = window.__('date');
        window.charts.suspensEvolution.options.scales.y.title.text = window.__('number');
        
        window.charts.suspensEvolution.update();
    }
    
    if (window.charts && window.charts.ageDistribution) {
        // Mettre à jour les étiquettes d'âge
        window.charts.ageDistribution.data.labels = [
            window.__('less_than_15_days'), 
            window.__('15_30_days'), 
            window.__('30_60_days'), 
            window.__('more_than_60_days')
        ];
        
        // Mettre à jour le titre
        window.charts.ageDistribution.options.title.text = window.__('age_distribution_chart');
        
        window.charts.ageDistribution.update();
    }
}

/**
 * Configure les actions interactives sur les KPIs
 */
function setupKpiActions() {
    // Ajouter un comportement de clic sur les KPIs
    document.querySelectorAll('.kpi-card').forEach((card, index) => {
        card.addEventListener('click', function() {
            const nav = document.querySelector('.sidebar-nav');
            switch(index) {
                case 0: // Matched this month
                    navigateTo('payments');
                    break;
                case 1: // Pending payments
                    navigateTo('payments');
                    break;
                case 2: // Suspens total
                    navigateTo('suspens');
                    break;
                case 3: // Auto matched
                    navigateTo('auto-matched');
                    break;
            }
        });
        
        // Ajouter un effet de survol
        card.classList.add('kpi-interactive');
    });
}

/**
 * Vérifie et affiche les alertes pertinentes
 */
function checkAlerts() {
    // Vérifier les suspens critiques
    // Exemple: simuler une alerte
    const criticalSuspens = 3;
    
    if (criticalSuspens > 0) {
        createAlert({
            type: 'warning',
            title: window.__('suspens_alert_title'),
            message: window.__('suspens_alert_message', {count: criticalSuspens}),
            timeout: 7000
        });
    }
}

/**
 * Crée et affiche une alerte dans l'interface
 */
function createAlert(options) {
    const alertsContainer = document.querySelector('.alerts-container');
    if (!alertsContainer) {
        // Créer le conteneur s'il n'existe pas
        const container = document.createElement('div');
        container.className = 'alerts-container';
        document.body.appendChild(container);
    }
    
    const alert = document.createElement('div');
    alert.className = `alert alert-${options.type} alert-dismissible fade show`;
    alert.role = 'alert';
    
    alert.innerHTML = `
        <strong>${options.title}</strong> ${options.message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    
    document.querySelector('.alerts-container').appendChild(alert);
    
    if (options.timeout) {
        setTimeout(() => {
            alert.classList.remove('show');
            setTimeout(() => alert.remove(), 150);
        }, options.timeout);
    }
}

/**
 * Formate un montant en devise
 */
function formatCurrency(amount) {
    return new Intl.NumberFormat('fr-FR', { 
        style: 'currency', 
        currency: 'EUR',
        maximumFractionDigits: 0
    }).format(amount);
}

/**
 * Navigation simplifiée
 */
function navigateTo(section) {
    // Activer l'onglet correspondant
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-section') === section) {
            link.classList.add('active');
        }
    });
    
    // Afficher la section correspondante
    document.querySelectorAll('.content-section').forEach(content => {
        content.classList.add('d-none');
        if (content.id === section + '-content') {
            content.classList.remove('d-none');
        }
    });
}
