from django.http import JsonResponse, HttpResponse
from django.views import View
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.core import serializers
import requests
from bs4 import BeautifulSoup
import re, time, json, os
from datetime import datetime
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
        django_rq.enqueue(background_task)
        return JsonResponse({"crawler_status": "started"}, status=200)
    
    def get(self, request):
        client = pymongo.MongoClient(os.environ.get('MONGODB_URL'))
        properties = client.Crawler_Info.api_property.find({}, {"_id": 0, "id": 0})
        properties = list(properties)
        zones = sorted([str(x) for x in set(map(lambda x: x["zone"], properties))])
        zones = list(filter(lambda x: len(x) != 1 and x != "Baza ", zones))
        floors = sorted([int(x) for x in set(map(lambda x: x["floor"], properties))])
        info = client.Crawler_Info.crawler_info.find()
        info = list(info)
        info = dict(info[0])
        info["zones"] = zones
        info["floors"] = floors
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
                        etaj = '0'
                if i == 4:
                    an_constructie = re.search('[0-9]+', str(aux[i]))
                    if an_constructie:
                        an_constructie = an_constructie.group(0)
                    else:
                        an_constructie = '2000'
                if i == 7:
                    nr_bai = re.search('[0-9]+', str(aux[i]))
                    if nr_bai:
                        nr_bai = nr_bai.group(0)
                    else:
                        nr_bai = '1'
                if i == 8:
                    nr_bucatarii = re.search('-?[0-9]+', str(aux[i]))
                    if nr_bucatarii:
                        nr_bucatarii = nr_bucatarii.group(0)
                    else:
                        nr_bucatarii = '1'
            zona = cauta_zona.split(' ', 1)
            if len(zona) == 2:
                zona = zona[1]
            else:
                zona = zona[0]
            if len(zona) == 0:
                zona = "Iasi"
            
            dictionar = {
                "rooms": nr_camere.group(0),
                "area": suprafata.group(0),
                "floor": etaj,
                "year": an_constructie,
                "bathrooms": nr_bai,
                "kitchens": nr_bucatarii,
                "link": k,
                "zone": zona,
                "price": cauta_pret,
            }
            if dictionar['year'] != 0:
                # adauga proprietatea la o lista
                properties.append(dict(dictionar))

            del row_list[:]
            del aux[:]
            dictionar.clear()
    properties = [dict(t) for t in {tuple(sorted(prop.items())) for prop in properties}]
    return properties

def crawl_imobiliare():

    main_link = requests.get('https://www.imobiliare.ro/inchirieri-apartamente/iasi?id=230197420')
    main_link_soup = BeautifulSoup(main_link.content, 'html.parser')
    nr_iteratii = main_link_soup.find_all('a', class_='butonpaginare') #get the last pagination button
    nr_iteratii = list(map(lambda x: int(x['data-pagina']), nr_iteratii))
    nr_iteratii = sorted(nr_iteratii, reverse=True)[0]
    properties = list()
    for j in range(1, nr_iteratii):
        page = requests.get('https://www.imobiliare.ro/inchirieri-apartamente/iasi?id=230264596&pagina=' + str(j))
        page_soup = BeautifulSoup(page.content, 'html.parser')
        links = page_soup.find_all('a', href=True, class_='detalii-proprietate desktop')
        links = list(map(lambda x: x['href'], links))

        for k in links:
            page2 = requests.get(k)
            page2_soup = BeautifulSoup(page2.content, 'html.parser')
            zone = page2_soup.find("div", class_="header_info")
            zone = zone.find('div', class_="col-lg-9 col-md-9 col-sm-9 col-xs-12").text.replace("ă", "a").replace("ş", "s").replace("â", "a")
            if zone == "Bd. Independetei":
                zone = "Bulevardul Independentei"
            if zone == "Cug":
                zone = "CUG"
            
            pret = page2_soup.find("div", class_="pret first blue").contents[1].rstrip(' ')
            try:
                zone = zone.split(',')[1].split('-')[0].split(' ', 2)
                zone = list(filter(lambda x: len(x) != 0, zone))
                if(len(zone) != 2):
                    zone = "Iasi"
                else:
                    zone = zone[1].rstrip(' ')
            except Exception as e:
                zone = "Iasi"
            coloana_cu_informatii_1 = page2_soup.find('ul', class_='lista-tabelara')
            coloana_cu_informatii_2 = page2_soup.find_all('ul', class_='lista-tabelara mobile-list')
            coloana_cu_informatii_1 = coloana_cu_informatii_1.find_all("li")
            details = ""
            for i in coloana_cu_informatii_1:
                details += i.text
                details += '\n'
            for i in coloana_cu_informatii_2:
                details += i.text
                details += '\n'   
            
            try:
                nr_camere = re.search('Nr. camere:([0-9]+)', details).group(1)
                suprafata = re.search('Suprafaţă utilă:([0-9,.]+) mp', details).group(1)
                suprafata = suprafata.replace(",", ".")
                etaj = re.search('Etaj ([0-9]+)', details)
                if etaj:
                    etaj = etaj.group(1)
                else:
                    etaj = '0'
                
                an_constructie = re.search('An construcţie:([0-9]+)', details)
                if an_constructie:
                    an_constructie = an_constructie.group(1)
                else:
                    an_constructie = re.search('An construcţie:După ([0-9]+)', details)
                    if an_constructie:
                        an_constructie = an_constructie.group(1)
                    else:
                        an_constructie = re.search('An construcţie:Între [0-9]+ şi ([0-9]+)', details)
                        if an_constructie:
                            an_constructie = an_constructie.group(1)
                        else:
                            print("failed")
                            break
                nr_bai = re.search('Nr. băi:([0-9]+)', details)
                if nr_bai:
                    nr_bai = nr_bai.group(1)
                else:
                    nr_bai = '1'
                nr_bucatarii = re.search('Nr. bucătării:([0-9]+)', details)
                if nr_bucatarii:
                    nr_bucatarii = nr_bucatarii.group(1)
                else:
                    nr_bucatarii = '1'
                dictionar = {
                    "rooms": nr_camere,
                    "area": suprafata,
                    "floor": etaj,
                    "year": an_constructie,
                    "bathrooms": nr_bai,
                    "kitchens": nr_bucatarii,
                    "link": k,
                    "zone": zone,
                    "price": pret,
                }
                properties.append(dict(dictionar))
                
            except Exception as e:
                print("Failed to crawl property")
        print(f"Finished page {j} on imobiliare")
    properties = [dict(t) for t in {tuple(sorted(prop.items())) for prop in properties}]
    return properties

def background_task():
    crawl_results = {}
    client = pymongo.MongoClient(os.environ.get('MONGODB_URL'))
    client.Crawler_Info.api_property.delete_many({})
    full_properties = list()
    try:
        print("started titirez crawling")
        start_time_s1 = time.time() 
        properties = crawl_titirez()
        full_properties = list(properties)
        crawl_results["titrez"] = {
            "total_crawl_time": time.time() - start_time_s1,
            "length": len(properties),
            "last_crawl_datetime": f"{datetime.date(datetime.now())} {datetime.time(datetime.now())}"
        }
        for p in properties:
            client.Crawler_Info.api_property.insert_one(p)
    except Exception as e:
        crawl_results["titirez"] = {
            "error": str(e.with_traceback), 
            "last_crawl_datetime": f"{datetime.date(datetime.now())} - {datetime.time(datetime.now())}"
        }
    try:
        print("finished titirez crawling")
        print("started imobiliare crawling")
        start_time_s1 = time.time() 
        properties = crawl_imobiliare()
        full_properties = full_properties + list(properties)
        crawl_results["imobiliare"] = {
            "total_crawl_time": time.time() - start_time_s1,
            "length": len(properties),
            "last_crawl_datetime": f"{datetime.date(datetime.now())} {datetime.time(datetime.now())}"
        }
        for p in properties:
            client.Crawler_Info.api_property.insert_one(p)
    except Exception as e:
        crawl_results["imobiliare"] = {
            "error": str(e.with_traceback), 
            "last_crawl_datetime": f"{datetime.date(datetime.now())} - {datetime.time(datetime.now())}"
        }
    finally:
        client.Crawler_Info.crawler_info.delete_many({})
        client.Crawler_Info.crawler_info.insert_one(dict(crawl_results))