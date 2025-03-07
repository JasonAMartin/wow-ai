import db from '../../../lib/db';

export default function handler(req, res) {
  if (req.method === 'POST') {
    const {
      delves_id,
      tier,
      characters_id,
      brannLevel,
      brannSpec,
      combat_curio_id,
      utility_curio_id,
      myItemLevel,
      bossKillTime,
      totalTime,
      completed,
      rewards,
      notes,
      dateRun,
      season,
      partySize,
      difficultyModifiers
    } = req.body;

    const stmt = db.prepare(`
      INSERT INTO DelveRun (
        delves_id,
        tier,
        characters_id,
        brannLevel,
        brannSpec,
        combat_curio_id,
        utility_curio_id,
        myItemLevel,
        bossKillTime,
        totalTime,
        completed,
        rewards,
        notes,
        dateRun,
        season,
        partySize,
        difficultyModifiers
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      delves_id,
      parseInt(tier),
      characters_id,
      parseInt(brannLevel),
      brannSpec,
      combat_curio_id || null,
      utility_curio_id || null,
      myItemLevel,
      parseInt(bossKillTime),
      parseInt(totalTime),
      completed ? 1 : 0,
      rewards,
      notes,
      dateRun,
      parseInt(season),
      parseInt(partySize),
      difficultyModifiers,
      function (err) {
        if (err) {
          console.error(err);
          res.status(500).json({ error: 'Error inserting record' });
        } else {
          const message = `New Delve Run added for Character ID ${characters_id} in Delve ID ${delves_id}.`;
          res.status(200).json({ message });
        }
      }
    );
    stmt.finalize();
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
