import { useState, useEffect } from 'react';
import { NextPage } from 'next';
import axios from 'axios';
import useSWR from 'swr';
import { signIn, signOut, useSession } from 'next-auth/client';

import api from '../utils/api';
import Nav from '../components/nav';

const ProfilePage: NextPage = () => {
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
      alert(err.response.data.error);
    }
  };

  return (
    <div>
      <Nav />
      {!session && (
        <div className="text-3xl">
          Favor fazer login para acessar essa página <br />
          <button onClick={(): Promise<void> => signIn('auth0')}>
            Sign in
          </button>
        </div>
      )}
      {session && data && (
        <>
          <h1>Bem vindo a página PROFILE</h1>
          <div className="text-3xl">
            Signed in as {session.user.email} <br />
            <button onClick={(): Promise<void> => signOut()}>Sign out</button>
          </div>
          <h1 className="text-3xl">{data.data.name}</h1>
          <h1 className="text-3xl">{data.data.coins} moedas</h1>
        </>
      )}
      {loggedUserWithoutAccount && session && (
        <div className="flex flex-col items-center">
          <h1 className="text-3xl">Seja bem vindo ao Teach Other!</h1>
          <h1 className="text-2xl">
            Por favor finalize a criação do seu perfil:
          </h1>
          <form onSubmit={handleSubmit} className="flex flex-col items-center">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full name"
              className="bg-pink-200 my-4"
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="E-mail"
              className="bg-pink-200 my-4"
            />
            <input
              type="cellphone"
              value={cellphone}
              onChange={(e) => setCellphone(e.target.value)}
              placeholder="Cellphone"
              className="bg-pink-200 my-4"
            />
            <div className="my-4">
              <h1>Você deseja ser professor?</h1>
              <div
                className="bg-green-400 cursor-pointer my-2"
                onClick={() => setIsTeacher(true)}
              >
                Sim
              </div>
              <div
                className="bg-red-400 cursor-pointer"
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
                  className="bg-pink-200 my-4"
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
                  className="bg-pink-200 my-4"
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
                  className="bg-pink-200 my-4"
                />
                <h2>Terça:</h2>
                <input
                  type="text"
                  value={tuesday}
                  onChange={(e) => setTuesday(e.target.value)}
                  placeholder="Ex: 8, 10, 14, 16..."
                  className="bg-pink-200 my-4"
                />
                <h2>Quarta:</h2>
                <input
                  type="text"
                  value={wednesday}
                  onChange={(e) => setWednesday(e.target.value)}
                  placeholder="Ex: 8, 10, 14, 16..."
                  className="bg-pink-200 my-4"
                />
                <h2>Quinta:</h2>
                <input
                  type="text"
                  value={thursday}
                  onChange={(e) => setThursday(e.target.value)}
                  placeholder="Ex: 8, 10, 14, 16..."
                  className="bg-pink-200 my-4"
                />
                <h2>Sexta:</h2>
                <input
                  type="text"
                  value={friday}
                  onChange={(e) => setFriday(e.target.value)}
                  placeholder="Ex: 8, 10, 14, 16..."
                  className="bg-pink-200 my-4"
                />
              </>
            )}
            {isTeacher === false && (
              <h1 className="my-2">Beleza! Seu perfil pode ser criado</h1>
            )}
            <button className="btn-blue mb-10" type="submit">
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
    </div>
  );
};

export default ProfilePage;
