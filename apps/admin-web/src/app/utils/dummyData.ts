export const dummyData = {
  request: {
    url: 'https://reactnative.dev/movies.json',
    method: 'GET',
    data: null,
    headers: {},
    params: null,
  },
  response: {
    body: {
      title: 'The Basics - Networking',
      description: 'Your app fetched this from a remote endpoint!',
      movies: [
        {
          id: '1',
          title: 'Star Wars',
          releaseYear: '1977',
        },
        {
          id: '2',
          title: 'Back to the Future',
          releaseYear: '1985',
        },
        {
          id: '3',
          title: 'The Matrix',
          releaseYear: '1999',
        },
        {
          id: '4',
          title: 'Inception',
          releaseYear: '2010',
        },
        {
          id: '5',
          title: 'Interstellar',
          releaseYear: '2014',
        },
      ],
    },
    status: 200,
    headers: {
      'content-type': 'application/json',
      'expect-ct':
        'max-age=604800, report-uri="https://report-uri.cloudflare.com/cdn-cgi/beacon/expect-ct"',
      etag: '"1c280937dfb73305184f0c1a4d75848c-ssl"',
      nel: '{"success_fraction":0,"report_to":"cf-nel","max_age":604800}',
      'report-to':
        '{"endpoints":[{"url":"https:\\/\\/a.nel.cloudflare.com\\/report\\/v3?s=09DVBAQZR9o54ciqTC%2BBHNf%2B5EGm2oc%2FXYy4QV22hStDYlsbWvKsHxWxU5gsGiOV03fpYyaXHcSuGqQO7MCVvRGGF5REn%2Fg7rpo%2FvPtoPh5CO0XzuKxtkkuzNl5c8Ou35vQ%3D"}],"group":"cf-nel","max_age":604800}',
      date: 'Mon, 09 May 2022 13:51:21 GMT',
      server: 'cloudflare',
      'cache-control': 'public, max-age=0, must-revalidate',
      'cf-ray': '708ae8cd0d2a2d85-ORD',
      'access-control-allow-origin': '*',
      'cf-cache-status': 'DYNAMIC',
      'alt-svc': 'h3=":443"; ma=86400, h3-29=":443"; ma=86400',
      age: '4276',
      'x-nf-request-id': '01G2MHDF20EBJT76C2KR3KCVK2',
    },
  },
  duration: 198.60000002384186,
};
