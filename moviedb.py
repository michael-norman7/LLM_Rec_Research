import requests

title_name = "One Piece"

url = "https://api.themoviedb.org/3/search/multi?query="
url += title_name.replace(' ', '%20')
url += "&include_adult=false&language=en-US&page=1"

headers = {
    "accept": "application/json",
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0MGVhZTFmNDQ0MjM4ZThjMTMwNDBhOTdiMTIwMjU2YyIsInN1YiI6IjY1MWJkMzRjNzQ1MDdkMDBmZjk2ZWRiNCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.5gxF4bEWyp2a4oXxJz9geiVNMfWP6tm8nlatQcIJWNk"
}

response = requests.get(url, headers=headers)

title = response.json()['results'][0]

# print('adult:', title['adult'])
# print('backdrop_path:', title['backdrop_path'])
# print('id:', title['id'])
print('name:', title['name'])
# print('original_language:', title['original_language'])
# print('original_name:', title['original_name'])
print('overview:', title['overview'])
# print('poster_path:', title['poster_path'])
print('media_type:', title['media_type'])
print('genre_ids:', title['genre_ids'])
print('popularity:', title['popularity'])
# print('first_air_date:', title['first_air_date'])
print('vote_average:', title['vote_average'])
# print('vote_count:', title['vote_count'])
# print('origin_country:', title['origin_country'])

# for k, v in title.items():
#     print(k, ":", v)