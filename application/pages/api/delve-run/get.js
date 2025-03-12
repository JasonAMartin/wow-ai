import db from '../../../lib/db';

export default function handler(req, res) {
  if (req.method === 'GET') {
    // Check if we need to filter by character ID
    const characterId = req.query.characterId;
    
    // Base SQL query with JOINs
    let query = `
      SELECT 
        dr.*,
        c.name as character_name, 
        c.class as character_class, 
        c.spec as character_spec,
        d.name as delve_name,
        d.zone as delve_zone
      FROM DelveRun dr
      LEFT JOIN Characters c ON dr.characters_id = c.id
      LEFT JOIN Delves d ON dr.delves_id = d.id
    `;
    
    // Add character filter if specified
    if (characterId) {
      query += ` WHERE dr.characters_id = ?`;
    }
    
    // Add ordering
    query += ` ORDER BY dr.createdAt DESC`;
    
    // Parameters for the query
    const params = characterId ? [characterId] : [];
    
    db.all(query, params, (err, rows) => {
      if (err) {
        console.error('Error fetching delve runs:', err);
        res.status(500).json({ error: 'Error fetching records' });
      } else {
        // Transform the data to match expected format in the frontend
        const transformedRows = rows.map(row => ({
          ...row,
          character: {
            id: row.characters_id,
            name: row.character_name,
            class: row.character_class,
            spec: row.character_spec
          },
          delve: {
            id: row.delves_id,
            name: row.delve_name,
            zone: row.delve_zone
          }
        }));
        
        res.status(200).json({ runs: transformedRows });
      }
    });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}