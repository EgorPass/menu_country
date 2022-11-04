from django.urls import path, include
from .views import *

urlpatterns = [
    path('', api_redirect),
    path('active_country_json/', api_active_country),
    path('ru_json/', api_russia_json),
    path('us_json/', api_usa_json),
    path('fr_json/', api_france_json),
]
