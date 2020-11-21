import { useState, useEffect, useMemo } from 'react';
import { NextPage } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import axios from 'axios';
import useSWR from 'swr';
import { useSession } from 'next-auth/client';

import api from '../utils/api';
import Nav from '../components/nav';
import Footer from '../components/footer';

const portugueseMonths = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
];

const ProfilePage: NextPage = () => {
  const [showStudent, setShowStudent] = useState(false);
  const [showTeacher, setShowTeacher] = useState(false);
  const [isTeacher, setIsTeacher] = useState(null);
  const [name, setName] = useState(null);
  const [email, setEmail] = useState(null);
  const [cellphone, setCellphone] = useState(null);
  const [courses, setCourses] = useState(null);
  const [availableLocations, setAvailableLocations] = useState(null);
  const [monday, setMonday] = useState(null);
  const [tuesday, setTuesday] = useState(null);
  const [wednesday, setWednesday] = useState(null);
  const [thursday, setThursday] = useState(null);
  const [friday, setFriday] = useState(null);
  const [errorCount, setErrorCount] = useState(0);
  const [loggedUserWithoutAccount, setLoggedUserWithoutAccount] = useState(
    false
  );

  const [session, loading] = useSession();

  const { data, error } = useSWR(
    !loggedUserWithoutAccount && !loading
      ? `/api/user/${session?.user.email}`
      : null,
    api
  );

  const studentAppointments = useMemo(
    () =>
      data?.data?.appointments?.filter(
        (appointment) => appointment.teacher_email !== session.user.email
      ),
    [data]
  );

  const teacherAppointments = useMemo(
    () =>
      data?.data?.appointments?.filter(
        (appointment) => appointment.teacher_email === session.user.email
      ),
    [data]
  );

  useEffect(() => {
    setErrorCount((prevstate) => prevstate + 1);
    if (error && errorCount === 1) setLoggedUserWithoutAccount(true);
  }, [error, setErrorCount]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const available_hours = {
      monday: monday
        ?.split(',')
        .map((item) => item.trim())
        .map((item) => parseInt(item)),
      tuesday: tuesday
        ?.split(',')
        .map((item) => item.trim())
        .map((item) => parseInt(item)),
      wednesday: wednesday
        ?.split(',')
        .map((item) => item.trim())
        .map((item) => parseInt(item)),
      thursday: thursday
        ?.split(',')
        .map((item) => item.trim())
        .map((item) => parseInt(item)),
      friday: friday
        ?.split(',')
        .map((item) => item.trim())
        .map((item) => parseInt(item)),
    };

    for (const dayOfTheWeek in available_hours) {
      if (!available_hours[dayOfTheWeek]) delete available_hours[dayOfTheWeek];
    }

    const data = {
      name,
      email,
      cellphone,
      teacher: isTeacher,
      courses: courses?.split(',').map((item) => item.trim()),
      available_locations: availableLocations
        ?.split(',')
        .map((item) => item.trim()),
      available_hours,
    };

    try {
      await axios.post(`${process.env.NEXT_PUBLIC_URL}/api/user`, data);
      setLoggedUserWithoutAccount(false);
    } catch (err) {
      alert(
        err?.response?.data?.error || 'Houve um problema na criação da conta'
      );
    }
  };

  return (
    <div>
      <Nav />
      {!session && (
        <div className="text-3xl">
          Favor fazer login para acessar essa página <br />
        </div>
      )}
      {session && data && (
        <>
          <div className="mt-4 ml-4 flex flex-row items-center">
            <Image
              src="/coin.png"
              alt="Logo Teach Other"
              width={50}
              height={50}
            />
            <span className="ml-3 text-3xl">{data.data.coins}</span>
          </div>
          <p className="text-3xl border-2 border-box w-3/12 m-auto text-center mt-12">
            Olá, {data.data.name}
          </p>
          <p className="text-3xl w-3/12 m-auto text-center mt-2">
            E-mail: {data.data.email}
          </p>
          <p className="text-3xl w-3/12 m-auto text-center mt-2">
            Telefone: {data.data.cellphone}
          </p>
          <div className="w-5/6 m-auto mt-12">
            <button onClick={() => setShowStudent((prevState) => !prevState)}>
              <span className="font-bold text-2xl mr-2">Você, aluno</span>
              <span>Show/Hide</span>
            </button>
          </div>
          {showStudent && (
            <div className="text-2xl border-2 border-box w-4/6 m-auto mt-4 p-4">
              <p className="mb-4">Seus agendamentos:</p>
              <div>
                {studentAppointments.map((appointment) => (
                  <div key={appointment.date} className="mb-2">
                    <p>{appointment.course}:</p>
                    <div className="flex flex-row space-x-10">
                      <div className="border-2 border-box w-1/3 text-center cursor-pointer">
                        <Link href={`/search/${appointment.teacher_id}`}>
                          <a>
                            <p>{appointment.teacher_name}</p>
                          </a>
                        </Link>
                      </div>
                      <div className="border-2 border-box w-1/3 text-center">
                        <p>
                          {`${new Date(appointment.date).getDate()} de ${
                            portugueseMonths[
                              new Date(appointment.date).getMonth()
                            ]
                          } de ${new Date(
                            appointment.date
                          ).getFullYear()} ${new Date(
                            appointment.date
                          ).getHours()}:00`}
                        </p>
                      </div>
                      <div
                        className="border-2 border-box w-1/3 text-center"
                        onClick={() => {
                          appointment.appointment_link &&
                            alert(
                              'Link da reunião: ' + appointment.appointment_link
                            );
                        }}
                      >
                        <p
                          className={
                            appointment.appointment_link && 'cursor-pointer'
                          }
                        >
                          {appointment.location}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="w-5/6 m-auto mt-12">
            <button onClick={() => setShowTeacher((prevState) => !prevState)}>
              <span className="font-bold text-2xl mr-2">Você, professor</span>
              <span>Show/Hide</span>
            </button>
          </div>
          {showTeacher && (
            <>
              <div className="text-2xl border-2 border-box w-4/6 m-auto mt-4 p-4">
                <p className="mb-4">Seus agendamentos:</p>
                <div>
                  {teacherAppointments.map((appointment) => (
                    <div key={appointment.date} className="mb-2">
                      <p>{appointment.course}:</p>
                      <div className="flex flex-row space-x-10">
                        <div className="border-2 border-box w-1/3 text-center cursor-pointer">
                          <Link href={`/search/${appointment.teacher_id}`}>
                            <a>
                              <p>{appointment.teacher_name}</p>
                            </a>
                          </Link>
                        </div>
                        <div className="border-2 border-box w-1/3 text-center">
                          <p>
                            {`${new Date(appointment.date).getDate()} de ${
                              portugueseMonths[
                                new Date(appointment.date).getMonth()
                              ]
                            } de ${new Date(
                              appointment.date
                            ).getFullYear()} ${new Date(
                              appointment.date
                            ).getHours()}:00`}
                          </p>
                        </div>
                        <div
                          className="border-2 border-box w-1/3 text-center"
                          onClick={() => {
                            appointment.appointment_link &&
                              alert(
                                'Link da reunião: ' +
                                  appointment.appointment_link
                              );
                          }}
                        >
                          <p
                            className={
                              appointment.appointment_link && 'cursor-pointer'
                            }
                          >
                            {appointment.location}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="w-5/6 m-auto mt-12">
                <span className="font-bold text-2xl mr-2">
                  Sua disponibilidade
                </span>
              </div>
              <div className="text-2xl border-2 border-box w-4/6 m-auto mt-4 p-4">
                <div>
                  <div className="mb-2">
                    <p>Disciplinas:</p>
                    <div className="flex flex-row space-x-10">
                      <div className="border-2 border-box w-full text-center">
                        <p>{data.data.courses.join(', ')}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mb-2">
                    <p>Locais:</p>
                    <div className="flex flex-row space-x-10">
                      <div className="border-2 border-box w-full text-center">
                        <p>{data.data.available_locations.join(', ')}</p>
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
                          {data.data.available_hours?.monday?.join(', ') ||
                            'Não disponível'}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-row space-x-10 mt-4">
                      <div className="border-2 border-box w-1/2 text-center">
                        <p>Terça</p>
                      </div>
                      <div className="border-2 border-box w-1/2 text-center">
                        <p>
                          {data.data.available_hours?.tuesday?.join(', ') ||
                            'Não disponível'}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-row space-x-10 mt-4">
                      <div className="border-2 border-box w-1/2 text-center">
                        <p>Quarta</p>
                      </div>
                      <div className="border-2 border-box w-1/2 text-center">
                        <p>
                          {data.data.available_hours?.wednesday?.join(', ') ||
                            'Não disponível'}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-row space-x-10 mt-4">
                      <div className="border-2 border-box w-1/2 text-center">
                        <p>Quinta</p>
                      </div>
                      <div className="border-2 border-box w-1/2 text-center">
                        <p>
                          {data.data.available_hours?.thursday?.join(', ') ||
                            'Não disponível'}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-row space-x-10 mt-4">
                      <div className="border-2 border-box w-1/2 text-center">
                        <p>Sexta</p>
                      </div>
                      <div className="border-2 border-box w-1/2 text-center">
                        <p>
                          {data.data.available_hours?.friday?.join(', ') ||
                            'Não disponível'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </>
      )}
      {loggedUserWithoutAccount && session && (
        <div className="flex flex-col items-center">
          <h1 className="text-3xl mt-20">Seja bem vindo ao Teach Other!</h1>
          <h1 className="text-2xl">
            Por favor finalize a criação do seu perfil:
          </h1>
          <form onSubmit={handleSubmit} className="flex flex-col items-center">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nome completo"
              className="border-2 border-box w-full text-center my-4"
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="E-mail"
              className="border-2 border-box w-full text-center my-4"
            />
            <input
              type="cellphone"
              value={cellphone}
              onChange={(e) => setCellphone(e.target.value)}
              placeholder="Telefone"
              className="border-2 border-box w-full text-center my-4"
            />
            <div className="my-4">
              <h1>Você deseja ser professor?</h1>
              <div
                className={`border-2 border-box cursor-pointer my-2 text-center ${
                  isTeacher && 'bg-box text-white'
                }`}
                onClick={() => setIsTeacher(true)}
              >
                Sim
              </div>
              <div
                className={`border-2 border-box cursor-pointer text-center ${
                  !isTeacher && 'bg-box text-white'
                }`}
                onClick={() => setIsTeacher(false)}
              >
                Não
              </div>
            </div>
            {isTeacher && (
              <>
                <h1>Escreva as suas matérias (separadas por vírgula)</h1>
                <input
                  type="text"
                  value={courses}
                  onChange={(e) => setCourses(e.target.value)}
                  placeholder="Matérias que você vai lecionar"
                  className="border-2 border-box my-4"
                />
                <h1>
                  Escreva em quais locais você pode dar aula (separadas por
                  vírgula)
                </h1>
                <input
                  type="text"
                  value={availableLocations}
                  onChange={(e) => setAvailableLocations(e.target.value)}
                  placeholder="Ex: Faculdade UnB, Remoto..."
                  className="border-2 border-box my-4"
                />
                <h1>
                  Escreva os horários você pode dar aula (separadas por vírgula)
                </h1>
                <h2>Segunda:</h2>
                <input
                  type="text"
                  value={monday}
                  onChange={(e) => setMonday(e.target.value)}
                  placeholder="Ex: 8, 10, 14, 16..."
                  className="border-2 border-box my-4"
                />
                <h2>Terça:</h2>
                <input
                  type="text"
                  value={tuesday}
                  onChange={(e) => setTuesday(e.target.value)}
                  placeholder="Ex: 8, 10, 14, 16..."
                  className="border-2 border-box my-4"
                />
                <h2>Quarta:</h2>
                <input
                  type="text"
                  value={wednesday}
                  onChange={(e) => setWednesday(e.target.value)}
                  placeholder="Ex: 8, 10, 14, 16..."
                  className="border-2 border-box my-4"
                />
                <h2>Quinta:</h2>
                <input
                  type="text"
                  value={thursday}
                  onChange={(e) => setThursday(e.target.value)}
                  placeholder="Ex: 8, 10, 14, 16..."
                  className="border-2 border-box my-4"
                />
                <h2>Sexta:</h2>
                <input
                  type="text"
                  value={friday}
                  onChange={(e) => setFriday(e.target.value)}
                  placeholder="Ex: 8, 10, 14, 16..."
                  className="border-2 border-box my-4"
                />
              </>
            )}
            {isTeacher === false && (
              <h1 className="my-2">Beleza! Seu perfil pode ser criado</h1>
            )}
            <button
              className="text-xl bg-box text-center text-white mt-8 p-2"
              type="submit"
            >
              Criar perfil
            </button>
          </form>
        </div>
      )}
      {loading && (
        <div className="text-5xl">
          <h1>CARREGANDO</h1>
        </div>
      )}

      <div className="text-center mb-10">
        <Image
          src="/logo.jpg"
          alt="Logo Teach Other"
          width={485}
          height={485}
        />
      </div>
      <Footer />
    </div>
  );
};

export default ProfilePage;
