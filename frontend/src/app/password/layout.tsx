function PasswordLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex justify-center items-center w-full h-[90vh]">
      <div className="flex flex-col justify-between items-center gap-5">
        {children}
      </div>
    </div>
  );
}

export default PasswordLayout;
