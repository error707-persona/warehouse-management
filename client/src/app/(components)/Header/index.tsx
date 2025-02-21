
type HeaderProps = {
    name: string;
}

const Header = ({name}: HeaderProps) => {
  return (
   <h1 className='text-2xl font-semibold text-gray-70'>
    {name}
   </h1>
  )
}

export default Header