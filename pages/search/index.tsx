import { useState, useCallback } from 'react';
import { NextPage } from 'next';
import Link from 'next/link';
import { signIn, signOut, useSession } from 'next-auth/client';

import api from '../../utils/api';
import Nav from '../../components/nav';

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

const SearchPage: NextPage = () => {
  const [data, setData] = useState<Teacher[]>([]);
  const [session, loading] = useSession();

  const handleSearch = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const textInput = document.getElementsByTagName('input')[0].value;

      const response = await api<Teacher[]>(`/api/search/${textInput}`);

      const teachers = response.data;

      setData(teachers);
    },
    [setData]
  );

  return (
    <div>
      <Nav />

      {!session && (
        <div className="text-3xl">
          Not signed in <br />
          <button onClick={(): Promise<void> => signIn('auth0')}>
            Sign in
          </button>
        </div>
      )}
      {session && (
        <>
          <h1>Bem vindo a página SEARCH</h1>
          <div className="text-3xl">
            Signed in as {session.user.email} <br />
            <button onClick={(): Promise<void> => signOut()}>Sign out</button>
          </div>
          <form onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Nome da matéria"
              className="bg-pink-200"
            />
            <button type="submit" className="bg-blue-200">
              Pesquisar
            </button>
          </form>
          {data.length !== 0 &&
            data.map((teacher) => (
              <Link href={`/search/${teacher._id}`} key={teacher._id}>
                <a>
                  <h1 className="text-2xl">{teacher.name}</h1>
                </a>
              </Link>
            ))}
        </>
      )}
      {loading && (
        <div className="text-5xl">
          <h1>CARREGANDO</h1>
        </div>
      )}
    </div>
  );
};

export default SearchPage;
