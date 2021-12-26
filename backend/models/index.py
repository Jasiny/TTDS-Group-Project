from django.http import JsonResponse


def handleRequest(request):
    query = request.GET['query']
    results = [query for i in range(100)]
    return JsonResponse({'results': results})
