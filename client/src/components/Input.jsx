import React, { useMemo } from 'react'

function Input({
    icon,
    type='text',
    placeholder,
    className='',
    onChange,
    value
}) {
    const id = useMemo(()=>Math.random()*1e10,[])
  return (
   <label htmlFor={id} className='relative w-full flex'>
       {icon && <img className='h-6 w-6 absolute top-3 left-2' src={icon} alt="input-icon" /> }
        <input 
        id={id}
        type={type} 
        value={value}
        placeholder={placeholder} 
        className={`${className!==''?className:'p-2'} pl-10 `}
        onChange={onChange}
        />
   </label>
  )
}

export default Input