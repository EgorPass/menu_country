from django.shortcuts import render, redirect
from django.http import HttpResponse, JsonResponse
import json


def api_redirect(request):
    return redirect('/')

def api_active_country(request):
    js_file = '''{"data": ["Russia (RU)", "United States (US)", "France (FR)"]}'''
    api_json_categories = json.loads(js_file)
    # '''{"country": [{"Moscow region":[""]},{"":[]},{"":[] }]}'''
    response = JsonResponse(
        api_json_categories
    )
    response["Access-Control-Allow-Origin"] = "*"
    response["Access-Control-Allow-Methods"] = "GET, OPTIONS"
    response["Access-Control-Max-Age"] = "1000"
    response["Access-Control-Allow-Headers"] = "X-Requested-With, Content-Type"
    # return JsonResponse(api_json_categories)
    return response

def api_russia_json(request):
    js_file = '''{"country": [{"Moscow region":["Moscow","Khimki","Korolev","Odintsovo","Mytishchi","Elektrostal"]},{"Leningrad region":["Boksitogorsk","Leningrad","Volosovo","Vyborg", "St. P"]},{"Samara region":["Samara", "Zhigulevsk", "Neftegorsk", "Otradny", "Tolyatti"]}, {"Krasnodar region":["Sochi", "Krasnodar", "Anapa", "Novorossisk"]}, {"Kirov region":["1","2","3"]}, {"Tver region":["1","2"]}, {"Briansk":["1","q"]}, {"Vogograd region":["1", "2"]}, {"Voronesh region":["1","2"]}, {"Novgorod region":["1","2"]}, {"Vladimir region":["1","2"]}, {"Omsk region":["1","2"]}, {"Novosibirsk":["1","2"]}, {"Irkutsk region":["1","2"]} ]}'''
    api_json_categories = json.loads(js_file)
    # '''{"country": [{"Moscow region":[""]},{"":[]},{"":[] }]}'''
    response = JsonResponse(
        api_json_categories
    )
    response["Access-Control-Allow-Origin"] = "*"
    response["Access-Control-Allow-Methods"] = "GET, OPTIONS"
    response["Access-Control-Max-Age"] = "1000"
    response["Access-Control-Allow-Headers"] = "X-Requested-With, Content-Type"
    # return JsonResponse(api_json_categories)
    return response

def api_usa_json(request):
    js_file = '''{"country": [{"California":["LA", "San Francisco", "San Diego", "Sacramento"]},{"Florida":["Tampa", "Orlando", "Miami"]}, {"Texas":["Astian", "Heston"]} ]}'''
    api_json_categories = json.loads(js_file)

    response = JsonResponse(
        api_json_categories
    )
    response["Access-Control-Allow-Origin"] = "*"
    response["Access-Control-Allow-Methods"] = "GET, OPTIONS"
    response["Access-Control-Max-Age"] = "1000"
    response["Access-Control-Allow-Headers"] = "X-Requested-With, Content-Type"

    return response

def api_france_json(request):
    js_file = '''{"country": [{"Centre":["Saint-Herblain","Saint-Gratien"]},{"West":["1","2"]},{"East":["qwerty", "asdfgh"] }]}'''
    api_json_categories = json.loads(js_file)

    response = JsonResponse(
        api_json_categories
    )
    response["Access-Control-Allow-Origin"] = "*"
    response["Access-Control-Allow-Methods"] = "GET, OPTIONS"
    response["Access-Control-Max-Age"] = "1000"
    response["Access-Control-Allow-Headers"] = "X-Requested-With, Content-Type"

    return response
