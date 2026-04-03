// ===================================
// THEME MANAGEMENT
// ===================================

function getTheme() {
    return localStorage.getItem('theme') || 'light';
}

function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    updateChartColors(theme);
}

function toggleTheme() {
    const current = getTheme();
    setTheme(current === 'dark' ? 'light' : 'dark');
}

// Apply saved theme immediately (before DOMContentLoaded)
document.documentElement.setAttribute('data-theme', getTheme());

// ===================================
// CHART COLOR PALETTES
// ===================================

const colors = {
    purple: 'rgba(168, 85, 247, 0.8)',
    purpleBorder: 'rgba(168, 85, 247, 1)',
    blue: 'rgba(59, 130, 246, 0.8)',
    blueBorder: 'rgba(59, 130, 246, 1)',
    pink: 'rgba(236, 72, 153, 0.8)',
    pinkBorder: 'rgba(236, 72, 153, 1)',
    cyan: 'rgba(6, 182, 212, 0.8)',
    cyanBorder: 'rgba(6, 182, 212, 1)',
    gray: 'rgba(71, 85, 105, 0.8)',
};

const palette = [colors.purple, colors.blue, colors.pink, colors.cyan, colors.gray];

// Store chart instances for theme updates
const chartInstances = {};

function getChartDefaults(theme) {
    const isDark = theme === 'dark';
    return {
        textColor: isDark ? '#94a3b8' : '#64748b',
        gridColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.08)',
        tooltipBg: isDark ? 'rgba(15, 23, 42, 0.95)' : 'rgba(255, 255, 255, 0.95)',
        tooltipTextColor: isDark ? '#f8fafc' : '#1e293b',
        tooltipBorder: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
        polarBorderColor: isDark ? 'rgba(11, 10, 16, 1)' : 'rgba(240, 242, 245, 1)',
        rGridColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
    };
}

function updateChartColors(theme) {
    const defaults = getChartDefaults(theme);

    // Update global Chart.js defaults
    Chart.defaults.color = defaults.textColor;
    Chart.defaults.plugins.tooltip.backgroundColor = defaults.tooltipBg;
    Chart.defaults.plugins.tooltip.titleColor = defaults.tooltipTextColor;
    Chart.defaults.plugins.tooltip.bodyColor = defaults.tooltipTextColor;
    Chart.defaults.plugins.tooltip.borderColor = defaults.tooltipBorder;
    Chart.defaults.plugins.tooltip.borderWidth = 1;

    // Update each chart instance
    Object.values(chartInstances).forEach(chart => {
        // Update legend text color
        if (chart.options.plugins && chart.options.plugins.legend) {
            chart.options.plugins.legend.labels = chart.options.plugins.legend.labels || {};
            chart.options.plugins.legend.labels.color = defaults.textColor;
        }

        // Update scale colors (for bar and polar charts)
        if (chart.options.scales) {
            if (chart.options.scales.y) {
                chart.options.scales.y.grid = chart.options.scales.y.grid || {};
                chart.options.scales.y.grid.color = defaults.gridColor;
                chart.options.scales.y.ticks = chart.options.scales.y.ticks || {};
                chart.options.scales.y.ticks.color = defaults.textColor;
            }
            if (chart.options.scales.x) {
                chart.options.scales.x.ticks = chart.options.scales.x.ticks || {};
                chart.options.scales.x.ticks.color = defaults.textColor;
            }
            if (chart.options.scales.r) {
                chart.options.scales.r.grid = chart.options.scales.r.grid || {};
                chart.options.scales.r.grid.color = defaults.rGridColor;
            }
        }

        // Update polar chart border color
        if (chart.config.type === 'polarArea') {
            chart.data.datasets[0].borderColor = defaults.polarBorderColor;
        }

        chart.update('none');
    });
}

// ===================================
// INITIALIZE CHARTS ON DOM READY
// ===================================

document.addEventListener('DOMContentLoaded', () => {
    const theme = getTheme();
    const defaults = getChartDefaults(theme);

    // Set initial Chart.js defaults
    Chart.defaults.color = defaults.textColor;
    Chart.defaults.font.family = "'Inter', sans-serif";
    Chart.defaults.plugins.tooltip.backgroundColor = defaults.tooltipBg;
    Chart.defaults.plugins.tooltip.titleColor = defaults.tooltipTextColor;
    Chart.defaults.plugins.tooltip.bodyColor = defaults.tooltipTextColor;
    Chart.defaults.plugins.tooltip.borderColor = defaults.tooltipBorder;
    Chart.defaults.plugins.tooltip.borderWidth = 1;
    Chart.defaults.plugins.tooltip.padding = 12;
    Chart.defaults.plugins.tooltip.cornerRadius = 8;
    Chart.defaults.plugins.legend.labels.padding = 20;

    // Theme toggle button
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);

    // 1. Age Distribution (Doughnut)
    chartInstances.age = new Chart(
        document.getElementById('ageChart').getContext('2d'),
        {
            type: 'doughnut',
            data: {
                labels: ['Below 18', '18-25', '26-35', '36-45'],
                datasets: [{
                    data: [14.0, 72.1, 9.3, 4.7],
                    backgroundColor: palette,
                    borderColor: 'transparent',
                    borderWidth: 2,
                    hoverOffset: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '65%',
                plugins: {
                    legend: { position: 'right', labels: { color: defaults.textColor } }
                }
            }
        }
    );

    // 2. Platform Usage (Bar)
    chartInstances.platform = new Chart(
        document.getElementById('platformChart').getContext('2d'),
        {
            type: 'bar',
            data: {
                labels: ['Instagram', 'YouTube', 'IG+YT+WA', 'Snapchat', 'Others'],
                datasets: [{
                    label: '% of Users',
                    data: [27.9, 25.6, 18.6, 4.7, 23.2],
                    backgroundColor: colors.blue,
                    borderColor: colors.blueBorder,
                    borderWidth: 1,
                    borderRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: { color: defaults.gridColor },
                        ticks: { color: defaults.textColor }
                    },
                    x: {
                        grid: { display: false },
                        ticks: { color: defaults.textColor }
                    }
                },
                plugins: {
                    legend: { display: false }
                }
            }
        }
    );

    // 3. Most Influential Content (Pie)
    chartInstances.content = new Chart(
        document.getElementById('contentChart').getContext('2d'),
        {
            type: 'pie',
            data: {
                labels: ['Influencer Posts', 'Customer Reviews', 'Brand Pages', 'Discounts', 'Paid Ads'],
                datasets: [{
                    data: [39.5, 20.9, 18.6, 11.6, 9.3],
                    backgroundColor: palette,
                    borderColor: 'transparent',
                    borderWidth: 2,
                    hoverOffset: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'bottom', labels: { color: defaults.textColor } }
                }
            }
        }
    );

    // 4. Trust in Reviews (Polar Area)
    chartInstances.trust = new Chart(
        document.getElementById('trustChart').getContext('2d'),
        {
            type: 'polarArea',
            data: {
                labels: ['Strongly Agree', 'Agree', 'Neutral', 'Disagree'],
                datasets: [{
                    label: 'Trust Level',
                    data: [4.7, 16.3, 72.1, 7.0],
                    backgroundColor: [colors.cyan, colors.blue, colors.gray, colors.pink],
                    borderColor: defaults.polarBorderColor,
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    r: {
                        grid: { color: defaults.rGridColor },
                        ticks: { display: false }
                    }
                },
                plugins: {
                    legend: { position: 'bottom', labels: { color: defaults.textColor } }
                }
            }
        }
    );

    // 5. Purchase Behavior (Doughnut)
    chartInstances.purchase = new Chart(
        document.getElementById('purchaseChart').getContext('2d'),
        {
            type: 'doughnut',
            data: {
                labels: ['Yes, many times', 'Yes, once/twice', 'No, but considered', 'No, never'],
                datasets: [{
                    data: [9.3, 51.2, 32.6, 7.0],
                    backgroundColor: [colors.purple, colors.pink, colors.blue, colors.gray],
                    borderColor: 'transparent',
                    borderWidth: 2,
                    hoverOffset: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '70%',
                plugins: {
                    legend: { position: 'bottom', labels: { color: defaults.textColor } }
                }
            }
        }
    );

    // ===================================
    // CONTACT FORM WHATSAPP INTEGRATION
    // ===================================
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('contactName').value.trim();
            const email = document.getElementById('contactEmail').value.trim();
            const message = document.getElementById('contactMessage').value.trim();
            
            // Format message for WhatsApp
            let waMessage = `*New Contact Inquiry*\n\n`;
            waMessage += `*Name:* ${name}\n`;
            waMessage += `*Email:* ${email}\n\n`;
            waMessage += `*Message:*\n${message}`;
            
            // Encode message for URL
            const encodedMessage = encodeURIComponent(waMessage);
            
            // Target phone number
            const phoneNumber = "918009880918";
            
            // Open WhatsApp link in new tab
            const waUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
            window.open(waUrl, '_blank');
            
            // Optional: reset form after sending
            contactForm.reset();
        });
    }

    // ===================================
    // SERVICE WORKER REGISTRATION (PWA)
    // ===================================
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('./service-worker.js')
                .then(registration => console.log('SW registered'))
                .catch(err => console.log('SW registration failed:', err));
        });
    }
});
