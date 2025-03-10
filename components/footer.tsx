export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="container mx-auto px-4 text-center">
      <p>
  &copy; 2025{" "}
  <a
    href="https://ronoh-portfolio-14.vercel.app/"
    target="_blank"
    rel="noopener noreferrer"
    className="text-primary hover:underline"
  >
    Hoodie Hub
  </a>
  . All rights reserved.
</p>
        <div className="mt-4 space-x-4">
          <a href="#" className="hover:text-gray-300 transition-colors">
            Privacy Policy
          </a>
          <a href="#" className="hover:text-gray-300 transition-colors">
            Terms of Service
          </a>
          <a href="/#contact" className="hover:text-gray-300 transition-colors">
  Contact Us
</a>

        </div>
      </div>
    </footer>
  )
}

