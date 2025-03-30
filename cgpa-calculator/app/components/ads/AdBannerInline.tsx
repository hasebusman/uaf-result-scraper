'use client'

import { useEffect } from 'react'

export function AdBannerInline() {
  useEffect(() => {
    try {
      const adsbygoogle = (window as any).adsbygoogle
      adsbygoogle.push({})
    } catch (err) {
      console.error('AdSense error:', err)
    }
  }, [])

  return (
    <div className="my-4 text-center">
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-2214888899948620"
        data-ad-slot="9269695404"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  )
}
