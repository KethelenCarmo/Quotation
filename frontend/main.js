import { getQuotationInterval } from './tools.js';

const button = document.getElementById("btnGenerate");
button.addEventListener("click", async () => {
    try {
        console.log("Buscando cotação...");
        const quotationData = await getQuotationInterval();
        console.log("Resposta recebida:", quotationData);

        if (quotationData != null) {
            updateChart(quotationData);
        }
    } catch (error) {
        console.error("Não foi possível exibir a cotação:", error);
    }
});

function updateChart(data) {
    const selectedCurrency = document.getElementById("currency").value;

const days = data.map(item => {
    const [ano, mes, dia] = item.date.split('-');
    return `${dia}/${mes}`;
});


const quotations = data.map(item => item.rates[selectedCurrency]);

const currencyElement = document.getElementById("currency");
const currencyName = currencyElement.options[currencyElement.selectedIndex].text;

Highcharts.chart('container-grafico', {
    chart: {
        type: 'line'
    },
    title: {
        text: `Cotação do ${currencyName} em Relação ao Dólar (USD)`
    },
    subtitle: {
        text: 'Fonte: Sua API de Cotações'
    },
    xAxis: {
        categories: days,
        title: {
            text: 'Data'
        }
    },
    yAxis: {
        title: {
            text: 'Valor na Moeda Base (USD)'
        }
    },
    tooltip: {
        shared: true 
    },
    series: [{
        name: 'Dólar (Base)',
        data: new Array(days.length).fill(1),
        dashStyle: 'ShortDash',
        color: '#808080' 
    }, {
        name: currencyName,
        data: quotations
    }]
});
}