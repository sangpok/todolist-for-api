import jsonServer from 'json-server';

import { LowSync } from 'lowdb';
import { JSONFileSync } from 'lowdb/node';

const server = jsonServer.create();
const middlewares = jsonServer.defaults();

const db = new LowSync(new JSONFileSync('db.json'), {});

server.use(jsonServer.defaults()).use(jsonServer.router('db.json'));

server.delete('/todos/completed', (req, res) => {
  db.get('todos').remove({ completed: true }).write();

  res.send(db.get('todos').value());
});

server.listen(3001, () => {
  console.log('JSON Server is running');
});
