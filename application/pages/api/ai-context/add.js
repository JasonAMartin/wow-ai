import db from '../../../lib/db';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { topic, context, notes } = req.body;
  if (!topic || !context) {
    res.status(400).json({ error: 'Missing required fields: topic and context.' });
    return;
  }

  // Validate that context is valid JSON.
  try {
    JSON.parse(context);
  } catch (e) {
    return res.status(400).json({ error: 'Context field is not valid JSON.' });
  }

  const insertQuery = `INSERT INTO AIContext (topic, context, notes) VALUES (?, ?, ?)`;
  db.run(insertQuery, [topic, context, notes || ''], function (err) {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Error inserting AI context.' });
    } else {
      res.status(200).json({ message: 'AI Context added successfully.' });
    }
  });
}
