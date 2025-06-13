function TextField({ color, data, header, setFunction, isRequired = false, password = false }) {
  const isInvalid = isRequired && !data?.trim();

  return (
    <div className="flex flex-col mb-3">
      <h1 className={`text-xl font-bold text-${color} hover:scale-105 ease-(--my-beizer) duration-200`}>{header}</h1>
      <input
        type={`${password ? 'password' : 'text'}`}
        value={data}
        placeholder={`Enter ${header}`}
        onChange={(e) => setFunction(e.target.value)}
        className={`text-lg text-neutral-600 border-2 rounded-md p-1 hover:shadow-xl/10 hover:scale-105 ease-(--my-beizer) duration-200
          ${isInvalid ? 'border-red-500 ring-1 ring-red-300' : `border-${color}`}`}
      />
      {isInvalid && (
        <span className="text-red-400 text-sm mt-1">This field is required.</span>
      )}
    </div>
  );
}

export default TextField;
