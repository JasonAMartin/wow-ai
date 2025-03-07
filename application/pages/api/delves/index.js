import db from '../../../lib/db';

export default function handler(req, res) {
  if (req.method === 'GET') {
    db.all(`SELECT * FROM Delves`, [], (err, rows) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: 'Error fetching delves' });
      } else {
        res.status(200).json({ delves: rows });
      }
    });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
