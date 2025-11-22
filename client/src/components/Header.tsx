import { Slash } from 'lucide-react'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from './ui/breadcrumb'
import { Link } from 'react-router-dom'
import { ReactNode } from 'react'

interface HeaderProps {
  page: string
  action?: ReactNode
}

const Header = ({ page, action }: HeaderProps) => {
  return (
    <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{page}</h1>
        <Breadcrumb className="mt-2">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild><Link to='/'>Inicio</Link></BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator><Slash /></BreadcrumbSeparator>
            <BreadcrumbItem><BreadcrumbPage>{page}</BreadcrumbPage></BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      {action && <div>{action}</div>}
    </header>
  )
}

export default Header
