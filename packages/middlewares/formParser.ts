import { INormalizedEvent } from '../../types'; // eslint-disable-line
//import Busboy from 'busboy';
const Busboy = require('busboy');

// TODO: busboy type 설정
export default (event: INormalizedEvent) => {
  return new Promise((resolve, reject) => {
    const busboy = Busboy({
      headers: {
        ...event.headers,
        'content-type': event.headers['Content-Type'] || event.headers['content-type'],
      },
    });

    const result: any = {
      file: [],
      imageFile: [],
    };

    // busboy.on("File", (fieldname, file, filename, encoding, mimetype) => {
    //     const chunks: any = [];
    //     file.on("data", (data) => {
    //         chunks.push(data);
    //     }).on('end', () => {
    //         result[fieldname] = file;

    //     });
    // });

    busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
      const chunks: any = [];
      file
        .on('data', (data) => {
          chunks.push(data);
        })
        .on('end', () => {
          result[fieldname] = [filename, Buffer.concat(chunks), mimetype];
          result['imageFile'] = file;
        });
    });

    var isArray: string[] = [];
    busboy.on('field', (fieldname, value) => {
      try {
        if (!isArray.includes(fieldname)) {
          result[fieldname] = value; //JSON.parse(value)
        } else {
          if (typeof result[fieldname] === 'string') {
            const temp = result[fieldname];
            result[fieldname] = Array<string>();
            result[fieldname].push(temp);
          }
          result[fieldname].push(value);
        }
        isArray.push(fieldname);
      } catch (err) {
        console.log(err);
      }
    });

    busboy.on('error', (error: any) => reject(`Parse error: ${error}`));

    busboy.on('finish', () => {
      event.body = result;
      resolve(event);
    });

    busboy.write(event.body, event.isBase64Encoded ? 'base64' : 'binary');
    busboy.end();
  });
};
