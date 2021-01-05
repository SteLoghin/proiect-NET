from django.http import JsonResponse, HttpResponse
from django.views import View
from rest_framework.decorators import api_view
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
# from rest_framework import viewsets
from django.core import serializers
import requests
from bs4 import BeautifulSoup
import re, time

from .serializers import PropertySerializer
from .models import Property, PropertyManager

# class PropertyViewSet(viewsets.ModelViewSet):
#     queryset = Property.objects.all()
#     serializer_class = PropertySerializer

class Properties(View):
    def get(self, request):
        properties = Property.objects.all().values()
        properties = list(properties)
        return JsonResponse(properties, safe=False)

@method_decorator(csrf_exempt, name='dispatch')
class Crawler(View):
    def post(self, request):
        #TODO: decide if we should delete them or soft delete them and keep them

        crawl_results = {}
        try:
            Property.objects.all().delete()
            start_time_s1 = time.time() 
            properties = self.crawl_titirez()
            crawl_results["titrez.ro"] = {
                "total_crawl_time": time.time() - start_time_s1,
                "length": len(properties)
            }
            for p in properties:
                p.save()
        except Exception as e:
            crawl_results["titirez.ro"] = {"error": str(e.with_traceback)}
            return JsonResponse(crawl_results, status=500)
        
        return JsonResponse(crawl_results, status=200)
    
    def crawl_titirez(self):
        properties = list()
        total = requests.get('https://www.titirez.ro/inchirieri-apartamente/iasi')
        total_soup = BeautifulSoup(total.content, 'html.parser')
        nr_iteratii = total_soup.find('a', class_='page-nav mobile-no', attrs={'title': 'Total pagini'})
        nr_iteratii = re.search('[0-9]+', str(nr_iteratii)).group(0)
        for i in range(0, int(nr_iteratii)):
            page = requests.get('https://www.titirez.ro/inchirieri-apartamente/iasi?p=' + str(i))
            page_soup = BeautifulSoup(page.content, 'html.parser')
            links = page_soup.find_all('a', attrs={'itemprop': 'url'}, class_='item-btn item-btn-default')
            links = list(map(lambda x: x['href'], links))
            row_list = []
            final_list = []
            
            for k in links:
                page2 = requests.get(k)
                page2_soup = BeautifulSoup(page2.content, 'html.parser')
                aux = page2_soup.find_all('span', class_='value')
                pret = page2_soup.find_all('div', class_='product-price')
                zona = page2_soup.find_all(class_='sidebar-title')
                t = 0
                j = 0
                cauta_pret = 0
                cauta_zona = ''
                for i in range(0, len(aux)):
                    if j < len(pret):
                        cauta_pret = re.search('[1-9][0-9]*', str(pret[j]))
                        j = j + 1
                        if cauta_pret:
                            cauta_pret = cauta_pret.group(0)
                    if t < len(zona):
                        cauta_zona = re.search('Zona [A-Za-z ]+', str(zona[t]))
                        if cauta_zona:
                            cauta_zona = cauta_zona.group(0)
                        t = t + 1
                    if i == 0:
                        nr_camere = re.search('[0-9]+', str(aux[i]))
                    if i == 1:
                        suprafata = re.search('[0-9]+', str(aux[i]))
                    if i == 3:
                        etaj = re.search('[0-9]+', str(aux[i]))
                        if etaj:
                            etaj = etaj.group(0)
                        else:
                            etaj = 0
                    if i == 4:
                        an_constructie = re.search('[0-9]+', str(aux[i]))
                        if an_constructie:
                            an_constructie = an_constructie.group(0)
                        else:
                            an_constructie = 0
                    if i == 7:
                        nr_bai = re.search('[0-9]+', str(aux[i]))
                        if nr_bai:
                            nr_bai = nr_bai.group(0)
                        else:
                            nr_bai = 0
                    if i == 8:
                        nr_bucatarii = re.search('-?[0-9]+', str(aux[i]))
                        if nr_bucatarii:
                            nr_bucatarii = nr_bucatarii.group(0)
                        else:
                            nr_bucatarii = 0
                dictionar = {
                    "rooms": nr_camere.group(0),
                    "area": suprafata.group(0),
                    "floor": etaj,
                    "year": an_constructie,
                    "bathrooms": nr_bai,
                    "kitchens": nr_bucatarii,
                    "link": k,
                    "zone": cauta_zona,
                    "price": cauta_pret,
                }
                if dictionar['year'] != 0:
                    # adauga proprietatea la o lista
                    properties.append(Property.objects.create_property(dict=dictionar))

                del row_list[:]
                del aux[:]
                dictionar.clear()

        return properties
