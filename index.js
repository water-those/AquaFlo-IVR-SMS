import app from './application.js';
import { port } from './config.js';

const server = app.listen(port, function() {
  console.log('Express server listening on port ' + server.address().port);
});

export default server;
