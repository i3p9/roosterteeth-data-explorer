import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import { FaRegQuestionCircle } from "react-icons/fa";
import Link from 'next/link';


const AboutPopUpContainer = () => {
    const PopUpContent = () => {
        return (
            <>
                <div className='p-4'>
                    <h1 className='text-xl font-black p-2'>so??? what am i looking at?</h1>
                    <p>This site was created after the announcment of the shut down of RoosterTeeth.</p>
                    <p>I host mostly the metadata of the roosterteeth site in attemps to salvage a backup of the roosterteeth content, because wb sucks.</p>
                    <br />
                    <p>If you want to contribute to the archival attemps, join us here on discord: <Link href="https://discord.gg/RnhHc47Wkb" target='_blank' className='text-blue-800'>https://discord.gg/RnhHc47Wkb</Link></p>
                </div>
            </>
        )
    }

    return (
        <>
            <Popup trigger={<button className="button float-right"> <span className='text-sm font-normal italic'><FaRegQuestionCircle style={{ display: 'inline' }} /></span> </button>} modal>
                <PopUpContent />
            </Popup>
        </>
    )
}

export default AboutPopUpContainer
