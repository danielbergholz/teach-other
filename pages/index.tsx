import { NextPage } from 'next';
import Image from 'next/image';

import Nav from '../components/nav';
import Footer from '../components/footer';

const IndexPage: NextPage = () => {
  return (
    <>
      <div className="text-center bg-home">
        <Nav />
        <div className="flex flex-row space-x-64 w-1/3 m-auto text-white">
          <h1 className="text-3xl my-16 bg-gray-800 rounded-lg p-4 ml-64">
            Você é universitário, e está com dificuldade em alguma disciplina?
            Encontre um outro estudante da sua universidade para ser seu
            professor! Caso você tenha facilidade em certa disciplina da
            universidade que você cursa, ajude outro aluno se disponibilizando
            como professor!
          </h1>
        </div>
      </div>
      <div className="text-center">
        <Image
          src="/logo.jpg"
          alt="Logo Teach Other"
          width={485}
          height={485}
        />
        <p className="text-3xl w-2/3 m-auto">
          Somos facilitadores do ensino entre estudantes universitários,
          possibilitando a união entre alunos para compartilhar conhecimento.
        </p>
      </div>

      <div className="flex flex-row space-x-48 w-5/6 m-auto mt-32">
        <section className="w-2/3">
          <h1 className="text-2xl font-bold">Bem vindo</h1>
          <p className="mt-8">
            Nosso site foi criado com o intuito de facilitar a vida de alunos
            que queiram se aplicar mais em seus estudos e também a dos
            professores que queiram ensinar com mais flexibilidade e liberdade.
          </p>
        </section>

        <aside className="w-1/3 bg-nav p-4 rounded text-white">
          Com ferramentas para marcar aulas e agendar horários sempre buscando o
          modo mais facil para o usuário se programar e melhor utilizar seu
          tempo e foco para estudos. Com a nossa ajuda você vê professores que
          podem atender no horário em que você tenha disponibilidade, caso não
          encontre nenhum com atendimento quando precisa, pode agendar um
          horário com o próprio tutor.
        </aside>
      </div>

      <div className="flex flex-row space-x-48 w-5/6 m-auto my-32">
        <aside className="w-1/3 bg-nav p-4 rounded text-white">
          Cansado de querer se aprofundar mais nos seus estudos, mas não
          consegue achar tempo na sua agenda ou professores disponíveis para
          ensinar? Nosso serviço é perfeito para você.
        </aside>

        <section className="w-2/3">
          <p className="mt-8">
            Junte-se a nós e ajude a criar um ambiente de estudo personalizado e
            particular. Cadastre-se no site, escolha suas matérias que tenha
            interesse de estudo e depois navegue pela lista de professores
            disponíveis e escolha aquele que mais te agrada ou se adeque aos
            seus horários e rotina. Já você que é professor, pode ensinar em
            horários, dias e locais que se sinta mais confortável e disponível.
            Tendo seu trabalho monetizado com a cotação do próprio site ou com a
            venda de seus materiais.
          </p>
        </section>
      </div>
      <div className="mb-16 text-center">
        <Image
          src="/mulher_mulher2.jpg"
          alt="Mulheres felizes"
          width={600}
          height={426}
        />
      </div>
      <Footer />
    </>
  );
};

export default IndexPage;
