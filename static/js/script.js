// Function to fetch data from the backend
async function fetchSensorData() {
    try {
        const response = await fetch('/get_data');
        const data = await response.json();

        if (data.length > 0) {
            // Mendapatkan seluruh data dari MongoDB
            const suhuMaxList = data.map(item => item.suhumax);
            const suhuMinList = data.map(item => item.suhumin);
            const suhuRataList = data.map(item => item.suhurata2);

            // Mendapatkan timestamps untuk seluruh data
            const timestamps = data.map(item => item.nilaisuhuhumid.map(val => new Date(val.timestamp).toLocaleTimeString())).flat();
            const temperatureData = data.map(item => item.nilaisuhuhumid.map(val => val.suhu)).flat();
            const humidityData = data.map(item => item.nilaisuhuhumid.map(val => val.humid)).flat();

            // Mengupdate seluruh chart
            updateChart('temperatureHumidityChart', timestamps, temperatureData, humidityData, 'Temperature and Humidity');
            updateTemperatureChart('temperatureMaxChart', suhuMaxList);
            updateTemperatureChart('temperatureMinChart', suhuMinList);
            updateTemperatureChart('averageTemperatureChart', suhuRataList);

            // Update "Last Updated" date
            updateLastUpdated();
        } else {
            console.log('No data found');
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// Function to update the "Last Updated" date
function updateLastUpdated() {
    const now = new Date();
    const formattedDate = now.toLocaleString('en-GB', { dateStyle: 'long', timeStyle: 'short' });
    document.getElementById('updateDate').textContent = formattedDate;
}

// Function to update the temperature and humidity chart
function updateChart(chartId, timestamps, temperatureData, humidityData, title) {
    const ctx = document.getElementById(chartId).getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: timestamps,
            datasets: [
                {
                    label: 'Temperature (°C)',
                    data: temperatureData,
                    borderColor: '#FF6384',
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    fill: false
                },
                {
                    label: 'Humidity (%)',
                    data: humidityData,
                    borderColor: '#36A2EB',
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    fill: false
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Time'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Values'
                    }
                }
            },
            plugins: {
                legend: {
                    position: 'top'
                },
                title: {
                    display: true,
                    text: title
                }
            }
        }
    });
}

// Function to update temperature charts (Max, Min, Average)
function updateTemperatureChart(chartId, temperatureData) {
    const ctx = document.getElementById(chartId).getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Temperature'],
            datasets: [
                {
                    label: 'Temperature (°C)',
                    data: temperatureData,
                    backgroundColor: '#FF6384',
                    borderColor: '#FF6384',
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    title: {
                        display: true,
                        text: 'Temperature (°C)'
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}

// Load data when the page is loaded
document.addEventListener('DOMContentLoaded', fetchSensorData);
