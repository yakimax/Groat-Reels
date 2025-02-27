'use client'
 
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
 
// Move Suspense boundary to wrap the component that uses useSearchParams
function Search() {
  return (
    <Suspense>
      <SearchInput />
    </Suspense>
  )
}

// Separate component that uses useSearchParams
function SearchInput() {
  const searchParams = useSearchParams()
  return <input placeholder="Search..." />
}
 
export function Searchbar() {
  return <Search />
}