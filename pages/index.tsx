import { NextPage } from 'next';

import Nav from '../components/nav';

const IndexPage: NextPage = () => {
  return (
    <div>
      <Nav />
      <div className="py-10">
        <h1 className="text-5xl text-center text-accent-1">
          Next.js + Tailwind CSS
        </h1>
      </div>
    </div>
  );
};

export default IndexPage;
