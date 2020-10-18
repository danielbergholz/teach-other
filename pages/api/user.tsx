import { NextApiRequest, NextApiResponse } from 'next';
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
  coins: number;
  courses: string[];
  available_hours: Record<string, number[]>;
  available_locations: string[];
  reviews: Record<string, unknown>[];
  appointments: Record<string, unknown>[];
}

export default async (
  req: NextApiRequest,
  res: NextApiResponse<ErrorResponseType | SuccessResponseType>
): Promise<void> => {
  // CREATE USER
  if (req.method === 'POST') {
    const {
      name,
      email,
      cellphone,
      teacher,
      courses,
      available_locations,
      available_hours,
    }: {
      name: string;
      email: string;
      cellphone: string;
      teacher: boolean;
      courses: string[];
      available_locations: string[];
      available_hours: Record<string, number[]>;
    } = req.body;

    if (!teacher) {
      if (!name || !email || !cellphone) {
        res.status(400).json({ error: 'Missing body parameter' });
        return;
      }
    } else if (teacher) {
      if (
        !name ||
        !email ||
        !cellphone ||
        !courses ||
        !available_hours ||
        !available_locations
      ) {
        res.status(400).json({ error: 'Missing body parameter' });
        return;
      }
    }

    const { db } = await connect();

    const lowerCaseEmail = email.toLowerCase();
    const emailAlreadyExists = await db.findOne({ email: lowerCaseEmail });
    if (emailAlreadyExists) {
      res
        .status(400)
        .json({ error: `E-mail ${lowerCaseEmail} already exists` });
      return;
    }

    const response = await db.insertOne({
      name,
      email: lowerCaseEmail,
      cellphone,
      teacher,
      coins: 1,
      courses: courses || [],
      available_hours: available_hours || {},
      available_locations: available_locations || [],
      reviews: [],
      appointments: [],
    });

    res.status(200).json(response.ops[0]);
  }

  // SHOW USER PROFILE
  else if (req.method === 'GET') {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({ error: 'Missing e-mail on request body' });
      return;
    }

    const { db } = await connect();

    const response = await db.findOne({ email });

    if (!response) {
      res.status(400).json({ error: `User with e-mail ${email} not found` });
      return;
    }

    res.status(200).json(response);
  } else {
    res.status(400).json({ error: 'Wrong request method' });
  }
};
