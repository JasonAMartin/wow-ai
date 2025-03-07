import db from '../../../lib/db';

export default function handler(req, res) {
  if (req.method === 'GET') {
    const { type } = req.query;
    if (!type) {
      return res.status(400).json({ error: 'Missing type query parameter' });
    }
    db.all(
      `SELECT * FROM Curios WHERE curio_type = ? AND owned = 1`,
      [type],
      (err, rows) => {
        if (err) {
          console.error(err);
          res.status(500).json({ error: 'Error fetching curios' });
        } else {
          res.status(200).json({ curios: rows });
        }
      }
    );
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
