// Initialisation des graphiques du tableau de bord
document.addEventListener('DOMContentLoaded', function() {
    // Vérifier si nous sommes sur la page du tableau de bord
    if (document.getElementById('dashboard-view').classList.contains('active')) {
        initializeCharts();
    }
    
    // Initialiser les graphiques lorsqu'on active le tableau de bord
    document.querySelectorAll('[data-view="dashboard"]').forEach(function(element) {
        element.addEventListener('click', function() {
            setTimeout(function() {
                initializeCharts();
            }, 300); // Délai pour permettre le changement de vue
        });
    });
});

// Fonction pour initialiser tous les graphiques
function initializeCharts() {
    initSuspensChart();
    initAgeDistributionChart();
    initCurrencyChart();
    initMatchPerformanceChart();
}

// Graphique d'évolution des suspens
function initSuspensChart() {
    const ctx = document.getElementById('suspensChart');
    
    if (!ctx) return;
    
    // Détruire le graphique précédent s'il existe
    if (ctx.chart) {
        ctx.chart.destroy();
    }

    const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
    const currentMonth = new Date().getMonth();
    const labels = [];
    
    // Créer les étiquettes pour les 6 derniers mois
    for (let i = 5; i >= 0; i--) {
        const monthIndex = (currentMonth - i + 12) % 12;
        labels.push(months[monthIndex]);
    }

    const data = {
        labels: labels,
        datasets: [
            {
                label: 'Suspens créés',
                data: [45000, 52000, 48000, 61000, 42000, 58000],
                borderColor: 'rgba(255, 152, 0, 1)',
                backgroundColor: 'rgba(255, 152, 0, 0.1)',
                borderWidth: 2,
                tension: 0.3,
                fill: true
            },
            {
                label: 'Suspens rapprochés',
                data: [32000, 48000, 40000, 49000, 35000, 42750],
                borderColor: 'rgba(76, 175, 80, 1)',
                backgroundColor: 'rgba(76, 175, 80, 0.1)',
                borderWidth: 2,
                tension: 0.3,
                fill: true
            }
        ]
    };

    const config = {
        type: 'line',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        usePointStyle: true,
                        padding: 15
                    }
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            label += new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(context.raw);
                            return label;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumSignificantDigits: 3 }).format(value);
                        }
                    }
                }
            }
        }
    };

    ctx.chart = new Chart(ctx, config);
}

// Graphique de répartition par âge des suspens
function initAgeDistributionChart() {
    const ctx = document.getElementById('ageDistributionChart');
    
    if (!ctx) return;
    
    // Détruire le graphique précédent s'il existe
    if (ctx.chart) {
        ctx.chart.destroy();
    }

    const data = {
        labels: ['< 7 jours', '7-15 jours', '15-30 jours', '30-60 jours', '> 60 jours'],
        datasets: [
            {
                data: [35, 25, 20, 15, 5],
                backgroundColor: [
                    'rgba(3, 169, 244, 0.8)',
                    'rgba(67, 97, 238, 0.8)',
                    'rgba(255, 152, 0, 0.8)',
                    'rgba(244, 67, 54, 0.8)',
                    'rgba(156, 39, 176, 0.8)'
                ],
                borderColor: [
                    'rgba(3, 169, 244, 1)',
                    'rgba(67, 97, 238, 1)',
                    'rgba(255, 152, 0, 1)',
                    'rgba(244, 67, 54, 1)',
                    'rgba(156, 39, 176, 1)'
                ],
                borderWidth: 1,
                hoverOffset: 5
            }
        ]
    };

    const config = {
        type: 'doughnut',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '70%',
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        padding: 15,
                        usePointStyle: true,
                        generateLabels: function(chart) {
                            const data = chart.data;
                            if (data.labels.length && data.datasets.length) {
                                return data.labels.map(function(label, i) {
                                    const dataset = data.datasets[0];
                                    const value = dataset.data[i];
                                    const backgroundColor = dataset.backgroundColor[i];
                                    const total = dataset.data.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
                                    const percentage = Math.round((value / total) * 100) + '%';
                                    
                                    return {
                                        text: `${label} (${percentage})`,
                                        fillStyle: backgroundColor,
                                        strokeStyle: dataset.borderColor[i],
                                        lineWidth: 1,
                                        hidden: false,
                                        index: i
                                    };
                                });
                            }
                            return [];
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.raw;
                            const total = context.dataset.data.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
                            const percentage = Math.round((value / total) * 100);
                            return `${label}: ${percentage}% (${value} suspens)`;
                        }
                    }
                }
            }
        }
    };

    ctx.chart = new Chart(ctx, config);
}

// Graphique de répartition par devise
function initCurrencyChart() {
    const ctx = document.getElementById('currencyChart');
    
    if (!ctx) return;
    
    // Détruire le graphique précédent s'il existe
    if (ctx.chart) {
        ctx.chart.destroy();
    }

    const data = {
        labels: ['EUR', 'USD', 'GBP', 'CHF', 'Autres'],
        datasets: [
            {
                label: 'Montant par devise',
                data: [65, 20, 8, 5, 2],
                backgroundColor: [
                    'rgba(67, 97, 238, 0.8)',
                    'rgba(3, 169, 244, 0.8)',
                    'rgba(76, 175, 80, 0.8)',
                    'rgba(255, 152, 0, 0.8)',
                    'rgba(156, 39, 176, 0.8)'
                ],
                borderColor: [
                    'rgba(67, 97, 238, 1)',
                    'rgba(3, 169, 244, 1)',
                    'rgba(76, 175, 80, 1)',
                    'rgba(255, 152, 0, 1)',
                    'rgba(156, 39, 176, 1)'
                ],
                borderWidth: 1
            }
        ]
    };

    const config = {
        type: 'polarArea',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                r: {
                    ticks: {
                        display: false
                    }
                }
            },
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        usePointStyle: true,
                        generateLabels: function(chart) {
                            const data = chart.data;
                            if (data.labels.length && data.datasets.length) {
                                return data.labels.map(function(label, i) {
                                    const dataset = data.datasets[0];
                                    const value = dataset.data[i];
                                    const backgroundColor = dataset.backgroundColor[i];
                                    const total = dataset.data.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
                                    const percentage = Math.round((value / total) * 100) + '%';
                                    
                                    return {
                                        text: `${label} (${percentage})`,
                                        fillStyle: backgroundColor,
                                        strokeStyle: dataset.borderColor[i],
                                        lineWidth: 1,
                                        hidden: false,
                                        index: i
                                    };
                                });
                            }
                            return [];
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.raw;
                            const total = context.dataset.data.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
                            const percentage = Math.round((value / total) * 100);
                            return `${label}: ${percentage}%`;
                        }
                    }
                }
            }
        }
    };

    ctx.chart = new Chart(ctx, config);
}

// Graphique de performance de rapprochement
function initMatchPerformanceChart() {
    const ctx = document.getElementById('matchPerformanceChart');
    
    if (!ctx) return;
    
    // Détruire le graphique précédent s'il existe
    if (ctx.chart) {
        ctx.chart.destroy();
    }

    const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun'];
    
    const data = {
        labels: months,
        datasets: [
            {
                label: 'Taux de rapprochement',
                data: [75, 78, 82, 79, 85, 88],
                borderColor: 'rgba(3, 169, 244, 1)',
                backgroundColor: 'rgba(3, 169, 244, 0.1)',
                borderWidth: 2,
                yAxisID: 'y',
                type: 'line',
                fill: true,
                tension: 0.4
            },
            {
                label: 'Temps moyen (jours)',
                data: [18, 16, 14, 15, 13, 12],
                borderColor: 'rgba(156, 39, 176, 1)',
                backgroundColor: 'rgba(156, 39, 176, 0.8)',
                borderWidth: 2,
                yAxisID: 'y1',
                type: 'bar'
            }
        ]
    };

    const config = {
        type: 'line',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: 'index',
                intersect: false
            },
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        usePointStyle: true
                    }
                },
                tooltip: {
                    mode: 'index',
                    intersect: false
                }
            },
            scales: {
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    title: {
                        display: true,
                        text: 'Taux (%)'
                    },
                    min: 70,
                    max: 100,
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    title: {
                        display: true,
                        text: 'Jours'
                    },
                    min: 0,
                    max: 20,
                    grid: {
                        drawOnChartArea: false
                    }
                }
            }
        }
    };

    ctx.chart = new Chart(ctx, config);
}
