import { Footer } from "flowbite-react";
import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';

export function FooterContent() {
  return (
    <Footer container={true}>
      <div className="w-full p-4 bg-gray-800 text-dark">
        <div className="d-flex items-center justify-content-evenly grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Footer.Title title="About" />
            <Footer.LinkGroup col={true}>
              <Footer.Link href="#">Our Story</Footer.Link>
              <Footer.Link href="#">Team</Footer.Link>
              <Footer.Link href="#">Careers</Footer.Link>
            </Footer.LinkGroup>
          </div>
          <div>
            <Footer.Title title="Services" />
            <Footer.LinkGroup col={true}>
              <Footer.Link href="#">Web Development</Footer.Link>
              <Footer.Link href="#">App Development</Footer.Link>
              <Footer.Link href="#">Consulting</Footer.Link>
            </Footer.LinkGroup>
          </div>
          <div>
            <Footer.Title title="Resources" />
            <Footer.LinkGroup col={true} className="">
              <Footer.Link href="#">Blog</Footer.Link>
              <Footer.Link href="#">FAQ</Footer.Link>
              <Footer.Link href="#">Contact Us</Footer.Link>
            </Footer.LinkGroup>
          </div>
          <div>
            <Footer.Title title="Follow Us" />
            <Footer.LinkGroup col={true} className="d-flex">
              <div className="d-flex space-x-4">
                <Footer.Link href="https://facebook.com"><FaFacebook /></Footer.Link>
                <Footer.Link href="https://twitter.com"><FaTwitter /></Footer.Link>
                <Footer.Link href="https://instagram.com"><FaInstagram /></Footer.Link>
              </div>
            </Footer.LinkGroup>
          </div>
        </div>
        <div className="d-flex justify-content-center align-items-end mt-8 border-t border-gray-700 pt-4 fs-4">
          <span>&copy; {new Date().getFullYear()} kodion software pvt. ltd</span>
        </div>
      </div>
    </Footer>
  )
}