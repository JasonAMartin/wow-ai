import db from '../../../lib/db';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  const { curios } = req.body;
  if (!Array.isArray(curios)) {
    res.status(400).json({ error: 'Invalid input, expected an array of curios.' });
    return;
  }

  let completed = 0;
  const total = curios.length;
  let errors = [];

  // Update each curio record.
  curios.forEach((curio) => {
    const updateQuery = `UPDATE Curios SET owned = ?, rank = ?, curios_image = ? WHERE id = ?`;
    db.run(updateQuery, [curio.owned, curio.rank, curio.curios_image, curio.id], function (err) {
      if (err) {
        console.error(`Error updating curio id ${curio.id}:`, err);
        errors.push(`Curio ${curio.id}`);
      }
      completed++;
      if (completed === total) {
        if (errors.length > 0) {
          res.status(500).json({ error: `Errors updating: ${errors.join(', ')}` });
        } else {
          res.status(200).json({ message: 'All curios updated successfully.' });
        }
      }
    });
  });
}
