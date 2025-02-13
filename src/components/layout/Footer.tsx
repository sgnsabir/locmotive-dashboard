import React, { FC } from "react";

const Footer: FC = () => {
  return (
    <footer className="p-4 mt-8 text-center bg-gray-800 text-white">
      <p>
        &copy; {new Date().getFullYear()} Locomotive Dashboard. All rights
        reserved.
      </p>
    </footer>
  );
};

export default Footer;
