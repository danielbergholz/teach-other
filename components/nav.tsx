import { NextComponentType } from 'next';
import Link from 'next/link';

const Nav: NextComponentType = () => {
  return (
    <nav>
      <ul className="flex justify-between items-center p-8">
        <li>
          <Link href="/">
            <a className="text-blue-500 no-underline">TEACH OTHER</a>
          </Link>
        </li>
        <ul className="flex justify-between items-center space-x-4">
          <li>
            <Link href="/profile">
              <a className="btn-blue no-underline">Profile</a>
            </Link>
          </li>
          <li>
            <Link href="/search">
              <a className="btn-blue no-underline">Search</a>
            </Link>
          </li>
        </ul>
      </ul>
    </nav>
  );
};

export default Nav;
