import db from '../../../lib/db';

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: 'Character ID is required' });
  }

  // Get a single character by ID
  db.get(
    `SELECT * FROM Characters WHERE id = ?`,
    [id],
    (err, character) => {
      if (err) {
        console.error('Error fetching character:', err);
        return res.status(500).json({ error: 'Database error' });
      }

      if (!character) {
        return res.status(404).json({ error: 'Character not found' });
      }

      res.status(200).json({ character });
    }
  );
}