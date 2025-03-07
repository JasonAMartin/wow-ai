import db from '../../../lib/db';

export default function handler(req, res) {
  if (req.method === 'GET') {
    db.all(`SELECT * FROM Curios`, [], (err, rows) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: 'Error fetching curios.' });
      } else {
        res.status(200).json({ curios: rows });
      }
    });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
