import db from '../../../lib/db';

export default function handler(req, res) {
  if (req.method === 'GET') {
    db.all(`SELECT * FROM Characters`, [], (err, rows) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: 'Error fetching characters' });
      } else {
        res.status(200).json({ characters: rows });
      }
    });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
