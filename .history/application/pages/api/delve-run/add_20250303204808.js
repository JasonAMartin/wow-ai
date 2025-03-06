import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const {
      delveName,
      tier,
      character,
      brannLevel,
      brannSpec,
      combatCurios,
      utilityCurios,
      myItemLevel,
      bossKillTime,
      notes,
      dateRun
    } = req.body;

    try {
      // Create new delve run record in the database
      const newRun = await prisma.delveRun.create({
        data: {
          delveName,
          tier: parseInt(tier),
          character,
          brannLevel: parseInt(brannLevel),
          brannSpec,
          combatCurios,
          utilityCurios,
          myItemLevel,
          bossKillTime,
          notes,
          dateRun
        }
      });

      // Format the output text as specified
      // Combine curios fields into one string if both exist.
      let curiosText = '';
      if (combatCurios && utilityCurios) {
        curiosText = `${combatCurios} and ${utilityCurios}`;
      } else {
        curiosText = combatCurios || utilityCurios || '';
      }

      const message = `New Delve Run!

Character: ${character}
Tier: ${tier}
Delve: ${delveName}
Brann Level: ${brannLevel}
Brann Spec: ${brannSpec}
Curios: ${curiosText}
My Item Level: ${myItemLevel}
Boss Kill Time: ${bossKillTime}
Notes: ${notes}
Date Run: ${dateRun}`;

      res.status(200).json({ message, run: newRun });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error creating delve run.' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
