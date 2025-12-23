export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-[#323232] bg-[#1e1e1e] py-4 px-4">
      <div className="max-w-7xl mx-auto text-center">
        <p className="text-xs text-gray-400 mb-1">
          © {currentYear} JavaCodingPractice.com. All rights reserved.
        </p>
        <p className="text-xs text-gray-500">
          Developed By Om Prakash Peddamadthala
        </p>
      </div>
    </footer>
  );
}
