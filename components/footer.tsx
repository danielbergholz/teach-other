import { NextComponentType } from 'next';
import Image from 'next/image';

const Footer: NextComponentType = () => {
  return (
    <div className="bg-footer flex flex-row items-center text-white text-xl justify-center">
      <Image src="/logo2.png" alt="Logo Teach Other" width={100} height={100} />
      <h2 className="ml-10">
        Faculdade de Tecnologia, UnB, Asa Norte, Brasília - DF
      </h2>
    </div>
  );
};

export default Footer;
