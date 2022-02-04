import express, { Request, Response } from 'express';
import axios from 'axios';
import cors from 'cors';

import { cryptoHandle } from './cryptoHandle';

const app = express();

app.use(cors());
app.use(express.json());

app.post('/', async (req: Request, res: Response) => {
  const { userName, userBirthday }: { userName: string, userBirthday: string } = Object.assign(req.body, req.query);

  try {
    const response = await axios.post('https://senhcs.eduro.go.kr/v2/findUser',
      JSON.stringify({
        name: cryptoHandle.RSA_ENC(cryptoHandle.AES_DEC(userName)),
        birthday: cryptoHandle.RSA_ENC(cryptoHandle.AES_DEC(userBirthday)),
        loginType: 'school',
        orgCode: 'B100000581',
        stdntPNo: null
      }),
      { headers: { 'Content-Type': 'application/json; charset=utf-8', } });
    return res.json({
      isError: false,
      message: '학생 인증에 성공했습니다.'
    });
  } catch (err) {
    return res.json({
      isError: true,
      message: '학생 인증에 실패했습니다.',
    });
  }
});

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});