import axios from 'axios';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';

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

export default function teacherProfilePage({
  name,
  email,
  _id,
}: Teacher): JSX.Element {
  return (
    <>
      <h1 className="text-3xl">Página do professor {name}</h1>
      <h1 className="text-2xl">E-mail: {email}</h1>
      <h1 className="text-2xl">ID: {_id}</h1>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const _id = context.query._id as string;

  const response = await axios.get<Teacher>(
    `http://localhost:3000/api/teacher/${_id}`
  );

  const teacher = response.data;

  return {
    props: teacher,
  };
};
