import { useState } from 'react'

const ID_PREFIX = 'contact'

const FORMSPREE_ID = 'xpwzgwke'

type Status = 'idle' | 'sending' | 'success' | 'error'

interface Field {
  name: string
  label: string
  type: string
  required: boolean
  placeholder?: string
  options?: string[]
}

const FIELDS: Field[] = [
  { name: 'name', label: 'Full name', type: 'text', required: true, placeholder: 'e.g. John Smith' },
  { name: 'email', label: 'Email address', type: 'email', required: true, placeholder: 'john@example.com' },
  { name: 'phone', label: 'Phone number', type: 'tel', required: false, placeholder: '07700 900000' },
  {
    name: 'service',
    label: 'Type of work',
    type: 'select',
    required: true,
    options: [
      'Kitchen',
      'Bathroom',
      'Wet room',
      'Accessible bathroom',
      'Plumbing',
      'Boiler / heating',
      'Media wall',
      'Decking',
      'Garage conversion',
      'Fencing',
      'Other',
    ],
  },
  { name: 'message', label: 'Tell us about your project', type: 'textarea', required: true, placeholder: 'A brief description of the work you need — size, timescales, any special requirements…' },
]

export default function ContactForm() {
  const [status, setStatus] = useState<Status>('idle')
  const [errors, setErrors] = useState<Record<string, string>>({})

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)

    const newErrors: Record<string, string> = {}
    FIELDS.forEach(f => {
      if (f.required && !data.get(f.name)) {
        newErrors[f.name] = `${f.label} is required`
      }
    })
    if (Object.keys(newErrors).length) {
      setErrors(newErrors)
      const firstKey = Object.keys(newErrors)[0]
      const firstEl = form.elements.namedItem(firstKey) as HTMLElement | null
      requestAnimationFrame(() => firstEl?.focus())
      return
    }

    setStatus('sending')
    setErrors({})

    try {
      const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' },
      })
      if (res.ok) {
        setStatus('success')
        form.reset()
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="form-success" role="status" aria-live="polite">
        <div className="success-icon" aria-hidden="true">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="9 12 11 14 15 10"/></svg>
        </div>
        <h3>Message sent!</h3>
        <p>Thanks for getting in touch. We'll come back to you within one business day.</p>
        <button className="btn btn-secondary" onClick={() => setStatus('idle')}>Send another message</button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate action={`https://formspree.io/f/${FORMSPREE_ID}`} method="POST" aria-label="Contact RJW Renovations">
      {status === 'error' && (
        <div className="form-error-banner" role="alert">
          Something went wrong — please try again or call us directly.
        </div>
      )}

      <div className="form-fields">
        {FIELDS.map(f => {
          const id = `${ID_PREFIX}-${f.name}`
          const err = errors[f.name]

          return (
            <div key={f.name} className={`form-group${f.type === 'textarea' ? ' full-width' : ''}`}>
              <label htmlFor={id} className="form-label">
                {f.label}
                {f.required && <span className="required" aria-hidden="true"> *</span>}
              </label>

              {f.type === 'select' ? (
                <select
                  id={id}
                  name={f.name}
                  required={f.required}
                  className={`form-input${err ? ' has-error' : ''}`}
                  aria-invalid={err ? 'true' : undefined}
                  aria-describedby={err ? `${id}-err` : undefined}
                >
                  <option value="">Select one…</option>
                  {f.options!.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              ) : f.type === 'textarea' ? (
                <textarea
                  id={id}
                  name={f.name}
                  rows={5}
                  required={f.required}
                  placeholder={f.placeholder}
                  className={`form-input${err ? ' has-error' : ''}`}
                  aria-invalid={err ? 'true' : undefined}
                  aria-describedby={err ? `${id}-err` : undefined}
                />
              ) : (
                <input
                  id={id}
                  name={f.name}
                  type={f.type}
                  required={f.required}
                  placeholder={f.placeholder}
                  className={`form-input${err ? ' has-error' : ''}`}
                  aria-invalid={err ? 'true' : undefined}
                  aria-describedby={err ? `${id}-err` : undefined}
                />
              )}

              {err && (
                <span id={`${id}-err`} className="field-error" role="alert">{err}</span>
              )}
            </div>
          )
        })}
      </div>

      <p className="form-consent">
        By submitting you agree to us contacting you about your enquiry. We never share your details.
      </p>

      <button
        type="submit"
        className="btn btn-primary form-submit"
        disabled={status === 'sending'}
        aria-busy={status === 'sending'}
      >
        {status === 'sending' ? (
          <>
            <span className="spinner" aria-hidden="true" />
            Sending…
          </>
        ) : 'Request My Free Quote'}
      </button>

      <style>{`
        .form-fields {
          display: grid;
          grid-template-columns: 1fr;
          gap: 20px;
          margin-bottom: 16px;
        }
        @media (min-width: 640px) {
          .form-fields { grid-template-columns: 1fr 1fr; }
          .full-width { grid-column: 1 / -1; }
        }
        .form-group { display: flex; flex-direction: column; gap: 6px; }
        .form-label { font-size: 13px; font-weight: 500; color: var(--text); }
        .required { color: var(--red-text); }
        .form-input {
          background: var(--surface-3);
          border: 1px solid var(--border-sub);
          border-radius: 8px;
          padding: 11px 14px;
          color: var(--text);
          font-size: 14px;
          font-family: inherit;
          outline: none;
          transition: border-color 0.15s, box-shadow 0.15s;
          min-height: 44px;
          width: 100%;
          box-sizing: border-box;
        }
        .form-input::placeholder { color: var(--text-subtle); }
        .form-input:focus { border-color: var(--blue); box-shadow: 0 0 0 3px rgba(61,110,150,0.25); }
        .form-input.has-error { border-color: var(--red); }
        .form-input.has-error:focus { box-shadow: 0 0 0 3px rgba(204,34,41,0.25); }
        textarea.form-input { resize: vertical; min-height: 120px; }
        select.form-input { cursor: pointer; }
        .field-error { font-size: 12px; color: var(--red-text); }
        .form-error-banner {
          background: rgba(204,34,41,0.1);
          border: 1px solid rgba(204,34,41,0.3);
          border-radius: 8px;
          padding: 12px 16px;
          font-size: 14px;
          color: var(--red-text);
          margin-bottom: 20px;
        }
        .form-consent {
          font-size: 12px;
          color: var(--text-subtle);
          margin-bottom: 20px;
          line-height: 1.5;
        }
        .form-submit {
          width: 100%;
          justify-content: center;
          gap: 8px;
        }
        .spinner {
          display: inline-block;
          width: 16px; height: 16px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .form-success {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          text-align: center;
          padding: 48px 24px;
        }
        .success-icon {
          width: 64px; height: 64px;
          background: rgba(61,110,150,0.12);
          border: 1px solid rgba(61,110,150,0.3);
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          color: var(--blue-text);
        }
        .form-success h3 { font-size: 22px; color: var(--text); }
        .form-success p { color: var(--text-muted); font-size: 15px; max-width: 400px; }
      `}</style>
    </form>
  )
}
