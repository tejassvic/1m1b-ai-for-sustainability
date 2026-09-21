/** @type {import('tailwindcss').Config} */
// Biophilic design tokens: soft greens, earthy browns, sky blues,
// botanical accents, organic radii, gentle natural-motion keyframes.
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        mist: '#F2F7F2', // page background
        pale: '#EAF1E7', // soft green surface
        sage: '#A8C3A0', // soft green
        fern: '#7FA36A', // mid green
        // Deepened from #6B8E5A so that moss text clears WCAG AA (4.5:1) on
        // mist and pale surfaces. The lighter mid-green reached only 3.4:1,
        // which failed for every eyebrow label on the site.
        moss: '#55743F', // primary green
        leaf: '#5E9C4F', // botanical accent (surfaces and icons)
        forest: '#4A6741', // brand / headings
        ink: '#2E3A32', // body text
        bark: '#8B6F5E', // earthy brown
        soil: '#6F523B', // deep brown
        sand: '#D9C7B2', // warm neutral
        stone: '#EDE6DA', // warm surface
        sky: '#B5D5E0', // soft sky blue
        mistblue: '#D6E6EC', // pale sky
        water: '#6B9BB0', // deep water
        pollen: '#E9C46A', // highlight accent (surfaces, fills, focus rings)
        // A lighter gold for text on the dark canopy band. Gold on deep green
        // tops out near 3.7:1 at the accent's own value, which is fine for a
        // fill but not for a label — this variant clears 5:1.
        honey: '#F5E3AE',
        blush: '#D4A5A5' // floral accent
      },
      fontFamily: {
        display: ['Fraunces', 'ui-serif', 'Georgia', 'serif'],
        sans: ['"Nunito Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif']
      },
      borderRadius: {
        pebble: '1.25rem',
        stone: '2rem',
        leaf: '1.75rem 4rem 1.75rem 4rem',
        blob: '58% 42% 62% 38% / 56% 44% 62% 38%'
      },
      boxShadow: {
        soft: '0 20px 40px -18px rgba(74, 103, 65, 0.25)',
        leaf: '0 14px 30px -14px rgba(94, 156, 79, 0.38)',
        sandy: '0 18px 36px -20px rgba(111, 82, 59, 0.30)',
        'inner-glow': 'inset 0 1px 0 rgba(255, 255, 255, 0.65)'
      },
      backgroundImage: {
        'mist-fade': 'linear-gradient(180deg, #F2F7F2 0%, #EAF1E7 100%)',
        'sky-fade': 'linear-gradient(180deg, #D6E6EC 0%, #F2F7F2 100%)',
        // Deepened so that light text and pollen-gold accents clear 4.5:1 on
        // every stop. The previous gradient brightened to #7FA36A, where mist
        // text sat at roughly 2.6:1 — unreadable rather than merely soft.
        canopy: 'linear-gradient(140deg, #2C4626 0%, #35502D 55%, #3A5531 100%)'
      },
      keyframes: {
        sway: {
          '0%, 100%': { transform: 'rotate(-4deg)' },
          '50%': { transform: 'rotate(4deg)' }
        },
        'sway-slow': {
          '0%, 100%': { transform: 'rotate(-2deg) translateY(0)' },
          '50%': { transform: 'rotate(2deg) translateY(-6px)' }
        },
        drift: {
          '0%': { transform: 'translateX(-15%)' },
          '100%': { transform: 'translateX(115%)' }
        },
        ripple: {
          '0%': { transform: 'scale(0.55)', opacity: '0.55' },
          '100%': { transform: 'scale(1.7)', opacity: '0' }
        },
        grow: {
          '0%': { transform: 'scale(0.85)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' }
        },
        typing: {
          '0%, 60%, 100%': { transform: 'translateY(0)', opacity: '0.35' },
          '30%': { transform: 'translateY(-4px)', opacity: '1' }
        }
      },
      animation: {
        sway: 'sway 7s ease-in-out infinite',
        'sway-slow': 'sway-slow 9s ease-in-out infinite',
        drift: 'drift 55s linear infinite',
        'drift-slow': 'drift 85s linear infinite',
        ripple: 'ripple 3.2s ease-out infinite',
        grow: 'grow 0.6s ease-out both',
        typing: 'typing 1.3s ease-in-out infinite'
      }
    }
  },
  plugins: []
}
