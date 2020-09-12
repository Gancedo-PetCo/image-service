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
          expect(itemImages).toBeDefined();
          expect(typeof(itemImages)).toBe('string');
        })
        .catch((err) => {
          console.log(err);
        });
    });

    test('the server correctly returns 404 for an item not in the DB', () => {
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
        const badData = '';

        return axios.post(`http://127.0.0.1:3003/addItemImages/20000000?itemImages=${badData}`)
          .catch((err) => {
            expect(err.response.status).toBe(400);
            expect(err.response.data).toBe('No itemImages present in request query params');
          });
      });

      test('has an itemId that already exists in the database', () => {
        const goodData = [
          'https://images.unsplash.com/photo-1581467655410-0c2bf55d9d6c?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjE0MzcyOX0',
          'https://images.unsplash.com/photo-1521940340186-d473d4400001?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjE0MzcyOX0',
        ];

        const goodDataStringified = goodData.join('XXX');

        return axios.post(`http://127.0.0.1:3003/addItemImages/100?itemImages=${goodDataStringified}`)
          .catch((err) => {
            expect(err.response.status).toBe(400);
            expect(err.response.data).toBe('Item with that itemId already exists');
          });
      });

      test('has more than three itemImages submitted', () => {
        const badData = [
          'https://images.unsplash.com/photo-1581467655410-0c2bf55d9d6c',
          'https://images.unsplash.com/photo-1521940340186-d473d4400001',
          'https://images.unsplash.com/photo-1581467655410-0c2bf55d9dnz',
          'https://images.unsplash.com/photo-1521940340186-d473d44000nz',
        ];

        const badDataStringified = badData.join('XXX');

        return axios.post(`http://127.0.0.1:3003/addItemImages/20000000?itemImages=${badDataStringified}`)
          .catch((err) => {
            expect(err.response.status).toBe(400);
            expect(err.response.data).toBe('Too many itemImages included. Max is 3.');
          });
      });

      test('has at least one URL that is not a valid Unsplash image URL', () => {
        const badData = [
          'https://images.unsplash.com/photo-1581467655410-0c2bf55d9d6c',
          'https://images.unsplas.com/photo-1521940340186-d473d4400001'
        ];

        const badDataStringified = badData.join('XXX');

        return axios.post(`http://127.0.0.1:3003/addItemImages/20000001?itemImages=${badDataStringified}`)
          .catch((err) => {
            expect(err.response.status).toBe(400);
            expect(err.response.data).toBe('At least one URL is not a Unsplash URL');
          });
      });

      test('has at least one URL that does not have a valid Unsplash Unique Identifier', () => {
        const badData = [
          'https://images.unsplash.com/photo-1581467655410-0c2bf55d9d6c',
          'https://images.unsplash.com/photo-1521940340186d473d4400001',
        ];

        const badDataStringified = badData.join('XXX');

        return axios.post(`http://127.0.0.1:3003/addItemImages/20000001?itemImages=${badDataStringified}`)
          .catch((err) => {
            expect(err.response.status).toBe(400);
            expect(err.response.data).toBe('At least one URL is not a valid Unsplash photo URL');
          });
      });

      test('has at least one URL in an invalid URL form', () => {
        const badData = [
          'https://images.unsplash.com/photo-1581467655410-0c2bf55d9d6c?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=54&fit=max&ixid=eyJhcHBfaWQiOjE0MzcyOX0',
          'https://'
        ];

        const badDataStringified = badData.join('XXX');

        return axios.post(`http://127.0.0.1:3003/addItemImages/20000001?itemImages=${badDataStringified}`)
          .catch((err) => {
            expect(err.response.status).toBe(400);
            expect(err.response.data).toBe('At least one URL is not a valid URL format');
          });
      });
    });

    test('the server correctly inserts a record into the DB when the POSTed data conforms to the API standard', () => {
      const goodData = [
        'https://images.unsplash.com/photo-1581467655410-0c2bf55d9d6c?',
        'https://images.unsplash.com/photo-1521940340186-d473d4400001?',
      ];

      const goodDataStringified = goodData.join('XXX');

      return axios.post(`http://127.0.0.1:3003/addItemImages/20000000?itemImages=${goodDataStringified}`)
        .then((response) => {
          const { status, data } = response;

          expect(status).toBe(201);
          expect(data).toBe('Item 20000000 successfully added to database');
          return axios.get('http://127.0.0.1:3003/itemImages/20000000')
            .then((response) => {
              const { status, data } = response;
              const { itemId, itemImages } = data;

              expect(status).toBe(200);
              expect(itemId).toBe('20000000');
              expect(itemImages).toBe('1581467655410-0c2bf55d9d6cXXX1521940340186-d473d4400001');
            });
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
        const badData = '';

        return axios.put(`http://127.0.0.1:3003/updateItemImages/20000000?itemImages=${badData}`)
          .catch((err) => {
            expect(err.response.status).toBe(400);
            expect(err.response.data).toBe('No itemImages present in request query params');
          });
      });

      test('has an itemId that doesn\'t exist in the database', () => {
        const goodData = [
          'https://images.unsplash.com/photo-1581467655410-0c2bf55d9d6c?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjE0MzcyOX0',
          'https://images.unsplash.com/photo-1521940340186-d473d4400001?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjE0MzcyOX0',
        ];

        const goodDataStringified = goodData.join('XXX');

        return axios.put(`http://127.0.0.1:3003/updateItemImages/15000000?itemImages=${goodDataStringified}`)
          .catch((err) => {
            expect(err.response.status).toBe(400);
            expect(err.response.data).toBe('Item with the itemId 15000000 does not exist');
          });
      });

      test('has more than three itemImages submitted', () => {
        const badData = [
          'https://images.unsplash.com/photo-1581467655410-0c2bf55d9d6c',
          'https://images.unsplash.com/photo-1521940340186-d473d4400001',
          'https://images.unsplash.com/photo-1581467655410-0c2bf55d9dnz',
          'https://images.unsplash.com/photo-1521940340186-d473d44000nz',
        ];

        const badDataStringified = badData.join('XXX');

        return axios.put(`http://127.0.0.1:3003/updateItemImages/100?itemImages=${badDataStringified}`)
          .catch((err) => {
            expect(err.response.status).toBe(400);
            expect(err.response.data).toBe('Too many itemImages included. Max is 3.');
          });
      });

      test('has at least one URL that is not a valid Unsplash image URL', () => {
        const badData = [
          'https://images.unsplash.com/photo-1581467655410-0c2bf55d9d6c',
          'https://images.unsplas.com/photo-1521940340186-d473d4400001',
        ];

        const badDataStringified = badData.join('XXX');

        return axios.put(`http://127.0.0.1:3003/updateItemImages/100?itemImages=${badDataStringified}`)
          .catch((err) => {
            expect(err.response.status).toBe(400);
            expect(err.response.data).toBe('At least one URL is not a Unsplash URL');
          });
      });

      test('has at least one URL that does not have a valid Unsplash Unique Identifier', () => {
        const badData = [
          'https://images.unsplash.com/photo-15814676554100c2bf55d9d6c',
          'https://images.unsplash.com/photo-1521940340186-d473d4400001'
        ];

        const badDataStringified = badData.join('XXX');

        return axios.put(`http://127.0.0.1:3003/updateItemImages/100?itemImages=${badDataStringified}`)
          .catch((err) => {
            expect(err.response.status).toBe(400);
            expect(err.response.data).toBe('At least one URL is not a valid Unsplash photo URL');
          });
      });

      test('has at least one URL in an invalid URL form', () => {
        const badData = [
          'https://images.unsplash.com/photo-1581467655410-0c2bf55d9d6c?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=54&fit=max&ixid=eyJhcHBfaWQiOjE0MzcyOX0',
          'https://',
        ];

        const badDataStringified = badData.join('XXX');

        return axios.put(`http://127.0.0.1:3003/updateItemImages/20000000?itemImages=${badDataStringified}`)
          .catch((err) => {
            expect(err.response.status).toBe(400);
            expect(err.response.data).toBe('At least one URL is not a valid URL format');
          });
      });
    });

    test('the server correctly updates a record in the DB when the PUT data conforms to the API standard', () => {
      const goodData = [
        'https://images.unsplash.com/photo-1581467655410-0c2bf55d9dnz?',
        'https://images.unsplash.com/photo-1521940340186-d473d44000nz?',
      ];

      const goodDataStringified = goodData.join('XXX');

      return axios.put(`http://127.0.0.1:3003/updateItemImages/20000000?itemImages=${goodDataStringified}`)
        .then((response) => {
          const { status, data } = response;

          expect(status).toBe(201);
          expect(data).toBe('Item 20000000 successfully updated');
          return axios.get('http://127.0.0.1:3003/itemImages/20000000')
            .then((response) => {
              const { status, data } = response;
              const { itemId, itemImages } = data;

              expect(status).toBe(200);
              expect(itemId).toBe('20000000');
              expect(itemImages).toBe('1581467655410-0c2bf55d9dnzXXX1521940340186-d473d44000nz');
            });
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
          expect(data).toBe('Item 20000000 deleted');
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
