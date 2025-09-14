export const FileInput = ({ label, name, accept, onChange }) => {
  return (
    <div className="flex flex-col space-y-1">
      <label className="text-gray-300">{label}</label>
      <input
        type="file"
        name={name}
        accept={accept}
        className="w-full text-sm text-gray-300 bg-gray-700 rounded p-2"
        onChange={onChange}
      />
    </div>
  );
};
