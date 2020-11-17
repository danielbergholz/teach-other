import { useState, useCallback } from 'react';
import useSWR from 'swr';
import { NextPage } from 'next';
import Image from 'next/image';
import Link from 'next/link';

import api from '../../utils/api';
import Nav from '../../components/nav';
import Footer from '../../components/footer';

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
  const [textInput, setTextInput] = useState('');

  const { data, error } = useSWR(
    textInput !== '' ? `/api/search/${textInput}` : null,
    api
  );

  const handleSearch = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      setTextInput(document.getElementsByTagName('input')[0].value);
    },
    [setTextInput]
  );

  return (
    <div>
      <Nav />

      <div className="text-center">
        <form onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Digite a disciplina que você procura..."
            className="text-2xl border-2 border-box w-3/12 m-auto text-center my-12"
          />
          <button type="submit" className="hidden">
            Pesquisar
          </button>
        </form>
        {data &&
          data.data.map((teacher) => (
            <Link href={`/search/${teacher._id}`} key={teacher._id}>
              <a>
                <h1 className="text-2xl border-2 border-box w-1/2 m-auto mt-4 py-2">
                  {teacher.name}
                </h1>
              </a>
            </Link>
          ))}

        {error && (
          <div className="text-xl">
            <h1>Erro na busca pela matéria {textInput}</h1>
          </div>
        )}
      </div>

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

export default SearchPage;
