import requests
from django.http import JsonResponse

VAT_COMPLY_API_URL = "https://api.vatcomply.com/rates?base=USD"

def getQuotation(request):
    """
    Esta view atua como um proxy para a API da VAT Comply.
    Ela recebe um 'vat_number' como parâmetro de query,
    chama a API externa e retorna a resposta como JSON.
    """
    currency = request.GET.get('currency')
    date = request.GET.get('date')

    if not currency or not date :
        return JsonResponse({'error': 'Os parâmetros são obrigatório.'}, status=400)

    params = {'symbols': currency, 'date' : date}
    try:
        response = requests.get(VAT_COMPLY_API_URL, params=params)

        response.raise_for_status()

        data = response.json()

        return JsonResponse(data)

    except requests.exceptions.RequestException as e:
        print(f"Erro ao chamar a API externa: {e}")
        return JsonResponse({'error': 'Falha ao se comunicar com o serviço de validação externo.'}, status=502) 
