import middy from '@middy/core'; // eslint-disable-line
import { APIGatewayProxyEvent } from 'aws-lambda'; // eslint-disable-line

const parseJSONBody = (event: APIGatewayProxyEvent): void => {
  if (!event.body) return;
  try {
    event.body = JSON.parse(event.body); // eslint-disable-line no-param-reassign
  } catch (err) {
    console.log(err);
    throw new Error('invalid JSON was provided');
  }
};

export default () => ({
  before(handler: middy.HandlerLambda, next: middy.NextFunction) {
    parseJSONBody(handler.event);
    return next();
  },
});
