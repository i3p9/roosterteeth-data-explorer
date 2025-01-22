import VideoJS from "@/app/components/molecules/VideoPlayer/VideoJS";
import React, { useRef, memo } from "react";
const VjsPlayer = ({ downloadData, onVideoEnd }) => {
	const videoFile = downloadData?.files.find(
		(file) => file.file_ext === "mp4" || file.file_ext === "mkv"
	);

	const url = `https://archive.org/download/${downloadData.id}/${videoFile.name}`;

	const playerRef = useRef(null);

	function showSpinner(player) {
		if (player) {
			player.addClass("vjs-seeking");
		}
	}

	function hideSpinner(player) {
		if (player) {
			player.removeClass("vjs-seeking");
		}
	}

	const videoJsOptions = {
		autoplay: true,
		controls: true,
		responsive: true,
		fluid: true,
		sources: [
			{
				src: url,
				type: "video/mp4",
			},
		],
	};

	const handlePlayerReady = (player) => {
		playerRef.current = player;

		player.on("play", function () {
			// console.log("Player is playing");
		});

		player.on("waiting", function () {
			// console.log("Player is waiting");
		});

		player.on("loadeddata", function () {
			// console.log("Player has loadeddata");
			//todo:fhm:spinner while loadeddata finishes
		});

		player.on("dispose", () => {
			// console.log("Player will dispose");
		});
		player.on("ended", () => {
			// console.log("Video has ended");
			if (onVideoEnd) {
				onVideoEnd();
			}
		});
	};
	return (
		<div className='video-wrapper mt-2 rounded-lg'>
			<VideoJS options={videoJsOptions} onReady={handlePlayerReady} />
		</div>
	);
};

const areEqual = (prevProps, nextProps) => {
	return (
		prevProps.downloadData.id === nextProps.downloadData.id &&
		prevProps.onVideoEnd === nextProps.onVideoEnd
	);
};

export default memo(VjsPlayer, areEqual);
