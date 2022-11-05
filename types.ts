export interface INormalizedEvent {
  headers: {
    [name: string]: string;
  };
  httpMethod: string;
  isBase64Encoded: boolean;
  path: string;
  pathParameters: { [name: string]: string };
  queryStringParameters: { [name: string]: string };
  stageVariables: { [name: string]: string } | null;
  requestContext: {
    authorizer: {
      [name: string]: string;
    };
    connectionId: string;
  };
  resource: string;
  body: any;
}
