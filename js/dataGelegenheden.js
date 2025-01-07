function getArticles() {
  let articles = '{"articles": [' +
                  '{"id":1101,"name":"beer kerst 1","image":"beer_kerst_01.jpg","price":69.95,"type":"beer","color":"bruin"},' +
                  '{"id":1102,"name":"beer kerst 2","image":"beer_kerst_02.jpg","price":74.95,"type":"beer","color":"bruin"} ]}';

    return JSON.parse(articles).articles;
}
