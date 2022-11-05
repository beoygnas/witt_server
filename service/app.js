const express = require('express'); // express 프레임워크 import
const app = express(); // express를 통해 서버 환경 구축
const cors = require('cors'); // cors 라이브러리 import
const bodyParser = require('body-parser'); // body-parser 라이브러리 import
const port = process.env.PORT || 3001; // 3001 포트 사용
// const hostName = '자기 자신의 IP주소'

// express 서버 환경 설정
app.use(cors()); // cors 사용
app.use(bodyParser.json()); // body-parser 사용

// localhost:3001/test URL 입력 시 해당 함수 호출
app.use('/test', (req, res) => {
  res.json({ carName: '해롱이' });
});

// express 서버 열기
app.listen(port, () => {
  // port, hostName, () 으로 인자를 하나 추가하여 직접 호스트명 선언 가능
  console.log(`express is running on ${port}`);
});
