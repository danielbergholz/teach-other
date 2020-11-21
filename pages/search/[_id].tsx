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
  cellphone,
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
      await axios.post(process.env.NEXT_PUBLIC_URL + '/api/appointment', data);
      alert('Aula marcada com sucesso!');
    } catch (err) {
      alert(err?.response?.data?.error || err);
    }
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
        <p className="text-3xl border-2 border-box w-3/12 m-auto text-center mt-12">
          {name}
        </p>
        <h1 className="text-2xl">E-mail: {email}</h1>
        <h1 className="text-2xl">Telefone: {cellphone}</h1>

        <div className="text-2xl border-2 border-box w-4/6 m-auto mt-4 p-4">
          <div>
            <div className="mb-2">
              <p>Disciplinas:</p>
              <div className="flex flex-row space-x-10">
                <div className="border-2 border-box w-full text-center">
                  <p>{courses.join(', ')}</p>
                </div>
              </div>
            </div>

            <div className="mb-2">
              <p>Locais:</p>
              <div className="flex flex-row space-x-10">
                <div className="border-2 border-box w-full text-center">
                  <p>{available_locations.join(', ')}</p>
                </div>
              </div>
            </div>

            <div className="mb-2">
              <p>Horários:</p>
              <div className="flex flex-row space-x-10">
                <div className="border-2 border-box w-1/2 text-center">
                  <p>Segunda</p>
                </div>
                <div className="border-2 border-box w-1/2 text-center">
                  <p>
                    {available_hours?.monday?.join(', ') || 'Não disponível'}
                  </p>
                </div>
              </div>

              <div className="flex flex-row space-x-10 mt-4">
                <div className="border-2 border-box w-1/2 text-center">
                  <p>Terça</p>
                </div>
                <div className="border-2 border-box w-1/2 text-center">
                  <p>
                    {available_hours?.tuesday?.join(', ') || 'Não disponível'}
                  </p>
                </div>
              </div>

              <div className="flex flex-row space-x-10 mt-4">
                <div className="border-2 border-box w-1/2 text-center">
                  <p>Quarta</p>
                </div>
                <div className="border-2 border-box w-1/2 text-center">
                  <p>
                    {available_hours?.wednesday?.join(', ') || 'Não disponível'}
                  </p>
                </div>
              </div>

              <div className="flex flex-row space-x-10 mt-4">
                <div className="border-2 border-box w-1/2 text-center">
                  <p>Quinta</p>
                </div>
                <div className="border-2 border-box w-1/2 text-center">
                  <p>
                    {available_hours?.thursday?.join(', ') || 'Não disponível'}
                  </p>
                </div>
              </div>

              <div className="flex flex-row space-x-10 mt-4">
                <div className="border-2 border-box w-1/2 text-center">
                  <p>Sexta</p>
                </div>
                <div className="border-2 border-box w-1/2 text-center">
                  <p>
                    {available_hours?.friday?.join(', ') || 'Não disponível'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        {session ? (
          <>
            <h1 className="text-2xl mt-6">Agende uma aula:</h1>
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
              <h1 className="text-2xl text-center">
                Você quer aula de qual matéria??
              </h1>
              {courses.map((courseMap) => (
                <div
                  key={courseMap}
                  className={`border-2 border-box w-1/2 text-center mt-2 cursor-pointer m-auto ${
                    course === courseMap && 'bg-box text-white'
                  }`}
                  onClick={() => setCourse(courseMap)}
                >
                  {courseMap}
                </div>
              ))}
              <h1 className="text-2xl text-center">E em qual localização?</h1>
              {available_locations.map((locationMap) => (
                <div
                  key={locationMap}
                  className={`border-2 border-box w-1/2 text-center mt-2 cursor-pointer m-auto ${
                    location === locationMap && 'bg-box text-white'
                  }`}
                  onClick={() => setLocation(locationMap)}
                >
                  {locationMap}
                </div>
              ))}
              {location === 'remoto' && (
                <>
                  <h1 className="mt-2 text-2xl text-center">
                    Favor colocar o link da reunião aqui:
                  </h1>
                  <div className="mt-2 text-center">
                    <input
                      type="text"
                      value={appointmentLink}
                      onChange={(e) => setAppointmentLink(e.target.value)}
                      placeholder="Ex: skype.com/link"
                      className="border-2 border-box w-1/2"
                    />
                  </div>
                  <br />
                </>
              )}
              <div className="text-center">
                <button
                  className="text-xl bg-box text-center text-white mt-8 p-2"
                  onClick={handleSubmit}
                  type="submit"
                >
                  Confirmar agendamento
                </button>
              </div>
            </div>
          </>
        ) : (
          <h1 className="text-xl bg-box text-center text-white mt-8 p-2">
            Faça login para agendar uma aula com {name}
          </h1>
        )}
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
