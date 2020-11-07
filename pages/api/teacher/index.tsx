import { NextApiRequest, NextApiResponse } from 'next';
import connect from '../../../utils/database';

interface ErrorResponse {
  error: string;
}

export default async (
  req: NextApiRequest,
  res: NextApiResponse<ErrorResponse | Record<string, unknown>[]>
): Promise<void> => {
  if (req.method === 'GET') {
    const { db } = await connect();

    const response = await db.find({ teacher: true }).toArray();

    res.status(200).json(response);
  } else {
    res.status(400).json({ error: 'Wrong request method' });
  }
};
