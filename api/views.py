from django.http import JsonResponse, HttpResponse
from django.views import View
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.core import serializers
import requests
from bs4 import BeautifulSoup
import re, time, json, os, datetime
import pymongo
from bson import json_util

from .models import Property, PropertyManager

import django_rq 

class Properties(View):
    def get(self, request):
        client = pymongo.MongoClient(os.environ.get('MONGODB_URL'))
        properties = client.Crawler_Info.api_property.find({}, {"_id": 0, "id": 0})
        properties = list(properties)
        return JsonResponse(json.loads(json_util.dumps(properties)), safe=False)

@method_decorator(csrf_exempt, name='dispatch')
class Crawler(View):
    def post(self, request):
        #TODO: decide if we should delete them or soft delete them and keep them
        django_rq.enqueue(background_task)
        return JsonResponse({"crawler_status": "started"}, status=200)
    
    def get(self, request):
        client = pymongo.MongoClient(os.environ.get('MONGODB_URL'))
        info = client.Crawler_Info.crawler_info.find()
        return JsonResponse(json.loads(json_util.dumps(info)), safe=False)


def crawl_titirez():
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
                properties.append(dict(dictionar))

            del row_list[:]
            del aux[:]
            dictionar.clear()

    return properties

def background_task():
    crawl_results = {}
    try:
        client = pymongo.MongoClient(os.environ.get('MONGODB_URL'))
        client.Crawler_Info.api_property.delete_many({})
        start_time_s1 = time.time() 
        properties = self.crawl_titirez()
        crawl_results["titrez.ro"] = {
            "total_crawl_time": time.time() - start_time_s1,
            "length": len(properties),
            "last_crawl_datetime": f"{datetime.date(datetime.now())} {datetime.time(datetime.now())}"
        }
        for p in properties:
            client.Crawler_Info.api_property.insert_one(p)
    except Exception as e:
        crawl_results["titirez.ro"] = {
            "error": str(e.with_traceback), 
            "last_crawl_datetime": f"{datetime.date(datetime.now())} - {datetime.time(datetime.now())}"
        }
    finally:
        client.Crawler_Info.crawler_info.insert_one(crawl_results)