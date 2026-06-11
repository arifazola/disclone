import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import ServerIcon from './components/ServerIcon'
import ButtonPrimary from './components/ButtonPrimary'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div id='container' className='min-h-dvh flex bg-slate-200'>
        <div id='server-list' className='w-20 h-dvh bg-slate-200 flex justify-center pt-10'>
          <div className='w-12 h-full flex flex-col gap-5'>
            <div className='w-full h-10'>
              <ServerIcon />
            </div>

            <div className='w-full h-10'>
              <ServerIcon />
            </div>
          </div>
        </div>
        <div id='main' className='w-full pt-10'>
          <div className='rounded-lg border border-slate-300 flex'>
            <div id='channel-list' className='w-1/4 h-dvh flex justify-center py-5'>
              <div className='w-11/12 h-full flex flex-col items-center'>
                <div className='w-full h-10 bg-slate-300 flex items-center justify-center rounded-lg'>
                  <span className='font-semibold'>Find or start a conversation</span>
                </div>

                <div className='w-full mt-7 flex flex-col gap-3'>
                  <div className='w-full h-10 bg-slate-300 flex items-center justify-center rounded-lg'>
                    <span className='font-semibold'>Friends</span>
                  </div>
                  <div className='w-full h-10 flex items-center justify-center rounded-lg'>
                    <span className='font-semibold'>Message Request</span>
                  </div>
                  <div className='w-full h-10 flex items-center justify-center rounded-lg'>
                    <span className='font-semibold'>Nitro</span>
                  </div>
                  <div className='w-full h-10 flex items-center justify-center rounded-lg'>
                    <span className='font-semibold'>Shop</span>
                  </div>
                  <div className='w-full h-10 flex items-center justify-center rounded-lg'>
                    <span className='font-semibold'>Quests</span>
                  </div>
                </div>

                <div className='w-full mt-7 flex flex-col gap-3'>
                  <div className='w-full flex justify-between'>
                    <span>Direct Messages</span>
                    <span>➕</span>
                  </div>
                  <div className='w-full h-10 flex items-center justify-center rounded-lg'>
                    <div className='w-full h-full flex items-center gap-5'>
                      <div id='profile-picture' className='w-10 h-10 rounded-full bg-blue-500'>

                      </div>
                      <span className='text-lg'>Friend 1</span>
                    </div>
                  </div>
                  <div className='w-full h-10 flex items-center justify-center rounded-lg'>
                    <div className='w-full h-full flex items-center gap-5'>
                      <div id='profile-picture' className='w-10 h-10 rounded-full bg-blue-500'>

                      </div>
                      <span className='text-lg'>Friend 2</span>
                    </div>
                  </div>
                  <div className='w-full h-10 flex items-center justify-center rounded-lg'>
                    <div className='w-full h-full flex items-center gap-5'>
                      <div id='profile-picture' className='w-10 h-10 rounded-full bg-blue-500'>

                      </div>
                      <span className='text-lg'>Friend 3</span>
                    </div>
                  </div>
                  <div className='w-full h-10 flex items-center justify-center rounded-lg'>
                    <div className='w-full h-full flex items-center gap-5'>
                      <div id='profile-picture' className='w-10 h-10 rounded-full bg-blue-500'>

                      </div>
                      <span className='text-lg'>Friend 4</span>
                    </div>
                  </div>
                  <div className='w-full h-10 flex items-center justify-center rounded-lg'>
                    <div className='w-full h-full flex items-center gap-5'>
                      <div id='profile-picture' className='w-10 h-10 rounded-full bg-blue-500'>

                      </div>
                      <span className='text-lg'>Friend 5</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div id='content' className='w-3/4 h-dvh bg-slate-100 flex flex-col'>
              <div id='content-container' className='w-full h-full py-5 px-7 flex flex-col'>
                <div id='content-nav' className='w-full flex items-center'>
                  <div id='nav-list' className='flex gap-5 flex-grow'>
                    <div className='h-10 py-1 px-3 rounded-lg text-lg'>
                      Friends
                    </div>
                    <div className='h-10 py-1 px-3 rounded-lg text-lg'>
                      Online
                    </div>
                    <div className='h-10 py-1 px-3 rounded-lg text-lg'>
                      All
                    </div>
                    <div className='h-10 py-1 px-3 rounded-lg text-lg'>
                      Pending
                    </div>
                    <div className='w-32'>
                      <ButtonPrimary text='Add Friend' onClick={() => console.log("fds")} />
                    </div>
                  </div>
                  <span>Start New Chat</span>
                </div>

                <div id='sub-content-container' className='flex w-full h-full mt-5'>
                  <div id='left-content' className='w-[70%] h-full border-r border-t border-slate-300 flex flex-col p-3 gap-5'>
                    <div className='w-full h-12 bg-slate-200 rounded-lg flex items-center p-2'>
                      <span className='text-slate-500 text-lg'>Search</span>
                    </div>

                    <span>Online - 2</span>

                    <div className='flex items-center gap-5'>
                      <div id='profile-picture' className='w-10 h-10 rounded-full bg-blue-500 relative'>
                        <div className='w-5 h-5 rounded-full bg-green-500 absolute top-7 right-0 border-3 border-white'></div>
                      </div>
                      <span className='text-lg'>Friend 1</span>
                    </div>

                    <div className='flex items-center gap-5'>
                      <div id='profile-picture' className='w-10 h-10 rounded-full bg-blue-500 relative'>
                        <div className='w-5 h-5 rounded-full bg-green-500 absolute top-7 right-0 border-3 border-white'></div>
                      </div>
                      <span className='text-lg'>Friend 1</span>
                    </div>
                  </div>
                  <div id='right-content' className='w-[30%] h-full border-r border-t border-slate-300 flex flex-col p-3 gap-5'>
                    <span className='font-bold text-xl'>Active Now</span>

                    <div className='w-full h-50 shadow-lg rounded-lg border-1 border-slate-300 p-3'>
                      <div className='flex items-center gap-5'>
                        <div id='profile-picture' className='w-10 h-10 rounded-full bg-blue-500 relative'>
                          <div className='w-5 h-5 rounded-full bg-green-500 absolute top-7 right-0 border-3 border-white'></div>
                        </div>
                        <span className='text-lg'>Friend 1</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default App
