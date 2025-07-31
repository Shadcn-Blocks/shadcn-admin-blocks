import React, { Suspense, useMemo } from 'react'
import { isMatch, Link, useMatches } from '@tanstack/react-router'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Skeleton } from '@/components/ui/skeleton'

declare module '@tanstack/react-router' {
  interface StaticDataRouteOption {
    hasClickableBreadcrumb?: boolean
    crumb?: React.ReactNode
  }
}

export const Breadcrumbs = () => {
  const matches = useMatches()

  const items = useMemo(() => {
    const matchesWithCrumbs = matches.filter((match) => isMatch(match, 'staticData.crumb'))

    return matchesWithCrumbs.map(({ pathname, staticData }) => ({
      href: pathname,
      label: staticData.crumb,
      isClickable: staticData.hasClickableBreadcrumb,
    })) as BreadcrumbsItem[]
  }, [matches])

  return <BreadcrumbsBase items={items} />
}

type BreadcrumbsItem = {
  href: string
  label: React.ReactNode
  isClickable: boolean
}
interface BreadcrumbsBaseProps {
  items: BreadcrumbsItem[]
}

export const BreadcrumbsBase = ({ items }: BreadcrumbsBaseProps) => {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {items.map((item, index) => (
          <React.Fragment key={index}>
            <BreadcrumbItem key={index}>
              <Suspense fallback={<Skeleton className="h-4 w-32" />}>
                {item.isClickable ? (
                  <Link to={item.href} className="breadcrumb-link">
                    {item.label}
                  </Link>
                ) : (
                  <span className="breadcrumb-link">{item.label}</span>
                )}
              </Suspense>
            </BreadcrumbItem>
            {index < items.length - 1 && <BreadcrumbSeparator />}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
