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

interface BreadcrumbItemType {
  label: string
  href?: string
}

interface HeaderProps {
  page: string
  action?: ReactNode
  breadcrumbs?: BreadcrumbItemType[]
}

const Header = ({ page, action, breadcrumbs }: HeaderProps) => {
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
            
            {breadcrumbs ? (
              breadcrumbs.map((item, index) => (
                <div key={index} className="flex items-center">
                  <BreadcrumbItem>
                    {item.href ? (
                      <BreadcrumbLink asChild>
                        <Link to={item.href}>{item.label}</Link>
                      </BreadcrumbLink>
                    ) : (
                      <BreadcrumbPage>{item.label}</BreadcrumbPage>
                    )}
                  </BreadcrumbItem>
                  {index < breadcrumbs.length - 1 && (
                    <BreadcrumbSeparator className="ml-2"><Slash /></BreadcrumbSeparator>
                  )}
                </div>
              ))
            ) : (
              <BreadcrumbItem><BreadcrumbPage>{page}</BreadcrumbPage></BreadcrumbItem>
            )}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      {action && <div>{action}</div>}
    </header>
  )
}

export default Header
