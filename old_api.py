import requests

headers = {
	"X-RapidAPI-Key": "c8930b7eb0mshbe76fc889844a9fp1b5788jsn305efc514777",
	"X-RapidAPI-Host": "moviesdatabase.p.rapidapi.com"
}

querystring = {"sort":"year.decr"}

title = 'Breaking Bad'

url = "https://moviesdatabase.p.rapidapi.com/titles/search/akas/"
for word in title.split():
	url += word
	if word != title.split()[-1]:
		url += '%20'

response = requests.get(url, headers=headers, params=querystring)

i = 0
while i < len(response.json()['results'])-1 and (response.json()['results'][i]['titleType']['text'] != 'TV Series' and response.json()['results'][i]['titleType']['text'] != 'Movie'):
	i += 1
info = response.json()['results'][i]

print("Show:", info['titleText']['text'])
print("Type:", info['titleType']['text'])
print('Release Date: ', info['releaseDate']['month'], '/', info['releaseDate']['day'], '/', info['releaseDate']['year'], sep="")

# for k, v in response.json()['results'][1].items():
# 	print(k, ':', v)
	# if k == 'titleText' and v['text'] == title:
	# 	print(response.json()['results'][0])
