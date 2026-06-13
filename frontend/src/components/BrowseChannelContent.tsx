import React from 'react'
import ButtonPrimary from './ButtonPrimary'
import Input from './Input'

const BrowseChannelContent = () => {
  return (
   <div id='content-container' className='w-full h-full py-5 px-7 flex flex-col'>
        <div id='content-nav' className='w-full flex items-center gap-5'>
            <div className='w-11/12'>
                <Input label='' onInputChanged={() => console.log("")} />
            </div>
            <div className='w-[17%]'>
                <ButtonPrimary text='Create' onClick={() => console.log("")} />
            </div>
        </div>

        <div id='sub-content-container' className='flex w-full h-full mt-5'>
            <div id='channel-list-table' className='border border-slate-300 w-full rounded-lg h-fit'>
                <div className='w-full flex justify-between items-center p-5 border-b border-slate-300'>
                    <span>Test</span>
                    <input type='checkbox' />
                </div>
                <div className='w-full flex justify-between items-center p-5 border-b border-slate-300'>
                    <span>Test</span>
                    <input type='checkbox' />
                </div>
                <div className='w-full flex justify-between items-center p-5 border-b border-slate-300'>
                    <span>Test</span>
                    <input type='checkbox' />
                </div>
                <div className='w-full flex justify-between items-center p-5 border-b border-slate-300'>
                    <span>Test</span>
                    <input type='checkbox' />
                </div>
                <div className='w-full flex justify-between items-center p-5 border-b border-slate-300'>
                    <span>Test</span>
                    <input type='checkbox' />
                </div>
                <div className='w-full flex justify-between items-center p-5 border-b border-slate-300'>
                    <span>Test</span>
                    <input type='checkbox' />
                </div>
                <div className='w-full flex justify-between items-center p-5 border-b border-slate-300'>
                    <span>Test</span>
                    <input type='checkbox' />
                </div>
                <div className='w-full flex justify-between items-center p-5 border-b border-slate-300'>
                    <span>Test</span>
                    <input type='checkbox' />
                </div>
                <div className='w-full flex justify-between items-center p-5 border-b border-slate-300'>
                    <span>Test</span>
                    <input type='checkbox' />
                </div>
                <div className='w-full flex justify-between items-center p-5 border-b border-slate-300'>
                    <span>Test</span>
                    <input type='checkbox' />
                </div>
                <div className='w-full flex justify-between items-center p-5 border-b border-slate-300'>
                    <span>Test</span>
                    <input type='checkbox' />
                </div>
                <div className='w-full flex justify-between items-center p-5 border-b border-slate-300'>
                    <span>Test</span>
                    <input type='checkbox' />
                </div>
                <div className='w-full flex justify-between items-center p-5 border-b border-slate-300'>
                    <span>Test</span>
                    <input type='checkbox' />
                </div>
                <div className='w-full flex justify-between items-center p-5 border-b border-slate-300'>
                    <span>Test</span>
                    <input type='checkbox' />
                </div>
                <div className='w-full flex justify-between items-center p-5 border-b border-slate-300'>
                    <span>Test</span>
                    <input type='checkbox' />
                </div>
                <div className='w-full flex justify-between items-center p-5 border-b border-slate-300'>
                    <span>Test</span>
                    <input type='checkbox' />
                </div>
                <div className='w-full flex justify-between items-center p-5 border-b border-slate-300'>
                    <span>Test</span>
                    <input type='checkbox' />
                </div>
                <div className='w-full flex justify-between items-center p-5 border-b border-slate-300'>
                    <span>Test</span>
                    <input type='checkbox' />
                </div>
                <div className='w-full flex justify-between items-center p-5 border-b border-slate-300'>
                    <span>Test</span>
                    <input type='checkbox' />
                </div>
                <div className='w-full flex justify-between items-center p-5 border-b border-slate-300'>
                    <span>Test</span>
                    <input type='checkbox' />
                </div>
                <div className='w-full flex justify-between items-center p-5 border-b border-slate-300'>
                    <span>Test</span>
                    <input type='checkbox' />
                </div>
                <div className='w-full flex justify-between items-center p-5 border-b border-slate-300'>
                    <span>Test</span>
                    <input type='checkbox' />
                </div>
                <div className='w-full flex justify-between items-center p-5 border-b border-slate-300'>
                    <span>Test</span>
                    <input type='checkbox' />
                </div>
                <div className='w-full flex justify-between items-center p-5'>
                    <span>Test</span>
                    <input type='checkbox' />
                </div>
            </div>
        </div>
    </div>
  )
}

export default BrowseChannelContent