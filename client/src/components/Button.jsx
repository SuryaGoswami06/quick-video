import React from 'react'

function Button({
    icon,
    text,
    type='button',
    className='',
    onClick,
}) {
  return (
    <button
    type={type}
    className={`${className!==''?`${className}`:'px-5 py-3'} flex items-center justify-center font-semibold capitalize`}
    onClick={onClick}
    >
      {icon && <img className='h-6 w-6 mr-2' src={icon} alt="button-icon" /> }
        <span>{text}</span>
    </button>
  )
}

export default Button