'use client'

export default function Footer() {
  const footerSections = [
    {
      id: 0,
      title: 'STAYHUB',
      description: 'The simplest way to find and book beautiful hotels.',
    },
    {
      id: 1,
      title: 'EXPLORE',
      links: [
        { href: '/hotels', label: 'Browse Hotels' },
        { href: '/bookings', label: 'My Trips' },
        { href: '/list-hotel', label: 'Become a Host' },
      ],
    },

  ]

  return (
    <footer className="bg-background border-t-2 border-foreground">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-16">
          {footerSections.map((section) => (
            <div key={section.id} className="space-y-4">
              <h3 className="text-lg font-black text-foreground uppercase tracking-wide">
                {section.title}
              </h3>
              {section.description && (
                <p className="text-muted-foreground font-light text-sm">
                  {section.description}
                </p>
              )}
              {section.links && (
                <ul className="space-y-2">
                  {section.links.map((link, idx) => (
                    <li key={idx}>
                      <a
                        href={link.href}
                        className="text-muted-foreground text-sm font-light hover:underline transition-all duration-300"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>

        <div className="border-t-2 border-foreground pt-8">
          <p className="text-center text-muted-foreground font-light text-sm">
            © 2024 StayHub. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
