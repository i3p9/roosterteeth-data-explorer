import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import { FaRegQuestionCircle } from "react-icons/fa";

const DownloadHelpPopUp = () => {
    const PopUpContent = () => {
        return (
            <>
                <div className='p-4'>
                    <h1 className='text-xl font-black p-2'>Downloading from Archive.org</h1>
                    <p>By clicking Copy All Archive.org Links, you will capture every <span className='italic text-pink-800'>archived</span> episode links found on this page, courtesy of archive.org </p>
                    <br />
                    <p>These links enable easy bulk downloading of episodes using tools like jDownloader and others for personal archival.</p>
                </div>
            </>
        )
    }

    return (
        <>
            <Popup trigger={<button className="button float-right text-color-primary"> <span className='text-sm font-normal italic ml-1'>{''}<FaRegQuestionCircle style={{ display: 'inline' }} /></span> </button>} modal>
                <PopUpContent />
            </Popup>
        </>
    )
}

export default DownloadHelpPopUp
