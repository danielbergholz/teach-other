import { NextApiRequest, NextApiResponse } from 'next';
// import { getSession } from 'next-auth/client';
import { ObjectID } from 'mongodb';
import connect from '../../utils/database';

interface User {
  name: string;
  email: string;
  cellphone: string;
  teacher: boolean;
  coins: number;
  courses: string[];
  available_hours: Record<string, number[]>;
  available_locations: string[];
  reviews: Record<string, unknown>[];
  appointments: {
    date: string;
  }[];
  _id: string;
}

interface ErrorResponseType {
  error: string;
}

interface SuccessResponseType {
  date: string;
  teacher_name: string;
  teacher_id: string;
  student_name: string;
  student_id: string;
  course: string;
  location: string;
  appointment_link: string;
}

export default async (
  req: NextApiRequest,
  res: NextApiResponse<ErrorResponseType | SuccessResponseType>
): Promise<void> => {
  if (req.method === 'POST') {
    // const session = await getSession({ req });

    // if (!session) {
    //   res.status(400).json({ error: 'Please login first' });
    //   return;
    // }

    const {
      date,
      teacher_name,
      teacher_id,
      student_name,
      student_id,
      course,
      location,
      appointment_link,
    }: {
      date: string;
      teacher_name: string;
      teacher_id: string;
      student_name: string;
      student_id: string;
      course: string;
      location: string;
      appointment_link: string;
    } = req.body;

    if (
      !date ||
      !teacher_name ||
      !teacher_id ||
      !student_name ||
      !student_id ||
      !course ||
      !location
    ) {
      res.status(400).json({ error: 'Missing parameter on request body' });
      return;
    }

    // check if teacher_id or student_id is invalid
    try {
      const testTeacherID = new ObjectID(teacher_id);
      const testStudentID = new ObjectID(student_id);
    } catch {
      res.status(400).json({ error: 'Wrong objectID' });
      return;
    }

    const parsedDate = new Date(date);
    const now = new Date();
    const today = {
      day: now.getDate(),
      month: now.getMonth(),
      year: now.getFullYear(),
    };
    const fullDate = {
      day: parsedDate.getDate(),
      month: parsedDate.getMonth(),
      year: parsedDate.getFullYear(),
    };

    // check if requested date is on the past
    if (
      fullDate.year < today.year ||
      fullDate.month < today.month ||
      fullDate.day < today.day
    ) {
      res.status(400).json({
        error: "You can't create appointments on the past",
      });
      return;
    }

    const { db } = await connect();

    // check if teacher exists
    const teacherExists: User = await db.findOne({
      _id: new ObjectID(teacher_id),
    });

    if (!teacherExists) {
      res.status(400).json({
        error: `Teacher ${teacher_name} with ID ${teacher_id} does not exist`,
      });
      return;
    }

    // check if student exists
    const studentExists: User = await db.findOne({
      _id: new ObjectID(student_id),
    });

    if (!studentExists) {
      res.status(400).json({
        error: `Student ${student_name} with ID ${student_id} does not exist`,
      });
      return;
    }

    // check if student have enough coins
    if (studentExists.coins === 0) {
      res.status(400).json({
        error: `Student ${student_name} does not have enough coins`,
      });
      return;
    }

    // check if requested day/hour is available for the teacher
    const weekdays = [
      'sunday',
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
      'saturday',
    ];
    const requestedDay = weekdays[parsedDate.getDay()];
    const requestedHour = parsedDate.getUTCHours() - 3;
    if (!teacherExists.available_hours[requestedDay]?.includes(requestedHour)) {
      res.status(400).json({
        error: `Teacher ${teacher_name} is not available at ${requestedDay} ${requestedHour}:00`,
      });
      return;
    }

    // check if teacher already have an appointment on the requested day of the month
    teacherExists.appointments.forEach((appointment) => {
      const appointmentDate = new Date(appointment.date);

      if (appointmentDate.getTime() === parsedDate.getTime()) {
        res.status(400).json({
          error: `Teacher ${teacher_name} already have an appointment at ${appointmentDate.getDate()}/${
            appointmentDate.getMonth() + 1
          }/${appointmentDate.getFullYear()} ${
            appointmentDate.getUTCHours() - 3
          }:00`,
        });
        return;
      }
    });

    // create appointment object
    const appointment = {
      date,
      teacher_name,
      teacher_id,
      student_name,
      student_id,
      course,
      location,
      appointment_link: appointment_link || '',
    };

    // update teacher appointments
    await db.updateOne(
      { _id: new ObjectID(teacher_id) },
      { $push: { appointments: appointment } }
    );

    // update student appointments
    await db.updateOne(
      { _id: new ObjectID(student_id) },
      { $push: { appointments: appointment }, $inc: { coins: -1 } }
    );

    res.status(200).json(appointment);
  } else {
    res.status(400).json({ error: 'Wrong request method' });
  }
};
