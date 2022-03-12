import type { NextPage } from 'next'
import Head from 'next/head'
import { useState, Fragment } from 'react'
import * as Yup from 'yup'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import classNames from 'classnames'
import { Dialog, Transition } from '@headlessui/react'
import InputMask from 'react-input-mask'

import Contact from '../../types/Contact'
import api from '../../services/api'

const Home: NextPage = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [isSending, setIsSending] = useState<boolean>(false)

  const schema = Yup
    .object()
    .shape({
      name: Yup.string().required('Digite seu nome'),
      email: Yup.string().email('Digite um e-mail válido').required('Digite seu email'),
      tel: Yup.string().matches(/(\([0-9]+)\) ([9]) \d{4}-\d{4}/, 'Número de telefone inválido').required('Digite um número de telefone'),
      message: Yup.string().min(6, 'Envie uma mensagem com no mínimo 6 caracteres'),
    })
    .required()

  const { register, handleSubmit, formState, reset } = useForm({
    resolver: yupResolver(schema),
  });

  const { errors } = formState;

  const closeModal = () => setIsOpen(false);

  const doContact = (data: Contact | any) => {
    setIsSending(true);
    api.post('/contact', data)
      .then((_) => {
        setIsOpen(true);
        setIsSending(false);
        reset();
      })
      .catch((err) => {
        alert('Erro interno!');
        setIsSending(false);
      })
  }

  return (
    <div className="bg-gradient-to-tr from-[#19294A] to-black/40 w-full h-full fixed inset-0 overflow-auto">
      <Head>
        <title>onearth - climate tech</title>
      </Head>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={closeModal}
        >
          <div className="min-h-screen px-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur" />
            </Transition.Child>

            <span
              className="inline-block h-screen align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="inline-block w-full max-w-sm p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >Obrigado!</Dialog.Title>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">Entraremos contato o mais breve possível. </p>
                </div>

                <div className="mt-4">
                  <button
                    type="button"
                    className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-[#179BD9] border border-transparent rounded-md hover:bg-[#1D8ABE] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#179BD9]"
                    onClick={closeModal}
                  >
                    Ok, entendido!
                  </button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>

      <main className="container h-screen flex flex-col">
        <img className="mt-24 flex-grow-0" width="217.6" src="/img/logo.svg" alt="Logo Onearth"/>

        <section className="flex mt-14 flex-col xl:mt-0 xl:flex-row xl:justify-between xl:items-center xl:flex-grow">
          <div className="text-white">
            <div className="xl:text-5xl text-4xl font-bold max-w-[528px]">
              Ooops!<br/>
              Esta página encontra-se em construção
            </div>

            <div className="mt-6 max-w-[416px]">Desculpe-nos pelo inconveniente. Esta página encontra-se em construção e em breve estará disponível para acesso. Em caso de dúvidas entre em contato.</div>
          </div>

          <form className="xl:my-0 xl:max-w-[528px] xl:p-10 p-8 my-10 bg-black bg-opacity-80 backdrop-blur rounded-2xl w-full text-white flex flex-col items-start" onSubmit={handleSubmit(doContact)} autoComplete="off">
            <div className="text-2xl font-light">Entre em <b className="font-bold">contato</b></div>

            <div className="lg:flex-row lg:justify-between mt-6 flex flex-col gap-6 w-full">
              <div className="flex-grow">
                <div className="label">Nome</div>
                <input className={classNames('field', {'error': errors.name})} autoFocus={true} {...register('name')} />
                {errors.name && <div className="field-error">{errors.name.message}</div>}
              </div>

              <div className="flex-grow">
                <div className="label">Telefone</div>
                <InputMask mask="(99) 9 9999-9999" className={classNames('field', {'error': errors.tel})}  {...register('tel')} />
                {errors.tel && <div className="field-error">{errors.tel.message}</div>}
              </div>
            </div>

            <div className="mt-6 w-full">
              <div className="label">Endereço de e-mail</div>
              <input className={classNames('field', {'error': errors.email})} {...register('email')} />
              {errors.email && <div className="field-error">{errors.email.message}</div>}
            </div>

            <div className="mt-6 w-full">
              <div className="label">Mensagem <span className="text-sm font-normal">(opcional)</span></div>
              <textarea className={classNames('field', {'error': errors.message})} rows={3} {...register('message')}></textarea>
              {errors.message && <div className="field-error">{errors.message.message}</div>}
            </div>

            <button disabled={isSending} type="submit" className="button mt-6 self-end flex items-center">
              {isSending ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none"
                       viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Enviando...
                </>
              ) : 'Enviar mensagem'}
            </button>
          </form>
        </section>

        <footer className="lg:justify-between xl:flex-row gap-4 flex flex-col text-white text-sm py-8 border-t border-white border-opacity-[0.16]">
          <div><b className="font-bold">Onearth 2022</b> © Todos os direitos reservados.</div>
          <div className="lg:justify-between lg:justify-end md:flex-row xl:gap-20 flex-col flex gap-4">
            <div><b className="font-bold">Telefone</b>: (31) 3290-4300</div>
            <div><b className="font-bold">E-mail</b>: onearth@onearth.com.br</div>
            <div><b className="font-bold">SAC</b>: sac@onearth.com.br</div>
          </div>
        </footer>
      </main>
    </div>
  )
}

export default Home
