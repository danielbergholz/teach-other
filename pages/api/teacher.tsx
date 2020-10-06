import { NextApiRequest, NextApiResponse } from 'next';
import { ObjectID } from 'mongodb';
import connect from '../../utils/database';

interface ErrorResponseType {
  error: string;
}

interface SuccessResponseType {
  _id: string;
  name: string;
  email: string;
  cellphone: string;
  teacher: true;
  coins: 1;
  courses: string[];
  available_hours: object;
  available_locations: string[];
  reviews: object[];
  appointments: object[];
}

export default async (
  req: NextApiRequest,
  res: NextApiResponse<ErrorResponseType | SuccessResponseType>
): Promise<void> => {
  if (req.method === 'GET') {
    const { id } = req.body;

    if (!id) {
      res.status(400).json({ error: 'Missing teacher ID on request body' });
      return;
    }

    const { db } = await connect();

    const response = await db
      .collection('users')
      .findOne({ _id: new ObjectID(id) });

    if (!response) {
      res.status(400).json({ error: 'Teacher not found' });
      return;
    }

    res.status(200).json(response);
  } else {
    res.status(400).json({ error: 'Wrong request method' });
  }
};
