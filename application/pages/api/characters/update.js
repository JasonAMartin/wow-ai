import db from '../../../lib/db';

// Helper to round numbers to 2 decimal places.
function roundNumber(num) {
  const n = parseFloat(num);
  if (isNaN(n)) return 0;
  return Math.round(n * 100) / 100;
}

export default function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { characterData, completeOverwrite } = req.body;
  if (!characterData || !characterData.class || !characterData.spec || !characterData.name) {
    res.status(400).json({ error: 'Missing required character fields (class, spec, name).' });
    return;
  }

  // Extract basic info.
  const { class: charClass, spec, name, stats, talents, mainStat, overallItemLevel, level } = characterData;
  
  // Map stats from JSON to DB fields.
  const critical_strike = stats && stats.criticalStrike ? roundNumber(stats.criticalStrike) : 0;
  const versatility = stats && stats.versatility ? roundNumber(stats.versatility) : 0;
  const mastery = stats && stats.mastery ? roundNumber(stats.mastery) : 0;
  const armor = stats && stats.armor ? parseInt(stats.armor) : 0;
  const haste = stats && stats.haste ? roundNumber(stats.haste) : 0;
  const stamina = stats && stats.stamina ? parseInt(stats.stamina) : 0;
  const agility = stats && stats.agility ? parseInt(stats.agility) : 0;
  const blocking = stats && stats.blocking ? roundNumber(stats.blocking) : 0;
  const dodge = stats && stats.dodge ? roundNumber(stats.dodge) : 0;
  const strength = stats && stats.strength ? parseInt(stats.strength) : 0;
  const intellect = stats && stats.intellect ? parseInt(stats.intellect) : 0;
  const parry = stats && stats.parry ? roundNumber(stats.parry) : 0;

  const hero_spec = talents && talents.heroSpec ? talents.heroSpec : '';

  // Build an object with the fields to update.
  const updateData = {
    hero_spec,
    critical_strike,
    versatility,
    mastery,
    armor,
    haste,
    stamina,
    agility,
    blocking,
    dodge,
    strength,
    intellect,
    parry,
    overall_item_level: overallItemLevel !== undefined ? overallItemLevel : null,
    level: level !== undefined ? level : null,
    main_stat: mainStat !== undefined ? mainStat : null,
    notes: '' // always blank as per requirements
  };

  // Check if a character exists matching name, class, and spec.
  const selectQuery = `SELECT * FROM Characters WHERE name = ? AND class = ? AND spec = ?`;
  db.get(selectQuery, [name, charClass, spec], (err, row) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Database error during select.' });
      return;
    }
    if (!row) {
      // Character not found; insert a new record.
      const insertQuery = `
        INSERT INTO Characters 
          (class, name, spec, hero_spec, critical_strike, versatility, mastery, armor, haste, stamina, agility, blocking, dodge, strength, intellect, parry, main_stat, notes, overall_item_level, level)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      db.run(
        insertQuery,
        [
          charClass,
          name,
          spec,
          updateData.hero_spec,
          updateData.critical_strike,
          updateData.versatility,
          updateData.mastery,
          updateData.armor,
          updateData.haste,
          updateData.stamina,
          updateData.agility,
          updateData.blocking,
          updateData.dodge,
          updateData.strength,
          updateData.intellect,
          updateData.parry,
          updateData.main_stat,
          updateData.notes,
          updateData.overall_item_level,
          updateData.level
        ],
        function (err2) {
          if (err2) {
            console.error(err2);
            res.status(500).json({ error: 'Error inserting new character.' });
          } else {
            res.status(200).json({ message: 'Character inserted successfully.' });
          }
        }
      );
    } else {
      // Character exists; perform an update.
      if (completeOverwrite) {
        // Overwrite every column with the new values (even if 0 or null).
        const updateQuery = `
          UPDATE Characters SET
            hero_spec = ?,
            critical_strike = ?,
            versatility = ?,
            mastery = ?,
            armor = ?,
            haste = ?,
            stamina = ?,
            agility = ?,
            blocking = ?,
            dodge = ?,
            strength = ?,
            intellect = ?,
            parry = ?,
            main_stat = ?,
            notes = ?,
            overall_item_level = ?,
            level = ?
          WHERE id = ?
        `;
        db.run(
          updateQuery,
          [
            updateData.hero_spec,
            updateData.critical_strike,
            updateData.versatility,
            updateData.mastery,
            updateData.armor,
            updateData.haste,
            updateData.stamina,
            updateData.agility,
            updateData.blocking,
            updateData.dodge,
            updateData.strength,
            updateData.intellect,
            updateData.parry,
            updateData.main_stat,
            updateData.notes,
            updateData.overall_item_level,
            updateData.level,
            row.id
          ],
          function (err2) {
            if (err2) {
              console.error(err2);
              res.status(500).json({ error: 'Error updating character (complete overwrite).' });
            } else {
              res.status(200).json({ message: 'Character updated with complete overwrite.' });
            }
          }
        );
      } else {
        // Partial update: update only fields that are provided (non-null).
        let fields = [];
        let values = [];
        for (const key in updateData) {
          if (updateData[key] !== null && updateData[key] !== undefined) {
            fields.push(`${key} = ?`);
            values.push(updateData[key]);
          }
        }
        if (fields.length === 0) {
          res.status(200).json({ message: 'No updates provided.' });
          return;
        }
        const updateQuery = `UPDATE Characters SET ${fields.join(', ')} WHERE id = ?`;
        values.push(row.id);
        db.run(updateQuery, values, function (err3) {
          if (err3) {
            console.error(err3);
            res.status(500).json({ error: 'Error updating character (partial update).' });
          } else {
            res.status(200).json({ message: 'Character updated successfully (partial update).' });
          }
        });
      }
    }
  });
}
