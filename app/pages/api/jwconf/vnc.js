import cookie from 'cookie';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
    if (req?.headers?.cookie) {
        const cookies = cookie.parse(req.headers.cookie);
        try {
          jwt.verify(cookies?.['authorization'], process.env.PASSWORD);
        } catch(err) {
          res.status(200).json({ error: 'Not authenticated' });
          return;
        }
    }else{
        res.status(200).json({ error: 'Not authenticated' });
        return;
    }
    
    let host = req.headers['host'].replace(':3000', '');
    res.status(301).redirect('http://' + host + ':7900?autoconnect=true&password=' + process.env.VNC_PASSWORD);
}



