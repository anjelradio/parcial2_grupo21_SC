
function Error({children} : {children: React.ReactNode}) {
  return (
    <p className="text-left text-red-500 font-light  ">{children}</p>
  )
}

export default Error