export async function getQuotation(date, currency) {

    const formattedDate = date.toISOString().split('T')[0];
    try {
        const response = await fetch(`http://localhost:8000/api/quotation/?currency=${currency}&date=${formattedDate}`); 

        if (!response.ok) {
            throw new Error(`Erro ao buscar dados: status ${response.status}`);
        }

        const data = await response.json();

        if (data.error) {
            throw new Error(`Erro retornado pela API: ${data.error}`);
        }

        return data;

    } catch (error) {
        console.error("Falha na função getQuotation:", error);
        
        throw error;
    }
}

function isSameDay(date1, date2) {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

function getDaysArray(start, end) {
    const dateArray = [];

    const [startYear, startMonth, startDay] = start.split('-').map(Number);
    const [endYear, endMonth, endDay] = end.split('-').map(Number);

    const currentDate = new Date(startYear, startMonth - 1, startDay);
    const endDate = new Date(endYear, endMonth - 1, endDay);
    
    while (currentDate <= endDate) {
        dateArray.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return dateArray;
}

export async function getQuotationInterval() {
    const dateBegin = document.getElementById("dateBegin").value;
    const dateEnd = document.getElementById("dateEnd").value;

    if (dateEnd < dateBegin) {
        window.alert("Escolha um intervalo de dias válido")
        return null
    }
    const currency = document.getElementById("currency").value;

    if (!dateBegin || !dateEnd || !currency) {
        throw new Error('Erro! É necessário selecionar as datas de início, fim e a moeda.');
    }
    
    let interval = getDaysArray(dateBegin, dateEnd);
    if(interval.length === 0) {
        throw new Error('Intervalo de datas inválido.');
    }

    try {
        const promises = interval.map(day => getQuotation(day, currency));

        console.log(`Iniciando ${promises.length} requisições...`);

        let results = await Promise.all(promises);

        let cont = 0
        for (let i = 0; i < results.length; i++) {
            let [year, month, day] = results[i].date.split('-').map(Number);
            let aux = new Date(year, month - 1, day);
            if (isSameDay(aux, interval[i])) {
                cont++
            } else {
                results = results.filter(function(item) {
                    return item !== results[i]
                })
                interval = interval.filter(function(item) {
                    return item !== interval[i]
                })
                i--
            }
            
        }
        if (cont == 0) {
            window.alert("O intervalo deve ter pelo menos 1 dia útil")
            return null
        }

        if (cont > 5) {
            window.alert("O intervalo tem mais de 5 dias úteis")
            return null
        }
        return results;

    } catch (error) {
        console.error("Falha ao buscar o intervalo de cotações:", error);
        throw error;
    }
}