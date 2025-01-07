function getArticles() {
  let articles = '{"articles": [' +
                  '{"id":9001,"name":"Engel 1","image":"pers_01.jpg","price":99.95,"type":"engel","color":"bruin"} ]}';

    return JSON.parse(articles).articles;
}
