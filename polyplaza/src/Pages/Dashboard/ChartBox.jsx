function ChartBox( {children, title} ) {

  return (
    <div className='flex flex-col p-5 border-2 bg-neutral-100 hover:scale-105 hover:shadow-2xl shadow-xl duration-200 ease-(--my-beizer) rounded-xl gap-3'>
      <p className='text-xl text-neutral-500 text-center font-extrabold'>{title}</p>
      <div className={`flex flex-col w-110 h-full`}>
        {children}
      </div>
    </div>
  );
}

export default ChartBox;