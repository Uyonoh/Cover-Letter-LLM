import Link from "next/link";

function Header() {
    return(
        <div>
            <header className="py-5 px-5 sm:px-7 md:px-10 relative flex justify-between border-b border-[#0f3760]">
                <div className="logo">CoverLetterLLM</div>

                <div className="absolute md:hidden top-5 right-5">##</div>
                {/* Desktop nav */}
                <nav className="hidden md:flex">
                    <ul className="flex gap-5">
                        <li><Link href="">Create</Link></li>
                        <li><Link href="">Letters</Link></li>
                        <li><Link href="">About</Link></li>
                    </ul>
                </nav>
            </header>
            {/* mobile nav */}
            <nav className="hidden flex flex-col">MNAV</nav>
        </div>
    )
}

export default Header;