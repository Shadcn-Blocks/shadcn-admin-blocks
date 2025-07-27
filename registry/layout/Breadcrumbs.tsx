import React, { useMemo } from 'react'
import { isMatch, Link, useMatches, useRouter } from '@tanstack/react-router'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

export const Breadcrumbs = () => {
  // const router = useRouter()
  const matches = useMatches()

  const items = useMemo(() => {
    const matchesWithCrumbs = matches.filter((match) => isMatch(match, 'loaderData.crumb'))

    return matchesWithCrumbs.map(({ pathname, loaderData, staticData }) => ({
      href: pathname,
      label: loaderData?.crumb,
      isClickable: staticData.hasClickableBreadcrumb,
    }))
  }, [matches])

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {items.map((item, index) => (
          <React.Fragment key={index}>
            <BreadcrumbItem key={index}>
              {item.isClickable ? (
                <Link to={item.href} className="breadcrumb-link">
                  {item.label}
                </Link>
              ) : (
                <span className="breadcrumb-link">{item.label}</span>
              )}
            </BreadcrumbItem>
            {index < items.length - 1 && <BreadcrumbSeparator />}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
