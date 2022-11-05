import requests
import sys
from bs4 import BeautifulSoup

def crawl_from_fow(nickname) :
    url = 'http://fow.kr/find/'+nickname
    response = requests.get(url)
    if response.status_code == 200:
        html = response.text
        soup = BeautifulSoup(html, 'html.parser')

        level = soup.select_one('body > div:nth-child(7) > div:nth-child(1) > div:nth-child(2) > div.topp > div.profile > div:nth-child(2) > a:nth-child(1) > span')
        level = level.get_text()[4:]

        tier = soup.select_one('body > div:nth-child(7) > div:nth-child(1) > div:nth-child(2) > div.table_summary > div:nth-child(2) > div:nth-child(2) > b > font')
        tier = tier.get_text()

        most1 = soup.select_one('body > div:nth-child(7) > div:nth-child(1) > div:nth-child(2) > div.rankchamp_div.rankchamp_div_all > table > tbody > tr:nth-child(1) > td:nth-child(1)')
        most1 = most1.get_text()[1:-1]

        most2 = soup.select_one('body > div:nth-child(7) > div:nth-child(1) > div:nth-child(2) > div.rankchamp_div.rankchamp_div_all > table > tbody > tr:nth-child(2) > td:nth-child(1)')
        most2 = most2.get_text()[1:-1]

        most3 = soup.select_one('body > div:nth-child(7) > div:nth-child(1) > div:nth-child(2) > div.rankchamp_div.rankchamp_div_all > table > tbody > tr:nth-child(3) > td:nth-child(1)')
        most3 = most3.get_text()[1:-1]
        
        data = [level, tier, most1, most2, most3] 
        print(data)
        sys.stdout.flush()
        return [level, tier, most1, most2, most3]
    else : 
        print(response.status_code)
        return false
    
if __name__ == '__main__' :
    crawl_from_fow(sys.argv[1])
    