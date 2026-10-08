CREATE TABLE public.contact_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  message text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT contact_submissions_name_length CHECK (char_length(name) BETWEEN 1 AND 120),
  CONSTRAINT contact_submissions_email_length CHECK (char_length(email) BETWEEN 3 AND 255),
  CONSTRAINT contact_submissions_phone_length CHECK (char_length(phone) <= 40),
  CONSTRAINT contact_submissions_message_length CHECK (char_length(message) BETWEEN 1 AND 5000)
);

GRANT INSERT ON public.contact_submissions TO anon, authenticated;
GRANT ALL ON public.contact_submissions TO service_role;

ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Visitors can submit contact requests"
  ON public.contact_submissions
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

COMMENT ON TABLE public.contact_submissions IS 'Contact page submissions. No read policy: rows are visible only to the owner via service access.';