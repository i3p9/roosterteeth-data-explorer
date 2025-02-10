import VideoJS from "@/app/components/molecules/VideoPlayer/VideoJS";
import React, { useRef, memo } from "react";
import { videoProgressService } from "@/services/videoProgressService";

const VjsPlayer = ({ downloadData, onVideoEnd, uuid }) => {
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

		// Save video progress every 5 seconds
		const progressInterval = setInterval(async () => {
			if (!player.paused()) {
				try {
					await videoProgressService.saveProgress(
						uuid,
						player.currentTime(),
						player.duration()
					);
					// Cleanup old entries occasionally
					await videoProgressService.cleanupOldEntries();
				} catch (error) {
					console.error("Failed to save video progress:", error);
				}
			}
		}, 10000);

		// Load saved progress when video loads
		player.on("loadedmetadata", async function () {
			try {
				const savedProgress = await videoProgressService.getProgress(
					uuid
				);
				if (savedProgress?.currentTime) {
					player.currentTime(savedProgress.currentTime);
				}
			} catch (error) {
				console.error("Failed to load video progress:", error);
			}
		});

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
			clearInterval(progressInterval);
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
