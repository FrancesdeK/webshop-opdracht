function getArticles() {
  let articles = '{"articles": [' +
                  '{"id":9001,"name":"Engel 1","image":"pers_01.jpg","price":99.95,"type":"engel","color":"bruin"},' +
                  '{"id":8001,"name":"Meisje 1","image":"knuffel_01.jpg","price":39.95,"type":"meisje","color":"roze"},' +
                  '{"id":8002,"name":"Knuffel 1","image":"knuffel_02.jpg","price":9.95,"type":"knuffel","color":"roze"},' +
                  '{"id":8003,"name":"Meisje 2","image":"knuffel_03.jpg","price":54.95,"type":"meisje","color":"rood"},' +
                  '{"id":4010,"name":"leeuw 10","image":"leeuw_9.jpg","price":24.95,"type":"leeuw","color":"bruin"},' +
                  '{"id":3003,"name":"poes 3","image":"poes_2.jpg","price":14.95,"type":"poes","color":"zwart"},' +
                  '{"id":4001,"name":"olifant 1","image":"olifant_0.jpg","price":39.95,"type":"olifant","color":"bruin"} ]}';

    return JSON.parse(articles).articles;
}
