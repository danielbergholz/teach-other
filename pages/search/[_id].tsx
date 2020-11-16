import { useState, useCallback } from 'react';
import { useSession } from 'next-auth/client';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import axios from 'axios';
import DatePicker from 'react-datepicker';

import NavBar from '../../components/nav';
import api from '../../utils/api';

interface Teacher {
  _id: string;
  name: string;
  email: string;
  cellphone: string;
  teacher: boolean;
  coins: number;
  courses: string[];
  available_hours: Record<string, number[]>;
  available_locations: string[];
  reviews: Record<string, unknown>[];
  appointments: Record<string, unknown>[];
}

const weekDayNumber = {
  sunday: 0,
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
};

const weekdays = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
];

export default function teacherProfilePage({
  _id,
  name,
  email,
  courses,
  available_hours,
  available_locations,
  appointments,
}: Teacher): JSX.Element {
  const [session, loading] = useSession();

  const [location, setLocation] = useState(null);
  const [appointmentLink, setAppointmentLink] = useState(null);
  const [course, setCourse] = useState(null);
  const [date, setDate] = useState(() => {
    const validDaysNumber: number[] = [];

    for (const dayOfTheWeek in available_hours) {
      validDaysNumber.push(weekDayNumber[dayOfTheWeek]);
    }
    const minDay = Math.min(...validDaysNumber);

    const d = new Date();
    d.setDate(d.getDate() + ((((7 - d.getDay()) % 7) + minDay) % 7));
    const date = new Date(
      d.getFullYear(),
      d.getMonth(),
      d.getDate(),
      available_hours[weekdays[minDay]][0],
      0,
      0
    );

    return date;
  });

  const [allDates] = useState(() => {
    const StartDate = new Date();
    const EndDate = new Date(new Date().setMonth(new Date().getMonth() + 1));

    const oneDay = 1000 * 60 * 60 * 24;

    const start = Date.UTC(
      EndDate.getFullYear(),
      EndDate.getMonth(),
      EndDate.getDate()
    );
    const end = Date.UTC(
      StartDate.getFullYear(),
      StartDate.getMonth(),
      StartDate.getDate()
    );

    const daysBetween = (start - end) / oneDay;

    const validDaysNumber: number[] = [];
    for (const dayOfTheWeek in available_hours) {
      validDaysNumber.push(weekDayNumber[dayOfTheWeek]);
    }

    const invalidDates: Date[] = [];
    const validDates: Date[] = [];
    invalidDates.push(new Date());
    const loopDate = StartDate;
    for (let i = 0; i < daysBetween; ++i) {
      const aux = loopDate.setDate(loopDate.getDate() + 1);

      if (!validDaysNumber.includes(loopDate.getDay())) {
        invalidDates.push(new Date(aux));
      } else {
        validDates.push(new Date(aux));
      }
    }

    return { validDates, invalidDates };
  });

  const [validHours] = useState(() => {
    const validHours: Date[] = [];

    allDates.validDates.forEach((validDate) => {
      const copyValidDate = validDate;

      const validDateDayNumber = copyValidDate.getDay();
      const validDateDay = weekdays[validDateDayNumber];
      const availableHours = available_hours[validDateDay];
      if (availableHours) {
        let i = 0;
        while (i < 24) {
          if (availableHours.includes(i)) {
            validHours.push(
              new Date(
                copyValidDate.getFullYear(),
                copyValidDate.getMonth(),
                copyValidDate.getDate(),
                i,
                0,
                0
              )
            );
          }
          i++;
        }
      }
    });

    return validHours;
  });

  const handleSubmit = useCallback(async () => {
    const data = {
      date,
      teacher_id: _id,
      student_email: session?.user?.email || null,
      course,
      location,
      appointment_link: appointmentLink || '',
    };

    try {
      const response = await axios.post(
        process.env.NEXT_PUBLIC_URL + '/api/appointment',
        data
      );
      alert(response.data);
    } catch (err) {
      alert(err);
    }

    console.log({ data });
  }, [session, course, location, date, appointmentLink]);

  const handleDateSelect = useCallback(
    (event: Date) => {
      setDate(event);
    },
    [setDate]
  );

  return (
    <>
      <NavBar />
      <div className="flex flex-col items-center">
        <h1 className="text-3xl">Página do professor {name}</h1>
        <h1 className="text-2xl">E-mail: {email}</h1>
        <h1 className="text-2xl">ID: {_id}</h1>
        <h1 className="text-2xl mt-2">Matérias disponíveis:</h1>
        {courses.map((course) => (
          <h2 key={course} className="text-xl">
            {course}
          </h2>
        ))}
        <h1 className="text-2xl mt-2">Horários disponíveis na segunda:</h1>
        {available_hours?.monday?.map((hour) => (
          <h2 key={`monday-${hour}`} className="text-xl">
            {hour}
          </h2>
        )) || <h2 className="text-xl">Não disponível</h2>}

        <h1 className="text-2xl mt-2">Horários disponíveis na terça:</h1>
        {available_hours?.tuesday?.map((hour) => (
          <h2 key={`tuesday-${hour}`} className="text-xl">
            {hour}
          </h2>
        )) || <h2 className="text-xl">Não disponível</h2>}

        <h1 className="text-2xl mt-2">Horários disponíveis na quarta:</h1>
        {available_hours?.wednesday?.map((hour) => (
          <h2 key={`wednesday-${hour}`} className="text-xl">
            {hour}
          </h2>
        )) || <h2 className="text-xl">Não disponível</h2>}

        <h1 className="text-2xl mt-2">Horários disponíveis na quinta:</h1>
        {available_hours?.thursday?.map((hour) => (
          <h2 key={`thursday-${hour}`} className="text-xl">
            {hour}
          </h2>
        )) || <h2 className="text-xl">Não disponível</h2>}

        <h1 className="text-2xl mt-2">Horários disponíveis na sexta:</h1>
        {available_hours?.friday?.map((hour) => (
          <h2 key={`friday-${hour}`} className="text-xl">
            {hour}
          </h2>
        )) || <h2 className="text-xl">Não disponível</h2>}
        <h1 className="text-2xl mt-2">Agende uma aula:</h1>
        <DatePicker
          showTimeSelect
          dateFormat="MMMM d, yyyy h:mm aa"
          selected={date}
          onChange={handleDateSelect} //when day is clicked
          minDate={new Date()}
          maxDate={new Date().setMonth(new Date().getMonth() + 1)}
          includeDates={validHours}
          includeTimes={validHours}
          timeIntervals={60}
          inline
        />
        <div className="my-4">
          <h1>Você quer aula de qual matéria??</h1>
          {courses.map((course) => (
            <div
              key={course}
              className="bg-red-400 cursor-pointer mt-2"
              onClick={() => setCourse(course)}
            >
              {course}
            </div>
          ))}
          <h1>E em qual localização?</h1>
          {available_locations.map((location) => (
            <div
              key={location}
              className="bg-green-400 cursor-pointer mt-2"
              onClick={() => setLocation(location)}
            >
              {location}
            </div>
          ))}
          {location === 'remoto' && (
            <>
              <h1 className="mt-2">Favor colocar o link da reunião aqui:</h1>
              <input
                type="text"
                value={appointmentLink}
                onChange={(e) => setAppointmentLink(e.target.value)}
                placeholder="https://skype.com/link_reuniao"
                className="bg-pink-200 my-2"
              />
              <br />
            </>
          )}
          <button
            className="btn-blue my-10"
            onClick={handleSubmit}
            type="submit"
          >
            Confirmar agendamento
          </button>
        </div>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const _id = context.query._id as string;

  const response = await api<Teacher>(`/api/teacher/${_id}`);

  const teacher = response.data;

  return {
    props: teacher,
  };
};
