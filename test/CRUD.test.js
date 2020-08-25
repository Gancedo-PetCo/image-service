const axios = require('axios');

describe('The server\'s CRUD operations', () => {
  describe('includes the GET method for the path /itemImages/:itemId where', () => {
    test('the server correctly retrieves the information for an item in the DB', () => {
      return axios.get('http://127.0.0.1:3003/itemImages/100')
        .then((response) => {
          const { status, data } = response;
          const { itemId, itemImages } = data;

          expect(status).toBe(200);
          expect(itemId).toBe('100');
          expect(itemImages[0].small).toBeDefined();
          expect(itemImages[0].medium).toBeDefined();
          expect(itemImages[0].large).toBeDefined();
          expect(itemImages[1].small).toBeDefined();
          expect(itemImages[1].medium).toBeDefined();
          expect(itemImages[1].large).toBeDefined();
        })
        .catch((err) => {
          console.log(err);
        });
    });

    test('the server correctly returns 404 for an not in the DB', () => {
      return axios.get('http://127.0.0.1:3003/itemImages/99')
        .catch((err) => {
          expect(err.response.status).toBe(404);
        });
    });
  });


  describe('includes the POST method for the path /addItemImages/:itemId where', () => {
    describe('the server correctly returns 400 when attempting to create an item record with', () => {
      test('the itemId is not a number', () => {
        return axios.post('http://127.0.0.1:3003/addItemImages/a')
          .catch((err) => {
            expect(err.response.status).toBe(400);
            expect(err.response.data).toBe('itemId invalid. Must be string representing integer number greater than 99');
          });
      });

      test('the itemId is a number less than 100', () => {
        return axios.post('http://127.0.0.1:3003/addItemImages/99')
          .catch((err) => {
            expect(err.response.status).toBe(400);
            expect(err.response.data).toBe('itemId invalid. Must be string representing integer number greater than 99');
          });
      });

      test('no itemImages data included in the query params', () => {
        return axios.post('http://127.0.0.1:3003/addItemImages/20000000')
          .catch((err) => {
            expect(err.response.status).toBe(400);
            expect(err.response.data).toBe('No itemImages present in request query params');
          });
      });

      test('no itemImages data included in the query params array', () => {
        const badData = [];
        const badDataStringified = JSON.stringify(badData);

        return axios.post(`http://127.0.0.1:3003/addItemImages/20000000?itemImages=${badDataStringified}`)
          .catch((err) => {
            expect(err.response.status).toBe(400);
            expect(err.response.data).toBe('No itemImages present in request query params');
          });
      });

      test('has an itemId that already exists in the database', () => {
        const goodData = [
          {
            'small': 'https://images.unsplash.com/photo-1581467655410-0c2bf55d9d6c?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=54&fit=max&ixid=eyJhcHBfaWQiOjE0MzcyOX0',
            'medium': 'https://images.unsplash.com/photo-1581467655410-0c2bf55d9d6c?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjE0MzcyOX0',
            'large': 'https://images.unsplash.com/photo-1581467655410-0c2bf55d9d6c?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1000&fit=max&ixid=eyJhcHBfaWQiOjE0MzcyOX0'
          },
          {
            'small': 'https://images.unsplash.com/photo-1521940340186-d473d4400001?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=54&fit=max&ixid=eyJhcHBfaWQiOjE0MzcyOX0',
            'medium': 'https://images.unsplash.com/photo-1521940340186-d473d4400001?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjE0MzcyOX0',
            'large': 'https://images.unsplash.com/photo-1521940340186-d473d4400001?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1000&fit=max&ixid=eyJhcHBfaWQiOjE0MzcyOX0'
          }
        ];

        let goodDataStringified = JSON.stringify(goodData);
        const goodDataSplit = goodDataStringified.split('&');
        goodDataStringified = goodDataSplit.join('%26');

        return axios.post(`http://127.0.0.1:3003/addItemImages/100?itemImages=${goodDataStringified}`)
          .catch((err) => {
            expect(err.response.status).toBe(400);
            expect(err.response.data).toBe('Item with that itemId already exists');
          });
      });

      test('the itemImages data in not an array', () => {
        const badData = {};
        const badDataStringified = JSON.stringify(badData);

        return axios.post(`http://127.0.0.1:3003/addItemImages/20000000?itemImages=${badDataStringified}`)
          .catch((err) => {
            expect(err.response.status).toBe(400);
            expect(err.response.data).toBe('itemImages should be an array of itemImage objects, stringified with JSON.stringfy');
          });
      });

      test('has at least one itemImage object that contains an invalid key', () => {
        const badData = [
          {
            'small': 'https://images.unsplash.com/photo-1581467655410-0c2bf55d9d6c?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=54&fit=max&ixid=eyJhcHBfaWQiOjE0MzcyOX0',
            'medium': 'https://images.unsplash.com/photo-1581467655410-0c2bf55d9d6c?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjE0MzcyOX0',
            'large': 'https://images.unsplash.com/photo-1581467655410-0c2bf55d9d6c?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1000&fit=max&ixid=eyJhcHBfaWQiOjE0MzcyOX0'
          },
          {
            'badKey': '',
            'small': 'https://images.unsplash.com/photo-1521940340186-d473d4400001?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=54&fit=max&ixid=eyJhcHBfaWQiOjE0MzcyOX0',
            'medium': 'https://images.unsplash.com/photo-1521940340186-d473d4400001?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjE0MzcyOX0',
            'large': 'https://images.unsplash.com/photo-1521940340186-d473d4400001?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1000&fit=max&ixid=eyJhcHBfaWQiOjE0MzcyOX0'
          }
        ];

        let badDataStringified = JSON.stringify(badData);
        const badDataSplit = badDataStringified.split('&');
        badDataStringified = badDataSplit.join('%26');

        return axios.post(`http://127.0.0.1:3003/addItemImages/20000000?itemImages=${badDataStringified}`)
          .catch((err) => {
            expect(err.response.status).toBe(400);
            expect(err.response.data).toBe('At least one itemImage object contains an invalid key');
          });
      });

      test('has at least one URL in an invalid URL form', () => {
        const badData = [
          {
            'small': 'https://images.unsplash.com/photo-1581467655410-0c2bf55d9d6c?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=54&fit=max&ixid=eyJhcHBfaWQiOjE0MzcyOX0',
            'medium': 'https://images.unsplash.com/photo-1581467655410-0c2bf55d9d6c?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjE0MzcyOX0',
            'large': 'https://images.unsplash.com/photo-1581467655410-0c2bf55d9d6c?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1000&fit=max&ixid=eyJhcHBfaWQiOjE0MzcyOX0'
          },
          {
            'small': 'https://',
            'medium': 'https://images.unsplash.com/photo-1521940340186-d473d4400001?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjE0MzcyOX0',
            'large': 'https://images.unsplash.com/photo-1521940340186-d473d4400001?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1000&fit=max&ixid=eyJhcHBfaWQiOjE0MzcyOX0'
          }
        ];

        let badDataStringified = JSON.stringify(badData);
        const badDataSplit = badDataStringified.split('&');
        badDataStringified = badDataSplit.join('%26');

        return axios.post(`http://127.0.0.1:3003/addItemImages/20000000?itemImages=${badDataStringified}`)
          .catch((err) => {
            expect(err.response.status).toBe(400);
            expect(err.response.data).toBe('At least one URL is not a valid URL format');
          });
      });

      test('has at least one itemImage object with a mmissing required key', () => {
        const badData = [
          {
            'medium': 'https://images.unsplash.com/photo-1581467655410-0c2bf55d9d6c?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjE0MzcyOX0',
            'large': 'https://images.unsplash.com/photo-1581467655410-0c2bf55d9d6c?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1000&fit=max&ixid=eyJhcHBfaWQiOjE0MzcyOX0'
          },
          {
            'small': 'https://images.unsplash.com/photo-1581467655410-0c2bf55d9d6c?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=54&fit=max&ixid=eyJhcHBfaWQiOjE0MzcyOX0',
            'medium': 'https://images.unsplash.com/photo-1521940340186-d473d4400001?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjE0MzcyOX0',
            'large': 'https://images.unsplash.com/photo-1521940340186-d473d4400001?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1000&fit=max&ixid=eyJhcHBfaWQiOjE0MzcyOX0'
          }
        ];

        let badDataStringified = JSON.stringify(badData);
        const badDataSplit = badDataStringified.split('&');
        badDataStringified = badDataSplit.join('%26');

        return axios.post(`http://127.0.0.1:3003/addItemImages/20000000?itemImages=${badDataStringified}`)
          .catch((err) => {
            expect(err.response.status).toBe(400);
            expect(err.response.data).toBe('At least one itemImage object fails to contain the key \'small\'');
          });
      });
    });

    test('the server correctly inserts a record into the DB when the POSTed data conforms to the API standard', () => {
      const goodData = [
        {
          'small': 'https://images.unsplash.com/photo-1581467655410-0c2bf55d9d6c?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=54&fit=max&ixid=eyJhcHBfaWQiOjE0MzcyOX0',
          'medium': 'https://images.unsplash.com/photo-1581467655410-0c2bf55d9d6c?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjE0MzcyOX0',
          'large': 'https://images.unsplash.com/photo-1581467655410-0c2bf55d9d6c?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1000&fit=max&ixid=eyJhcHBfaWQiOjE0MzcyOX0'
        },
        {
          'small': 'https://images.unsplash.com/photo-1521940340186-d473d4400001?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=54&fit=max&ixid=eyJhcHBfaWQiOjE0MzcyOX0',
          'medium': 'https://images.unsplash.com/photo-1521940340186-d473d4400001?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjE0MzcyOX0',
          'large': 'https://images.unsplash.com/photo-1521940340186-d473d4400001?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1000&fit=max&ixid=eyJhcHBfaWQiOjE0MzcyOX0'
        }
      ];

      let goodDataStringified = JSON.stringify(goodData);
      const goodDataSplit = goodDataStringified.split('&');
      goodDataStringified = goodDataSplit.join('%26');

      return axios.post(`http://127.0.0.1:3003/addItemImages/20000000?itemImages=${goodDataStringified}`)
        .then((response) => {
          const { status, data } = response;

          expect(status).toBe(201);
          expect(data).toBe('Item 20000000 succesfully added to database');
        })
        .catch((err) => {
          console.log(err);
        });
    });
  });

  describe('includes the PUT method for the path /updateItemImages/:itemId where', () => {
    describe('the server correctly returns 400 when attempting to update an item record with', () => {
      test('the itemId is not a number', () => {
        return axios.put('http://127.0.0.1:3003/updateItemImages/a')
          .catch((err) => {
            expect(err.response.status).toBe(400);
            expect(err.response.data).toBe('itemId invalid. Must be string representing integer number greater than 99');
          });
      });

      test('the itemId is a number less than 100', () => {
        return axios.put('http://127.0.0.1:3003/updateItemImages/99')
          .catch((err) => {
            expect(err.response.status).toBe(400);
            expect(err.response.data).toBe('itemId invalid. Must be string representing integer number greater than 99');
          });
      });

      test('no itemImages data included in the query params', () => {
        return axios.put('http://127.0.0.1:3003/updateItemImages/20000000')
          .catch((err) => {
            expect(err.response.status).toBe(400);
            expect(err.response.data).toBe('No itemImages present in request query params');
          });
      });

      test('no itemImages data included in the query params array', () => {
        const badData = [];
        const badDataStringified = JSON.stringify(badData);

        return axios.put(`http://127.0.0.1:3003/updateItemImages/20000000?itemImages=${badDataStringified}`)
          .catch((err) => {
            expect(err.response.status).toBe(400);
            expect(err.response.data).toBe('No itemImages present in request query params');
          });
      });

      test('has an itemId that doesn\'t exist in the database', () => {
        const goodData = [
          {
            'small': 'https://images.unsplash.com/photo-1581467655410-0c2bf55d9d6c?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=54&fit=max&ixid=eyJhcHBfaWQiOjE0MzcyOX0',
            'medium': 'https://images.unsplash.com/photo-1581467655410-0c2bf55d9d6c?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjE0MzcyOX0',
            'large': 'https://images.unsplash.com/photo-1581467655410-0c2bf55d9d6c?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1000&fit=max&ixid=eyJhcHBfaWQiOjE0MzcyOX0'
          },
          {
            'small': 'https://images.unsplash.com/photo-1521940340186-d473d4400001?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=54&fit=max&ixid=eyJhcHBfaWQiOjE0MzcyOX0',
            'medium': 'https://images.unsplash.com/photo-1521940340186-d473d4400001?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjE0MzcyOX0',
            'large': 'https://images.unsplash.com/photo-1521940340186-d473d4400001?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1000&fit=max&ixid=eyJhcHBfaWQiOjE0MzcyOX0'
          }
        ];

        let goodDataStringified = JSON.stringify(goodData);
        const goodDataSplit = goodDataStringified.split('&');
        goodDataStringified = goodDataSplit.join('%26');

        return axios.put(`http://127.0.0.1:3003/updateItemImages/15000000?itemImages=${goodDataStringified}`)
          .catch((err) => {
            expect(err.response.status).toBe(400);
            expect(err.response.data).toBe('Item with the itemId 15000000 does not exist');
          });
      });

      test('the itemImages data in not an array', () => {
        const badData = {};
        const badDataStringified = JSON.stringify(badData);

        return axios.put(`http://127.0.0.1:3003/updateItemImages/20000000?itemImages=${badDataStringified}`)
          .catch((err) => {
            expect(err.response.status).toBe(400);
            expect(err.response.data).toBe('itemImages should be an array of itemImage objects, stringified with JSON.stringfy');
          });
      });

      test('has at least one itemImage object that contains an invalid key', () => {
        const badData = [
          {
            'small': 'https://images.unsplash.com/photo-1581467655410-0c2bf55d9d6c?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=54&fit=max&ixid=eyJhcHBfaWQiOjE0MzcyOX0',
            'medium': 'https://images.unsplash.com/photo-1581467655410-0c2bf55d9d6c?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjE0MzcyOX0',
            'large': 'https://images.unsplash.com/photo-1581467655410-0c2bf55d9d6c?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1000&fit=max&ixid=eyJhcHBfaWQiOjE0MzcyOX0'
          },
          {
            'badKey': '',
            'small': 'https://images.unsplash.com/photo-1521940340186-d473d4400001?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=54&fit=max&ixid=eyJhcHBfaWQiOjE0MzcyOX0',
            'medium': 'https://images.unsplash.com/photo-1521940340186-d473d4400001?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjE0MzcyOX0',
            'large': 'https://images.unsplash.com/photo-1521940340186-d473d4400001?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1000&fit=max&ixid=eyJhcHBfaWQiOjE0MzcyOX0'
          }
        ];

        let badDataStringified = JSON.stringify(badData);
        const badDataSplit = badDataStringified.split('&');
        badDataStringified = badDataSplit.join('%26');

        return axios.put(`http://127.0.0.1:3003/updateItemImages/20000000?itemImages=${badDataStringified}`)
          .catch((err) => {
            expect(err.response.status).toBe(400);
            expect(err.response.data).toBe('At least one itemImage object contains an invalid key');
          });
      });

      test('has at least one URL in an invalid URL form', () => {
        const badData = [
          {
            'small': 'https://images.unsplash.com/photo-1581467655410-0c2bf55d9d6c?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=54&fit=max&ixid=eyJhcHBfaWQiOjE0MzcyOX0',
            'medium': 'https://images.unsplash.com/photo-1581467655410-0c2bf55d9d6c?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjE0MzcyOX0',
            'large': 'https://images.unsplash.com/photo-1581467655410-0c2bf55d9d6c?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1000&fit=max&ixid=eyJhcHBfaWQiOjE0MzcyOX0'
          },
          {
            'small': 'https://',
            'medium': 'https://images.unsplash.com/photo-1521940340186-d473d4400001?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjE0MzcyOX0',
            'large': 'https://images.unsplash.com/photo-1521940340186-d473d4400001?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1000&fit=max&ixid=eyJhcHBfaWQiOjE0MzcyOX0'
          }
        ];

        let badDataStringified = JSON.stringify(badData);
        const badDataSplit = badDataStringified.split('&');
        badDataStringified = badDataSplit.join('%26');

        return axios.put(`http://127.0.0.1:3003/updateItemImages/20000000?itemImages=${badDataStringified}`)
          .catch((err) => {
            expect(err.response.status).toBe(400);
            expect(err.response.data).toBe('At least one URL is not a valid URL format');
          });
      });

      test('has at least one itemImage object with a mmissing required key', () => {
        const badData = [
          {
            'medium': 'https://images.unsplash.com/photo-1581467655410-0c2bf55d9d6c?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjE0MzcyOX0',
            'large': 'https://images.unsplash.com/photo-1581467655410-0c2bf55d9d6c?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1000&fit=max&ixid=eyJhcHBfaWQiOjE0MzcyOX0'
          },
          {
            'small': 'https://images.unsplash.com/photo-1581467655410-0c2bf55d9d6c?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=54&fit=max&ixid=eyJhcHBfaWQiOjE0MzcyOX0',
            'medium': 'https://images.unsplash.com/photo-1521940340186-d473d4400001?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjE0MzcyOX0',
            'large': 'https://images.unsplash.com/photo-1521940340186-d473d4400001?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1000&fit=max&ixid=eyJhcHBfaWQiOjE0MzcyOX0'
          }
        ];

        let badDataStringified = JSON.stringify(badData);
        const badDataSplit = badDataStringified.split('&');
        badDataStringified = badDataSplit.join('%26');

        return axios.put(`http://127.0.0.1:3003/updateItemImages/20000000?itemImages=${badDataStringified}`)
          .catch((err) => {
            expect(err.response.status).toBe(400);
            expect(err.response.data).toBe('At least one itemImage object fails to contain the key \'small\'');
          });
      });
    });

    test('the server correctly updates a record in the DB when the PUT data conforms to the API standard', () => {
      const goodData = [
        {
          'small': 'https://images.unsplash.com/photo-1581467655410-0c2bf55d9d6c?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=54&fit=max&ixid=eyJhcHBfaWQiOjE0MzcyOX0',
          'medium': 'https://images.unsplash.com/photo-1581467655410-0c2bf55d9d6c?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjE0MzcyOX0',
          'large': 'https://images.unsplash.com/photo-1581467655410-0c2bf55d9d6c?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1000&fit=max&ixid=eyJhcHBfaWQiOjE0MzcyOX0'
        },
        {
          'small': 'https://images.unsplash.com/photo-1521940340186-d473d4400001?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=54&fit=max&ixid=eyJhcHBfaWQiOjE0MzcyOX0',
          'medium': 'https://images.unsplash.com/photo-1521940340186-d473d4400001?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjE0MzcyOX0',
          'large': 'https://images.unsplash.com/photo-1521940340186-d473d4400001?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1000&fit=max&ixid=eyJhcHBfaWQiOjE0MzcyOX0'
        }
      ];

      let goodDataStringified = JSON.stringify(goodData);
      const goodDataSplit = goodDataStringified.split('&');
      goodDataStringified = goodDataSplit.join('%26');

      return axios.put(`http://127.0.0.1:3003/updateItemImages/20000000?itemImages=${goodDataStringified}`)
        .then((response) => {
          const { status, data } = response;

          expect(status).toBe(201);
          expect(data).toBe('Item 20000000 succesfully updated');
        })
        .catch((err) => {
          console.log(err);
        });
    });
  });

  describe('includes the DELETE method for the path /deleteItemImages/:itemId where', () => {
    test('the server correctly deletes the data for the supplied itemiD', () => {
      return axios.delete('http://127.0.0.1:3003/deleteItemImages/20000000')
        .then((response) => {
          const { status, data } = response;

          expect(status).toBe(201);
          expect(itemId).toBe('Item 20000000 deleted');
        })
        .catch((err) => {
          console.log(err);
        });
    });

    describe('the server correctly returns 400 when attempting to delete an item record with', () => {
      test('a non-number itemId', () => {
        return axios.delete('http://127.0.0.1:3003/deleteItemImages/a')
          .catch((err) => {
            expect(err.response.status).toBe(400);
            expect(err.response.data).toBe('itemId invalid. Must be string representing integer number greater than 99');
          });
      });

      test('a itemId representing a lower less than 100', () => {
        return axios.delete('http://127.0.0.1:3003/deleteItemImages/99')
          .catch((err) => {
            expect(err.response.status).toBe(400);
            expect(err.response.data).toBe('itemId invalid. Must be string representing integer number greater than 99');
          });
      });


      test('a itemId representing a item that doesn\'t exist in the database', () => {
        return axios.delete('http://127.0.0.1:3003/deleteItemImages/15000000')
          .catch((err) => {
            expect(err.response.status).toBe(400);
            expect(err.response.data).toBe('No item matches itemId');
          });
      });
    });
  });
});
