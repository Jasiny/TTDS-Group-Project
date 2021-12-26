from django.http import JsonResponse

from server.utils import get_res_time


def handle_request(request):
    query = request.GET['query']
    sent_time = request.GET['sentTime']

    words = [query for _ in range(100)]

    res = {
        'words': words,
        'time': get_res_time(sent_time)
    }

    return JsonResponse(res)
