import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      // Retrieve all delve runs from the database
      const runs = await prisma.delveRun.findMany({
        orderBy: {
          createdAt: 'desc'
        }
      });

      res.status(200).json({ runs });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error fetching delve runs.' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
