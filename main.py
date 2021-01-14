import re,requests
from bs4 import BeautifulSoup

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



full_properties = crawl_titirez()
zones = sorted([str(x) for x in set(map(lambda x: x["zone"], full_properties))])
floors = sorted([int(x) for x in set(map(lambda x: x["floor"], full_properties))])
print(zones)
print(floors)

