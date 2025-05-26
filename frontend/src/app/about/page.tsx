import {
  ShieldCheckIcon,
  LockClosedIcon,
  ClockIcon,
  EyeIcon,
  MoonIcon,
  UserIcon,
  CodeBracketIcon,
  Cog6ToothIcon,
  WrenchScrewdriverIcon,
  RocketLaunchIcon,
} from '@heroicons/react/24/outline';

export default function AboutPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-12 space-y-16 text-gray-800 dark:text-gray-100">
      <section>
        <h1 className="text-4xl font-bold mb-4 flex items-center gap-2">
          <ShieldCheckIcon className="w-8 h-8 text-blue-600" /> About
          SecurePaste
        </h1>
        <p className="text-lg">
          <strong>SecurePaste</strong> is a privacy-first, secure pastebin
          alternative for sharing sensitive text and code snippets — designed
          with both <strong>everyday users</strong> and{' '}
          <strong>developers</strong> in mind.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-2 flex items-center gap-2">
          <UserIcon className="w-6 h-6 text-green-600" /> For Users
        </h2>
        <p className="mb-4">
          SecurePaste is built to make private sharing of sensitive content
          fast, safe, and simple — <strong>no signup required</strong>.
        </p>
        <ul className="list-disc list-inside space-y-1">
          <li className="flex items-center gap-2">
            <LockClosedIcon className="w-5 h-5 text-blue-500" /> End-to-End
            Encryption
          </li>
          <li className="flex items-center gap-2">
            <LockClosedIcon className="w-5 h-5 text-purple-500" /> Optional
            Password Protection
          </li>
          <li className="flex items-center gap-2">
            <ShieldCheckIcon className="w-5 h-5 text-red-500" />{' '}
            Self-Destructing Links
          </li>
          <li className="flex items-center gap-2">
            <ClockIcon className="w-5 h-5 text-yellow-500" /> Custom Expiry
            Times
          </li>
          <li className="flex items-center gap-2">
            <EyeIcon className="w-5 h-5 text-pink-500" /> View Limits
          </li>
          <li className="flex items-center gap-2">
            <MoonIcon className="w-5 h-5 text-indigo-500" /> Full Dark Mode
            Support
          </li>
          <li className="flex items-center gap-2">
            <LockClosedIcon className="w-5 h-5 text-gray-500" /> No Account
            Needed
          </li>
        </ul>

        <h3 className="text-lg font-medium mt-6">🧑‍💼 Use Cases</h3>
        <ul className="list-disc list-inside space-y-1">
          <li>Securely share credentials or sensitive notes</li>
          <li>Send one-time passwords or secure links</li>
          <li>Temporarily store logs or config files</li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-2 flex items-center gap-2">
          <CodeBracketIcon className="w-6 h-6 text-orange-500" /> For Developers
        </h2>
        <p className="mb-4">
          SecurePaste is built with scalability, extensibility, and security
          best practices in mind.
        </p>

        <h3 className="text-lg font-medium flex items-center gap-2">
          <Cog6ToothIcon className="w-5 h-5 text-cyan-500" /> Tech Stack
        </h3>
        <ul className="list-disc list-inside space-y-1">
          <li>Frontend: Next.js + TailwindCSS</li>
          <li>Backend: NestJS with Joi validation</li>
          <li>Database: PostgreSQL with Prisma ORM</li>
          <li>Client-side Encryption</li>
          <li>Docker-ready Deployment</li>
        </ul>

        <h3 className="text-lg font-medium mt-6 flex items-center gap-2">
          <WrenchScrewdriverIcon className="w-5 h-5 text-fuchsia-500" /> Dev
          Features
        </h3>
        <ul className="list-disc list-inside space-y-1">
          <li>Modular NestJS backend</li>
          <li>Typed API with full validation</li>
          <li>Reusable UI components with Tailwind</li>
          <li>Typed error handling and hooks</li>
          <li>Extensible expiry and view-limit logic</li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-2 flex items-center gap-2">
          <RocketLaunchIcon className="w-6 h-6 text-violet-600" /> Open Source
          Mission
        </h2>
        <p className="text-lg">
          SecurePaste is an open-source project built to empower users and
          developers with secure, private content sharing. No tracking. No
          compromise.
        </p>
        <blockquote className="border-l-4 border-blue-500 pl-4 italic text-blue-600 dark:text-blue-400 mt-4">
          “Your secrets. Your control. Forever.”
        </blockquote>
      </section>
    </main>
  );
}
