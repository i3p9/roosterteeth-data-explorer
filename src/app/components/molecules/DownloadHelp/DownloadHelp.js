const { FaInfoCircle } = require("react-icons/fa")

const DownloadHelp = () => {
    return (
        <>
            <div className="bg-yellow-200 dark:bg-yellow-900 p-2 rounded text-color-primary">
                <p className="font-medium flex items-center gap-1">
                    <FaInfoCircle style={{ 'display': 'inline' }} /> {' '}
                    how to download
                </p>
                <p>
                    You can download the entire show or pick a specific season. Just choose what you want (video/info/both), and the links will be copied to your clipboard. Then you can paste them into your favorite download manager, like jDownloader2. You can also click on a season to see individual episodes.                </p>
            </div>

        </>
    )
}

export default DownloadHelp
